import { GetQueueUrlCommand, SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import type { SendMessageCommandInput } from '@aws-sdk/client-sqs';
import aws from 'src/aws-exports';
import { DYNAMO_DELETE_QUEUE } from 'src/constants/api';
import { methodHandlers } from 'src/logic/server';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.post<ResponseData<never>>(async (req, res, { tokens, failWithCode, succeedWithCode }) => {
    const { id, type } = req.body;

    if (!id) {
      throw failWithCode('No report id provided', 500);
    }

    try {
      //Make queue client
      const sqsClient = new SQSClient({ region: aws.aws_project_region, credentials: tokens });
      const queueInput = { QueueName: DYNAMO_DELETE_QUEUE };
      const { QueueUrl: queueUrl } = await sqsClient.send(new GetQueueUrlCommand(queueInput));

      if (queueUrl) {
        //Send message to the lambda, which will go and figure out exactly which resources we need to delete and just do it for us.
        const deleteItem = {
          id,
          type,
        };

        try {
          const message: SendMessageCommandInput = {
            MessageBody: JSON.stringify(deleteItem),
            QueueUrl: queueUrl,
          };
          console.log('DEBUG: Sent Delete Queue Message', deleteItem.id, deleteItem.type);
          await sqsClient.send(new SendMessageCommand(message));
        } catch (e) {
          console.error(`DEBUG: Sending delete message for ${deleteItem.id} and ${deleteItem.type} failed`, e);
        }

        return succeedWithCode({ ok: true }, 200);
      } else {
        throw failWithCode('No queue url found', 500);
      }
    } catch (e) {
      console.error(e);
      throw failWithCode(`DEBUG: Sending delete message for ${id} and ${type} failed`, 500);
    }
  });
});
