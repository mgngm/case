import type { CsvJSON, Levers } from 'src/types/csv';
import { NA_VALUE } from './constants';

/**
 * validateJsonCsv
 *
 * Function to validate, at a basic level, whether a csv
 * json object is valid or not. Amoungst other things it
 * checks whether the csv contains data and the necessary
 * columns.
 *
 * @param json - json as parsed from a csv
 * @returns object
 * @throws Error with appropriate message
 */
export const validateJsonCsv = (json: CsvJSON) => {
  if (!json) {
    // empty json object
    throw new Error('Could not parse CSV file.');
  }

  if (!Array.isArray(json)) {
    // invalid json content
    throw new Error('Could not parse CSV file.');
  }

  if (json.length === 0) {
    throw new Error('Uploaded CSV file has no data rows.');
  }

  return json;
};

export const hasPersonaTerm = (
  analytic: Record<string, Record<string, string[]>>,
  personaTerm: { termType: string; value: string }
) => {
  if (!personaTerm) {
    return false;
  }

  if (personaTerm.termType in analytic) {
    if (!analytic[personaTerm.termType]) {
      return false;
    }

    if (personaTerm.value in analytic[personaTerm.termType]) {
      if (!analytic[personaTerm.termType][personaTerm.value]) {
        return false;
      }

      return true;
    }
  }
  return false;
};

/**
 * hasValidScores
 *
 * checks mean & potential scores exist, are numbers,
 * and are in the valid range (0-100)
 *
 * @param analytic - analytic data object
 * @returns boolean
 */
export const hasValidScores = (analytic: Record<string, unknown>, meanKey: string, potentialKey: string) =>
  analytic[potentialKey] !== undefined &&
  analytic[potentialKey] !== null &&
  analytic[potentialKey] !== NA_VALUE &&
  analytic[potentialKey] !== '' &&
  !Number.isNaN(Number(analytic[potentialKey])) &&
  Number(analytic[potentialKey]) >= 0 &&
  Number(analytic[potentialKey]) <= 100 &&
  analytic[meanKey] !== undefined &&
  analytic[meanKey] !== null &&
  analytic[meanKey] !== NA_VALUE &&
  analytic[meanKey] !== '' &&
  !Number.isNaN(Number(analytic[meanKey])) &&
  Number(analytic[meanKey]) >= 0 &&
  Number(analytic[meanKey]) <= 100;

/**
 * validate levers
 *
 * @param param0 Levers object
 * @param normalised - if false, normalise levers before validation
 * @returns boolean
 */
export const validateLevers = ({ hybridLower, hybridUpper, workingDays }: Levers, normalised = false) => {
  if (
    hybridLower === null ||
    hybridLower === undefined ||
    hybridUpper === null ||
    hybridUpper === undefined ||
    workingDays === null ||
    workingDays === undefined
  ) {
    return false;
  }

  if (Number.isNaN(hybridLower) || Number.isNaN(hybridUpper) || Number.isNaN(workingDays)) {
    return false;
  }

  if (!normalised) {
    hybridLower = hybridLower / 100;
    hybridUpper = hybridUpper / 100;
  }

  if (hybridLower < 0 || hybridLower > 1) {
    return false;
  }

  if (hybridUpper < 0 || hybridUpper > 1) {
    return false;
  }

  if (hybridLower + hybridUpper > 1) {
    return false;
  }

  if (hybridLower > 0.2) {
    return false;
  }

  if (hybridUpper < 0.8) {
    return false;
  }

  if (workingDays < 0) {
    return false;
  }

  if (workingDays > 366) {
    return false;
  }

  return true;
};
