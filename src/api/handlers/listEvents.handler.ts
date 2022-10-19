import { APIGatewayProxyResult, Handler, Context, APIGatewayEvent } from 'aws-lambda'
import { ddbDocClient } from '../../utils'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

export const listEventsHandler: Handler<
  APIGatewayEvent,
  APIGatewayProxyResult
> = async (
  event: APIGatewayEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
    try {
    
      const params: QueryCommandInput = {
        TableName: process.env.DATA_TABLE,
        KeyConditionExpression: "companyId = :companyId",
        ExpressionAttributeValues: { ":companyId": "ABCDEFGHIJKL" },
      }

      const command = new QueryCommand(params);
      const results = await ddbDocClient.send(command);

      return {
        statusCode: 200, body: JSON.stringify({
          data: results.Items
      })}

    } catch (error: any) {
      return {
        statusCode: 500, body: JSON.stringify({
          message: error.message
        })
      }
    }
  }