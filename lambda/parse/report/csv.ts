/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer';
import type { AnalyticTarget } from 'src/types/csv';

/**
 * getUserProperty
 *
 * Prof has a hardcoded assumption that the data will have a top-level `User` property on a DU
 * but this is not an assumption that can apply to other designs.  Instead we check for the
 * existance of a "DU Name" column which is set in the AC-generated csv files.  To support
 * the "prof csvs", we fallback to look for a DU property called "User" (du.User), and then an
 * outright column called "User".
 *
 * better suggestions on a postcard...
 *
 * @param u - analytic data object
 * @returns String|undefined
 */
export const getUserProperty = (u: any) => u['DU Name'] || u.du?.User || u.User;

/*
 *
 * @param d - analytic data object
 * @returns String|undefined
 */
export const getTargetName = (u: AnalyticTarget) => u['Target Name'];

/**
 * Helper function to concat each term type from the csv to the same list from the org properties
 *
 * @param orgTerms - map which contains organisation term keys
 * @param csvTerms - object which contains csv term keys
 * @param orgKey - organisation term key to concat
 * @param csvKey - csv term key to concat
 * @returns object with org & csv terms matching org & csv key concatenated together
 */
export const concatCsvTermsWithOrgTerms = (
  orgTerms: Record<string, string[]>,
  csvTerms: Record<string, any>,
  orgKey: string,
  csvKey: string
) =>
  produce(orgTerms, (draftOrgTerms) => {
    if (csvTerms[csvKey]) {
      draftOrgTerms[orgKey] = [...new Set((draftOrgTerms[orgKey] ?? []).concat(Object.keys(csvTerms[csvKey] ?? [])))];
    }
  });
