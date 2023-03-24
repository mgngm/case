import type { Readable } from 'stream';
import type { CognitoIdentityProviderClientConfig } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import type { Command as $Command } from '@aws-sdk/smithy-client';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import aws from 'src/aws-exports';
import type { ApiError } from 'src/slices/api';
import type { Tokens } from 'src/types/auth';
import type { Id, MaybePromise } from 'src/types/util';
import { getAuthTokens } from './auth';

export const readableToBuffer = async (readable: Readable) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

/**
 * Use to throw an API error from a logic function with a specified error code, optional readable message and meta (any other information)
 *
 * If error's thrown from inside a method handler, you should use `failWithCode` instead.
 *
 * @see MethodHandlerAPI
 */
export class ResError extends Error {
  constructor(
    /** Internal message to help with debugging */
    message: string,
    /** HTTP error code */
    public code: number,
    /** Optional message suitable for displaying in UI */
    public readableMessage?: string,
    /** any other information useful for the UI to use */
    public meta?: unknown
  ) {
    super(message);
  }
}

/**
 * Used to return a success response with a given code.
 *
 * Use `succeedWithCode` instead of this directly.
 *
 * @see MethodHandlerAPI
 */
class ResSuccess<ResponseType = any> {
  constructor(public data: ResponseType, public code: number) {}
}

type MethodHandlerAPI<ResponseType = any, Tokens = null, Authenticate extends boolean = true> = {
  /**
   * Extracted tokens from authentication header.
   *
   * `null` if endpoint has authentication disabled.
   */
  tokens: Authenticate extends true ? Tokens : null;
  /**
   * Throw an error with a specified HTTP code.
   * ```js
   * throw failWithCode(
   *   error.message, // Internal message to help with debugging
   *   400, // HTTP error code (defaults to 500)
   *   "File invalid", // Optional message suitable for displaying in UI
   *   { invalidFile: true } // any other information useful for the UI to use (optional)
   * );
   * ```
   */
  failWithCode: (...args: ConstructorParameters<typeof ResError>) => ResError;
  /**
   * Return a successful response with a specified HTTP code
   * ```js
   * return succeedWithCode(
   *   { id: createdPost.id }, // response data
   *   201 // HTTP code
   * );
   * ```
   */
  succeedWithCode: (...args: ConstructorParameters<typeof ResSuccess<ResponseType>>) => ResSuccess<ResponseType>;
};

export type MethodHandler<ResponseType = any, Tokens = null, Authenticate extends boolean = true> = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
  api: MethodHandlerAPI<ResponseType, Tokens, Authenticate>
) => MaybePromise<ResponseType | ResSuccess<ResponseType>>;

const httpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'] as const;

type HTTPMethod = typeof httpMethods[number];

/**
 * Chainable builder for handlers.
 * ```ts
 * builder
 *   .get<string>(() => "Yep")
 *   .put<void>(() => {})
 *   .default<string>(() => "Nope");
 * ```
 */
type HandlerMapBuilder<Tokens = null, Authenticate extends boolean = true> = Id<
  {
    /**
     * Add a handler for specified method
     */
    [Method in Lowercase<HTTPMethod>]: <ResponseType = any>(
      handler: MethodHandler<ResponseType, Tokens, Authenticate>
    ) => HandlerMapBuilder<Tokens, Authenticate>;
  } & {
    /**
     * Catchall method handler, to use if no other handlers matched.
     */
    default: <ResponseType = any>(handler: MethodHandler<ResponseType, Tokens, Authenticate>) => void; // disallow chaining from default (should be last)
  }
>;

const executeHandlerBuilderCallback = <Tokens = null, Authenticate extends boolean = true>(
  builderCallback: (builder: HandlerMapBuilder<Tokens, Authenticate>) => void
) => {
  const handlers: Record<string, MethodHandler<any, Tokens, Authenticate>> = {};
  let defaultHandler = undefined as MethodHandler<any, Tokens, Authenticate> | undefined;
  const makeBuilderMethod =
    (method: HTTPMethod): HandlerMapBuilder<Tokens, Authenticate>[Lowercase<HTTPMethod>] =>
    (handler) => {
      if (handlers[method]) {
        throw new Error('Cannot add handler for the same method twice');
      }
      if (defaultHandler) {
        throw new Error('Cannot add handler after default handler defined');
      }
      handlers[method] = handler;
      return builder;
    };
  const builder: HandlerMapBuilder<Tokens, Authenticate> = {
    ...(Object.fromEntries(
      httpMethods.map((method) => [method.toLowerCase() as Lowercase<HTTPMethod>, makeBuilderMethod(method)])
    ) as Pick<HandlerMapBuilder<Tokens, Authenticate>, Lowercase<HTTPMethod>>),
    default: (handler) => {
      if (defaultHandler) {
        throw new Error('Default handler can only be provided once');
      }
      defaultHandler = handler;
    },
  };
  builderCallback(builder);
  return [handlers, defaultHandler] as const;
};

