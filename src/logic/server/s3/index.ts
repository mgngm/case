import type internal from 'stream';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import aws from 'src/aws-exports';
import type { Tokens } from 'src/types/auth';

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
export const getFromS3 = async (path: string, tokens: Tokens) => {
  // define s3 parameters for the upload
  const s3Params = {
    Bucket: aws.aws_user_files_s3_bucket,
    Key: `public/${path}`,
  };

  // create an s3 client object
  const s3Client = new S3Client({
    region: aws.aws_user_files_s3_bucket_region,
    credentials: tokens,
  });

  try {
    // get the file
    const result = await s3Client.send(new GetObjectCommand(s3Params));
    console.log(`successfully fetched ${s3Params.Bucket}/${s3Params.Key}`);
    return result;
  } catch (err) {
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
export const uploadToS3 = async (path: string, body: Buffer, tokens: Tokens, disableCache = true) => {
  // define s3 parameters for the upload
  const s3Params = {
    Bucket: aws.aws_user_files_s3_bucket,
    Key: path,
    Body: body,
    // prevent caching of uploaded object
    ...(disableCache && { CacheControl: 'no-cache', Expires: new Date() }),
  };

  // create an s3 client object
  const s3Client = new S3Client({
    region: aws.aws_user_files_s3_bucket_region,
    credentials: tokens,
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

/**
 * Get an object from s3 and extract its body as a string
 *
 * @param path string
 * @param tokens Tokens
 * @returns Promise<string>
 */
export const getFromS3AsString = async (path: string, tokens: Tokens) => {
  try {
    // get the file
    const result = await getFromS3(path, tokens);
    // parse the body as string
    const bodyString = await streamToString(result.Body as internal.Readable);
    console.log('s3 object body parsed successfully');
    return bodyString;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
