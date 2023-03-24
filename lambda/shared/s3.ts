import type internal from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import type { ListObjectsV2CommandInput, DeleteObjectCommandInput } from '@aws-sdk/client-s3';
import aws from 'src/aws-exports';

/**
 * Takes a readable stream and converts it to a string
 *
 * @param stream Readable
 * @returns Promise<string>
 */
export const streamToString = (stream: internal.Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

/**
 * Get an object from s3
 *
 * @param path string
 * @param tokens Tokens
 * @returns Promise<GetObjectCommandOutput>
 */
const getFromS3 = async (path: string, client?: S3Client) => {
  console.log('getFromS3');
  // define s3 parameters for the upload
  const s3Params = {
    Bucket: aws.aws_user_files_s3_bucket,
    Key: `public/${path}`,
  };

  // create an s3 client object
  const s3Client =
    client ??
    new S3Client({
      region: aws.aws_user_files_s3_bucket_region,
    });

  console.log(s3Params);

  try {
    console.log('s3Client.send');
    // get the file
    const result = await s3Client.send(new GetObjectCommand(s3Params));
    console.log(`successfully fetched ${s3Params.Bucket}/${s3Params.Key}`);
    return result;
  } catch (err) {
    console.log('error?', err);
    console.error(err);
    throw err;
  }
};

/**
 * Get an object from s3 and extract its body as a string
 *
 * @param path string
 * @param tokens Tokens
 * @returns Promise<string>
 */
export const getFromS3AsString = async (path: string) => {
  console.log('getFromS3AsString key:', path);
  try {
    // get the file
    const result = await getFromS3(path);
    console.log('getFromS3AsString got result..!');
    // parse the body as string
    const bodyString = await streamToString(result.Body as internal.Readable);
    console.log('s3 object body parsed successfully');
    return bodyString;
  } catch (err) {
    console.log('error?', err);
    console.error(err);
    throw err;
  }
};

/**
 * upload a file to s3
 *
 * @param path s3 path for file
 * @param body file buffer
 * @param tokens Tokens
 * @returns Promise<PutObjectCommandOutput>
 */
export const uploadToS3 = async (path: string, body: Buffer, disableCache = true, client?: S3Client) => {
  // define s3 parameters for the upload
  const s3Params = {
    Bucket: aws.aws_user_files_s3_bucket,
    Key: path,
    Body: body,
    // prevent caching of uploaded object
    ...(disableCache && { CacheControl: 'no-cache', Expires: new Date() }),
  };

  // create an s3 client object
  const s3Client =
    client ??
    new S3Client({
      region: aws.aws_user_files_s3_bucket_region,
    });

  try {
    // send the file
    const result = await s3Client.send(new PutObjectCommand(s3Params));
    console.log(`${s3Params.Key} successfully uploaded to ${s3Params.Bucket}/${s3Params.Key}`);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const findFilesInS3 = async (predicate: string, client?: S3Client, continuationToken?: string) => {
  console.log(`Listing files in the S3 bucket with predicate.... ${predicate}`);
  const files: Set<string> = new Set([]);
  // create an s3 client object
  const s3Client =
    client ??
    new S3Client({
      region: aws.aws_user_files_s3_bucket_region,
    });

  try {
    const s3Params: ListObjectsV2CommandInput = {
      Bucket: aws.aws_user_files_s3_bucket,
      Prefix: `public/upload/${predicate}/`, //predicate usually a formatted or name like ae/ae.
    };

    //If we are making a paginated request.
    if (continuationToken) {
      s3Params.ContinuationToken = continuationToken;
    }

    console.log(`Scanning for files with predicate: ${predicate}. Paginated Request: ${!!continuationToken}`);
    const result = await s3Client.send(new ListObjectsV2Command(s3Params));

    if (result.Contents) {
      for (const _file of result.Contents) {
        if (_file?.Key) {
          files.add(_file?.Key);
        }
      }
    }

    //If it's paginated, recursively go and get everything else
    if (result.IsTruncated) {
      console.log('Paginated request detected, getting everything else...');
      const paginatedFiles = await findFilesInS3(predicate, client, result.NextContinuationToken);
      for (const _pf of paginatedFiles) {
        files.add(_pf);
      }
    }

    console.log(`${files.size} files found with predicate ${predicate}`);
    return files;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const removeFromS3 = async (paths: string[] | Set<string>, client?: S3Client) => {
  console.log(`Removing files from S3...`);

  // create an s3 client object
  const s3Client =
    client ??
    new S3Client({
      region: aws.aws_user_files_s3_bucket_region,
    });

  for (const _path of paths) {
    console.log(`Attempting to delete file: ${_path}`);

    try {
      const s3Params: DeleteObjectCommandInput = {
        Bucket: aws.aws_user_files_s3_bucket,
        Key: _path,
      };
      // delete the file
      //WE NEED TO BE CAREFUL HERE THAT WE DONT ACCIDENTALLY DELETE SOMETHING MASSIVE. (predicate check?)
      await s3Client.send(new DeleteObjectCommand(s3Params));
      console.log(`${_path} successfully deleted.`);
    } catch (err) {
      console.error(err);
      continue;
    }
  }
};