const unwrapResponse = <ResponseType = any>(
  response: ResponseType | ResSuccess<ResponseType>,
  res: NextApiResponse<ResponseType>
) => {
  if (response instanceof ResSuccess) {
    return res.status(response.code).json(response.data);
  } else if (typeof response === 'undefined') {
    return res.status(204).end();
  } else {
    return res.status(200).json(response);
  }
};

const unwrapError = (e: unknown, res: NextApiResponse<ApiError & { ok: false }>) => {
  if (e instanceof ResError) {
    return res.status(e.code).json({
      ok: false, //todo remove ok
      error: e.message,
      ...(e.readableMessage && { message: e.readableMessage }),
      ...(!!e.meta && { meta: e.meta }),
    });
  }
  return res.status(500).json({
    ok: false,
    error: e instanceof Error ? e.message : 'Something went wrong',
  });
};

type MethodHandlersConfig<Authenticate extends boolean = true> = {
  /** Whether to check authentication header for correct tokens (true by default) */
  authenticate?: Authenticate;
};

type MethodHandlerFactoryConfig<Tokens = null> = {
  /**
   * Extract tokens from the request. If this throws/rejects, the request fails with a 401 error.
   * To have a different error code, throw/reject with a ResError instead.
   * ```ts
   * throw new ResError('Invalid path', 404);
   * ```
   */
  getTokens?: (req: NextApiRequest) => MaybePromise<Tokens>;
};

/**
 * Build an API handler factory with properly typed handlers per method.
 *
 * If a method handler doesn't return anything, the response will automatically use 204 No Content.
 * If a method handler returns data, then the response will use 200 OK.
 * To return a custom response code, return `succeedWithCode(data, code)`.
 *
 * If an uncaught error occurs, the response will automatically use 500 Internal Server Error.
 * To use a custom error code, throw `failWithCode(error, code)`.
 *
 * ```ts
 *
 * export const methodHandlers = createMethodHandlerFactory({ getTokens: (req) => getAuthTokens(req.headers) });
 *
 * // api/books/
 * export default methodHandlers((builder) => {
 *   builder
 *     .get<{ books: Book[] }>(async () => ({ books: await Book.findAll() }))
 *     .post<{ id: EntityId }>(async (req, res, { failWithCode, succeedWithCode }) => {
 *       const parseResult = BookSchema.safeParse(req.body);
 *       if (!parseResult.success) {
 *         throw failWithCode(parseResult.error.message, 400, 'Invalid book provided', parseResult.error);
 *       }
 *       const { id } = await Book.create(parseResult.data);
 *       res.setHeader('Location', `api/books/${id}`);
 *       return succeedWithCode({ id }, 201);
 *     });
 * });
 *
 * // api/books/:id
 *
 * export default methodHandlers((builder) => {
 *   builder
 *     .get<Book>(async (req, res, { failWithCode }) => await getBookFromReq(req))
 *     .patch<void>((req, res, { failWithCode }) => {
 *       const book = await getBookFromReq(req);
 *       const parseResult = BookSchema.partial().safeParse(req.body);
 *       if (!parseResult.success) {
 *         throw failWithCode(parseResult.error.message, 400, 'Invalid update provided', parseResult.error);
 *       }
 *       await book.update(parseResult.data);
 *       // we don't return anything, so code is automatically 204
 *     })
 *     .delete<void>((req) => {
 *       const book = await getBookFromReq(req);
 *       await book.delete();
 *     });
 *  });
 *
 * // api/auth/token
 *
 * export default methodHandlers(
 *   (builder) => {
 *     builder.post<{ token: string }>(async (req, res, { failWithCode }) => {
 *       const parseResult = BodySchema.safeParse(req.body);
 *       if (!parseResult.success) {
 *         throw failWithCode(parseResult.error.message, 400, 'Invalid body provided', parseResult.error);
 *       }
 *       const token = await getTokenForBody(parseResult.data);
 *       return { token };
 *     });
 *   },
 *   { authenticate: false } // disable authentication checking
 * );
 *
 * ```
 */
