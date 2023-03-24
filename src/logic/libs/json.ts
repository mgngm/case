import type { SerializedError } from '@reduxjs/toolkit';
import { miniSerializeError } from '@reduxjs/toolkit';
import { Validator } from 'jsonschema';
import type { Schema } from 'jsonschema';
import { GraphQLErrorPolicyError } from 'src/logic/client/graphql/error';

/**
 * jsonschema lists all errors in a `errors` key
 *
 * @param err schema error
 * @returns all errors in an errors key
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isJSONSchemaError = (err: any): err is { errors: any[] } => !!err?.errors?.length;

export const validateJson = (
  text: string,
  schema: Schema,
  { rethrow }: { setError?: (s: string) => void; setErrorTitle?: (s: string) => void; rethrow?: boolean } = {}
) => {
  try {
    // validate the JSON itself
    const json = JSON.parse(text);

    // validate the json against the schema
    const validator = new Validator();
    // throw any errors
    const { valid } = validator.validate(json, schema, { throwFirst: true });

    if (valid) {
      return json;
    }
  } catch (err) {
    console.error(err);

    let errorTitle;
    let error;

    if (isJSONSchemaError(err)) {
      errorTitle = 'JSON validation error';
      error = err.errors[0].toString();
    } else if (err instanceof SyntaxError) {
      errorTitle = 'Invalid JSON detected';
      error = err.toString();
    } else {
      errorTitle = 'Unknown error';
      error = (err as Error).toString();
    }

    if (rethrow) {
      throw err;
    }

    return { valid: false, errorTitle, error };
  }
};

type SerializeTuple<Err extends Error> = [
  predicate: (err: Error) => err is Err,
  serialize: (err: Err) => SerializedError
];
export const makeSerializeTuple = <Err extends Error>(...tuple: SerializeTuple<Err>) => tuple;

const defaultSerializes: SerializeTuple<any>[] = [
  makeSerializeTuple(
    (err): err is GraphQLErrorPolicyError => err instanceof GraphQLErrorPolicyError,
    (err) => JSON.parse(JSON.stringify(err))
  ),
];

export const serializeError = (err: Error, customSerialize: SerializeTuple<any>[] = []) => {
  const allSerializes = customSerialize.concat(defaultSerializes);
  for (const [predicate, serialize] of allSerializes) {
    if (predicate(err)) {
      return serialize(err);
    }
  }
  return miniSerializeError(err);
};
