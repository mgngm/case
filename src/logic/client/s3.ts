import { Storage } from 'aws-amplify';
import { getAuthHeader } from 'src/slices/api';
import type { ReportData } from 'src/types/report';

/**
 * delete a list of s3 objects
 *
 * @param keys string[]
 */
export const s3Cleanup = async (keys: string[]) => {
  for (const key of keys) {
    if (key === '/') {
      //DON'T EVER.
      continue;
    }
    try {
      await Storage.remove(key);
    } catch (err) {
      // console.log only, we don't need to bother the user with this
      console.error(err);
    }
  }
};

/**
 * Lists files in S3, filtered by string if supplied
 * @param {string}: filter - filter string
 * @returns {string[]} : Array of filenames that match the filter.
 */
export const listS3Files = async (filter?: string) => {
  const files = await Storage.list(filter ?? '');
  return files.map((_file) => _file.key);
};

/**
 * Removes all files on S3 for a given Org ID (NOTE: I can't wait to use dynamo for this).
 * @param id - Org ID to search in S3 for (works for partner or org.)
 */
export const removeS3FilesForOrg = async (id: string) => {
  //quad lock idc.
  if (!id) {
    console.error('No ID supplied');
    return;
  }

  if (id === '/') {
    console.error('You just tried to delete "/" - NO.');
    return;
  }
  //This is to prevent a rogue partner id coming in without a slash (say `ae` and it wiping out half our s3 bucket) - dynamo pls
  let orgFilter = id;

  //Prevent rogue org names overriding each other (e.g. <partner>/<org1> not wiping out essentially "<partner>/<org>*" which would be bad.)
  if (!orgFilter.endsWith('/')) {
    orgFilter += '/';
  }

  try {
    //double lock
    if (orgFilter !== '/') {
      //First we want to get the files
      const filesToRemove = (await listS3Files(orgFilter)) as string[];
      //Then just nuke them :thumbsup:
      await s3Cleanup(filesToRemove);
    } else {
      console.error('You just tried to delete "/" - NO.');
    }
  } catch (e) {
    console.error(`Could not clear org files from S3 for ${id}`, e);
  }
};

/**
 * get report preview data from s3
 *
 * @param key string
 * @returns Promise<ReportData>
 */
export const getReportPreview = async (key: string): Promise<ReportData> => {
  // fetch the report from s3
  const s3Report = await Storage.get(key, { contentType: 'application/json', download: true });
  if (s3Report.Body) {
    // convert the downloaded report into JSON
    const reportData: ReportData = JSON.parse(await (s3Report.Body as Blob).text());

    // return the data
    return reportData;
  } else {
    throw new Error('Could not fetch report preview from s3');
  }
};

/**
 * Begins the process of migrating all report information from S3 to the dynamo table.
 */
export const migrateS3InfoToDynamo = async () => {
  //Fetch all filenames from S3, to pass to the API.
  const s3Files = await listS3Files();

  await fetch('/api/_internal/migration/s3', {
    method: 'POST',
    body: JSON.stringify(s3Files),
    headers: new Headers({ authorization: await getAuthHeader() }),
  });
};
