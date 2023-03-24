/* eslint-disable @typescript-eslint/no-explicit-any */
import csv from 'csvtojson';
import type { CsvJSON, UpdatedHeaderTermsType } from 'src/types/csv';
import { CSV_FIELD_DU, CSV_FIELD_GROUP } from './constants';

export type UpdatedHeaderTypesType = { [CSV_FIELD_DU]: boolean; [CSV_FIELD_GROUP]: boolean };
/**
 * Function to replace the first instance of a du or dug term name in header which is a pure
 * numeric value to an alphanumeric value
 * @param rawText
 */
export function updateRawTextHeader(rawText: string) {
  let updatedRawText = rawText;
  const [header] = rawText.split('\n');

  const updatedHeaderTypes: UpdatedHeaderTypesType = { [CSV_FIELD_DU]: false, [CSV_FIELD_GROUP]: false };
  const updatedHeaderTerms: UpdatedHeaderTermsType = { [CSV_FIELD_DU]: null, [CSV_FIELD_GROUP]: null };
  const headerEntries = header.split(',');
  headerEntries.forEach((entry) => {
    const [type, term] = entry.split('.');
    if (type === CSV_FIELD_DU || type === CSV_FIELD_GROUP) {
      if (!updatedHeaderTypes[type]) {
        const num = term.match(/^[0-9]*$/);
        if (num && term === num[0]) {
          updatedHeaderTypes[type] = true;
          updatedHeaderTerms[type] = `_${term}`;
          updatedRawText = updatedRawText.replace(entry, `${type}._${term}`);
        }
      }
    }
  });
  return { updatedRawText, updatedHeaderTypes, updatedHeaderTerms };
}

/**
 * Function to replace the previously converted term name back to numeric value
 * so that the json data is as expected
 * @param jsonInput
 * @param updatedHeaderTerms
 * @param type
 */
export function convertUpdatedJson(
  jsonInput: Record<string, unknown>[],
  updatedHeaderTerms: UpdatedHeaderTermsType,
  type: string
) {
  const jsonOutput: Record<string, unknown>[] = [];
  if (updatedHeaderTerms[type]) {
    const oldKey = updatedHeaderTerms[type]?.substring(1);
    jsonInput.forEach((row: Record<string, unknown>) => {
      const newObject: Record<string, unknown> = {};
      Object.keys(row).forEach((key: string) => {
        if (key !== type) {
          newObject[key] = row[key];
        } else {
          const typeRow: any = row[key];
          const newType: Record<string, unknown> = {};
          Object.keys(typeRow).forEach((typeKey: string) => {
            if (oldKey && typeKey === updatedHeaderTerms[type]) {
              newType[oldKey] = typeRow[typeKey];
            } else {
              newType[typeKey] = typeRow[typeKey];
            }
          });
          newObject[key] = newType;
        }
      });
      jsonOutput.push(newObject);
    });
    return jsonOutput;
  } else {
    return jsonInput;
  }
}

/**
 * Convert uploaded csv to object
 *
 * @param csvText {string}
 * @returns Promise<CsvJSON>
 */
export const convertCsvToJson = async (csvText: string): Promise<CsvJSON> => {
  const { updatedRawText, updatedHeaderTypes, updatedHeaderTerms } = updateRawTextHeader(csvText);

  let jsonData = await csv().fromString(updatedRawText);

  //if the header was updated before creating the json data then we have to convert the json data
  //to correct the updated du and/or dug terms
  if (updatedHeaderTypes[CSV_FIELD_DU] || updatedHeaderTypes[CSV_FIELD_GROUP]) {
    let convertedBackJson = convertUpdatedJson(jsonData, updatedHeaderTerms, CSV_FIELD_DU);
    convertedBackJson = convertUpdatedJson(convertedBackJson, updatedHeaderTerms, CSV_FIELD_GROUP);

    jsonData = convertedBackJson as CsvJSON;
  }

  return jsonData;
};
