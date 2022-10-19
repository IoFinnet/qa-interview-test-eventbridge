import { EventBridgeHandler, Context, EventBridgeEvent } from 'aws-lambda'
import { PutCommand, PutCommandInput, PutCommandOutput } from '@aws-sdk/lib-dynamodb';

import { ddbDocClient } from '../../utils'

enum Size {
  small,
  medium,
  large
}

type ExampleEvent = {
  name: string;
  amount: number;
  size: Size;
}

export const subscribeEventHandler: EventBridgeHandler<'EXAMPLE_EVENT', ExampleEvent, void> = async (
  event: EventBridgeEvent<'EXAMPLE_EVENT', ExampleEvent>,
  _context: Context,
): Promise<void> => {
  try {
    console.log(event);
    const params: PutCommandInput = {
      TableName: process.env.DATA_TABLE!,
      Item: {
        companyId: 'ABCDEFGHIJKL',
        createdAt: `${Date.now().toString()}:${event.id}`,
        name: event.detail.name,
        amount: event.detail.amount,
        size: event.detail.size,
      }
    };

    const command = new PutCommand(params);
    await ddbDocClient.send(command);

    return Promise.resolve()

  } catch (error) {
    console.log(error);
    return Promise.reject()
  }
}