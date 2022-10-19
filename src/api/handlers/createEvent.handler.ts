import { APIGatewayProxyResult, Handler, Context } from 'aws-lambda'
import { ZodError } from 'zod';
import {
  PutEventsCommand,
  PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';
import { BatchWriteCommand, BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { APIGatewayEvent } from '../../interfaces'

import { createEventValidation } from '../validation';

import { eventBridgeClient, ddbDocClient } from '../../utils';

export const createEventHandler: Handler<
  APIGatewayEvent,
  APIGatewayProxyResult
> = async (
  event: APIGatewayEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
    try {
      const parsedPayloadEvents = createEventValidation.parse(JSON.parse(event.body!))

      const eventsToPublish = parsedPayloadEvents.map<PutEventsRequestEntry>(event => {
        return {
          EventBusName: process.env.EVENT_BRIDGE_NAME,
          Source: 'IOFINNET-QA-TEST-CREATE-EVENT-API',
          DetailType: 'EXAMPLE_EVENT',
          Detail: JSON.stringify(event)
        }
      })

      const eventsToSave = parsedPayloadEvents.map(event => {
        return {
          PutRequest: {
            Item: {
              companyId: 'ABCDEFGHIJKL',
              createdAt: `${Date.now().toString()}:${uuid()}`,
              name: event.name,
              amount: event.amount,
              size: event.size,
            }
          }
        }
      })

      const params: BatchWriteCommandInput = {
        RequestItems: {
          [process.env.DATA_TABLE!]: eventsToSave
        }
      };

      const command = new BatchWriteCommand(params);
      const writeDbPromise = ddbDocClient.send(command);
      
      const putEventsCommand = new PutEventsCommand({ Entries: eventsToPublish });
      const emitEventsPromise = eventBridgeClient.send(putEventsCommand)
      
      const [, emitEventsResults ] = await Promise.all([writeDbPromise, emitEventsPromise])

      return {
        statusCode: 200, body: JSON.stringify({
          successful: emitEventsResults.Entries,
          failedCount: emitEventsResults.FailedEntryCount
        })
      }

    } catch (error: any) {
      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: error.issues
          })
        }
      }
      return {
        statusCode: 500, body: JSON.stringify({
          message: error.message
        })
      }
    }
  }