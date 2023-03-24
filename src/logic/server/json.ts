import * as fs from 'fs/promises';
import { tmpdir } from 'os';
import { IncomingForm } from 'formidable';
import type { Fields, Files, File } from 'formidable';
import type { NextApiRequest } from 'next';

/**
 * Extract the json file from the form data using formidable
 *
 * @param req NextApiRequest
 * @returns Promise<{ files, fields }>
 */
export const processUploadRequest = async (req: NextApiRequest): Promise<{ files: Files; fields: Fields }> =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: tmpdir(),
      keepExtensions: false,
      maxFileSize: 5 * 1024 * 1024, //5mb
    });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      resolve({ fields, files });
    });
  });

/**
 * parse a json file from an upload
 *
 * @param file File
 * @returns parsed JSON
 */
export const parseJsonFile = async (file: File) => {
  // read and parse the json file
  const json = await fs.readFile(file.filepath, { encoding: 'utf-8' });
  return JSON.parse(json);
};