export const createMethodHandlerFactory =
  <Tokens = null>({ getTokens }: MethodHandlerFactoryConfig<Tokens> = {}) =>
  <Authenticate extends boolean = true>(
    builderCallback: (builder: HandlerMapBuilder<Tokens, Authenticate>) => void,
    { authenticate = true as Authenticate }: MethodHandlersConfig<Authenticate> = {}
  ): NextApiHandler => {
    const [handlers, defaultHandler] = executeHandlerBuilderCallback(builderCallback);
    return async (req, res) => {
      try {
        let tokens: Tokens | null = null;
        if (getTokens && authenticate) {
          try {
            tokens = await getTokens(req);
          } catch (e) {
            console.error(e);
            throw e instanceof ResError ? e : new ResError('Invalid authentication tokens', 401);
          }
        }
        const { method } = req;
        const api: MethodHandlerAPI<ResponseType, Tokens, Authenticate> = {
          tokens: tokens as Authenticate extends true ? Tokens : null,
          failWithCode: (...args) => new ResError(...args),
          succeedWithCode: (...args) => new ResSuccess(...args),
        };
        if (method && handlers[method]) {
          return unwrapResponse(await handlers[method](req, res, api), res);
        } else if (defaultHandler) {
          return unwrapResponse(await defaultHandler(req, res, api), res);
        } else {
          res.setHeader('Allow', Object.keys(handlers).join(', '));
          throw new ResError('Unsupported method', 405);
        }
      } catch (e) {
        console.error(e);
        return unwrapError(e, res);
      }
    };
  };

export const methodHandlers = createMethodHandlerFactory({
  getTokens: async (req) => {
    const tokens = await getAuthTokens(req.headers);
    if (!tokens) {
      throw new Error('Invalid authentication tokens');
    }
    return tokens;
  },
});

type ExtractCommandInput<Command extends $Command<any, any, any>> = Command extends $Command<infer Input, any, any>
  ? Input
  : never;

type ExtractCommandOutput<Command extends $Command<any, any, any>> = Command extends $Command<any, infer Output, any>
  ? Output
  : never;

// TODO: work out if there's a way of limiting this to commands that output a NextToken or PaginationToken
type CIPQueryFactoryProps<
  Command extends $Command<any, any, any>,
  ResKey extends Exclude<keyof ExtractCommandOutput<Command>, 'NextToken' | 'PaginationToken' | '$metadata'>
> = {
  tokens?: Tokens;
  command: new (input: ExtractCommandInput<Command>) => Command;
  input: ExtractCommandInput<Command>;
  resKey: ResKey;
  idpClient?: CognitoIdentityProviderClient;
};

/**
 * Paginated Cognito Identity Provider List Factory - pass the query/input you need and it'll go and fetch everything and return it, even if its paginated.
 * @param {CIPQueryFactoryProps} props - Query Parameters including command, input and the key you need to extract the result.
 * @returns
 */
export const CognitoIdentityProviderPaginatedListQuery = async <
  Command extends $Command<any, any, any>,
  ResKey extends Exclude<keyof ExtractCommandOutput<Command>, 'NextToken' | 'PaginationToken' | '$metadata'>
>({
  tokens,
  command: Command,
  input,
  resKey,
  idpClient,
}: CIPQueryFactoryProps<Command, ResKey>) => {
  const creds: CognitoIdentityProviderClientConfig = {
    region: aws.aws_cognito_region,
    maxAttempts: 10,
  };

  if (tokens) {
    creds.credentials = tokens;
  }
  //Create our client
  const client = idpClient ?? new CognitoIdentityProviderClient(creds);

  //Formulate the command and send it to the client.
  const _cmd = new Command(input);
  const res = await client.send(_cmd);

  //Extract the data you need (if available)
  const dataItems: any[] = res?.[resKey] ?? [];

  //Set the next Token from the request (naturally they're keyed differently based on what list request you use)
  let nextToken = (res?.NextToken || res?.PaginationToken) ?? null;

  //If we have a paginated request, do the same thing again until you get what you need.
  while (nextToken) {
    const _pCmd = new Command({ ...input, NextToken: nextToken });
    const pRes = await client.send(_pCmd);

    const paginatedDataItems: any[] = pRes?.[resKey] ?? [];
    dataItems.push(...paginatedDataItems);

    nextToken = (pRes?.NextToken || pRes?.PaginationToken) ?? null;
  }

  //Once we're all done, return all items.
  return dataItems as unknown as NonNullable<ExtractCommandOutput<Command>[ResKey]>;
};
