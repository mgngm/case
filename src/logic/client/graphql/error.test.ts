import type { GraphQLResult } from '@aws-amplify/api-graphql';
import { GraphQLError } from 'graphql';
import {
  GraphQLErrorPolicyError,
  parseWithErrorPolicy,
  safeParseWithErrorPolicy,
} from 'src/logic/client/graphql/error';
import { satisfies } from 'src/logic/libs/helpers';

describe('logic / client / graphql / error', () => {
  describe('(safe)ParseWithErrorPolicy', () => {
    const withoutErrors = satisfies<GraphQLResult<string>>()({ data: 'foo' });
    const withoutData = satisfies<GraphQLResult>()({ errors: [new GraphQLError('err')] });
    const withErrors: GraphQLResult<string> = { ...withoutErrors, ...withoutData };

    it('should throw if any errors are provided, with a policy of "none"', () => {
      expect(safeParseWithErrorPolicy(withoutData, 'none').success).toBe(false);
      expect(() => parseWithErrorPolicy(withoutData, 'none')).toThrow(GraphQLErrorPolicyError);

      expect(safeParseWithErrorPolicy(withErrors, 'none').success).toBe(false);
      expect(() => parseWithErrorPolicy(withErrors, 'none')).toThrow(GraphQLErrorPolicyError);

      expect(safeParseWithErrorPolicy(withoutErrors, 'none').success).toBe(true);
      expect(() => parseWithErrorPolicy(withoutErrors, 'none')).not.toThrow(GraphQLErrorPolicyError);
    });
    it('should exclude errors from final result with a policy of "ignore"', () => {
      expect(safeParseWithErrorPolicy(withoutData, 'ignore').success).toBe(false);
      expect(() => parseWithErrorPolicy(withoutData, 'ignore')).toThrow(GraphQLErrorPolicyError);

      expect(safeParseWithErrorPolicy(withErrors, 'ignore').success).toBe(true);
      expect(() => parseWithErrorPolicy(withErrors, 'ignore')).not.toThrow(GraphQLErrorPolicyError);

      expect(safeParseWithErrorPolicy(withoutErrors, 'ignore').success).toBe(true);
      expect(() => parseWithErrorPolicy(withoutErrors, 'ignore')).not.toThrow(GraphQLErrorPolicyError);

      expect(parseWithErrorPolicy(withErrors, 'ignore').errors).toBe(undefined);
    });
    it('should return both errors and data with a policy of "all"', () => {
      expect(safeParseWithErrorPolicy(withoutData, 'all').success).toBe(false);
      expect(() => parseWithErrorPolicy(withoutData, 'all')).toThrow(GraphQLErrorPolicyError);

      expect(safeParseWithErrorPolicy(withErrors, 'all').success).toBe(true);
      expect(() => parseWithErrorPolicy(withErrors, 'all')).not.toThrow(GraphQLErrorPolicyError);

      expect(safeParseWithErrorPolicy(withoutErrors, 'all').success).toBe(true);
      expect(() => parseWithErrorPolicy(withoutErrors, 'all')).not.toThrow(GraphQLErrorPolicyError);

      expect(parseWithErrorPolicy(withErrors, 'all')).toEqual(withErrors);
    });
  });
});
