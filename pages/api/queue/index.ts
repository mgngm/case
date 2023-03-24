import type { SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { GetQueueUrlCommand, SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import aws from 'src/aws-exports';
import { methodHandlers } from 'src/logic/server';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.post<ResponseData>(async (req, res, { tokens, failWithCode, succeedWithCode }) => {
    const { queue, messageBody } = req.body;

    if (!queue || !messageBody) {
      throw failWithCode('No queue and/or message provided', 400);
    }

    try {
      //Make queue client
      const sqsClient = new SQSClient({ region: aws.aws_project_region, credentials: tokens });
      const queueInput = { QueueName: queue };
      const { QueueUrl: queueUrl } = await sqsClient.send(new GetQueueUrlCommand(queueInput));

      if (queueUrl) {
        try {
          const message: SendMessageCommandInput = {
            MessageBody: JSON.stringify(messageBody),
            QueueUrl: queueUrl,
          };
          console.log('Sending queue message', queue, JSON.stringify(messageBody));
          await sqsClient.send(new SendMessageCommand(message));
        } catch (e) {
          console.error(`Sending message failed`, e);
        }

        return succeedWithCode({ ok: true }, 200);
      } else {
        throw failWithCode('No queue url found', 500);
      }
    } catch (e) {
      console.error(e);
      throw failWithCode('Delete report message failed', 500);
    }
  });
});
