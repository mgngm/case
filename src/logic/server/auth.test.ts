/* eslint-disable jest/no-conditional-expect */
import { encode } from 'base-64';
import type { FetchMock } from 'jest-fetch-mock';
import { getAuthTokens } from 'src/logic/server/auth';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((a, b, cb) => cb()),
}));
jest.mock('jwk-to-pem', () => jest.fn(() => 'pem'));

describe('logic/libs/admin.ts', () => {
  describe('getAuthTokens', () => {
    const inputs = [
      {
        name: 'no header',
        input: {},
        throws: true,
        expected: 'No Authorization header found',
      },
      {
        name: 'empty authorization header',
        input: { authorization: '' },
        throws: true,
        expected: 'No Authorization header found',
      },
      {
        name: 'unencoded fake header',
        input: { authorization: 'fake' },
        throws: true,
        expected: 'Invalid token encoding',
      },
      {
        name: 'encoded fake header',
        input: { authorization: encode('fake') },
        throws: true, // json parse failure
        expected: 'Uncaught SyntaxError: Unexpected token k in JSON at position 2',
      },
      {
        name: 'encoded invalid object header',
        input: { authorization: encode('{ "fake": "foo" }') },
        throws: true,
        expected: 'Invalid token signature: fake',
      },
      {
        name: 'encoded object missing a required key',
        input: { authorization: encode('{ "secretAccesskey": "", "accessKeyId": "" }') },
        throws: true,
        expected: 'Invalid token signature: secretAccessKey,accessKeyId',
      },
      {
        name: 'valid object, but empty values',
        input: {
          authorization: encode('{"secretAccessKey": "", "accessKeyId": "", "sessionToken": "", "userToken": ""}'),
        },
        throws: true,
        expected: 'Missing token values',
      },
      {
        name: 'valid object',
        input: {
          authorization: encode(
            '{"secretAccessKey": "a", "accessKeyId": "b", "sessionToken": "c", "userToken": "eyJraWQiOiJkIn0="}'
          ),
        },
        throws: false,
        expected: { secretAccessKey: 'a', accessKeyId: 'b', sessionToken: 'c', userToken: 'eyJraWQiOiJkIn0=' },
      },
    ];

    beforeEach(() => {
      (fetch as FetchMock).resetMocks();
    });

    inputs.forEach((test) => {
      it(`handles ${test.name}`, async () => {
        try {
          (fetch as FetchMock).mockResponseOnce(JSON.stringify({ keys: [{ kid: 'd' }] }));

          const output = await getAuthTokens(test.input);
          if (!test.throws) {
            expect(output).toStrictEqual(test.expected);
          }
        } catch (err) {
          if (err instanceof Error) {
            expect(err.message).toEqual(test.expected);
          } else {
            expect(err).toBe(Error);
          }
        }
      });
    });
  });
});
