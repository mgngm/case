/* eslint-disable import/no-unresolved */

// @ts-expect-error we've excluded aws-serverless-express
import awsServerlessExpress from 'aws-serverless-express';
import app from './app';

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = (event: unknown, context: unknown) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};

export default handler;
