import type { AWS } from '@serverless/typescript';

export const dynamoDb: AWS['resources'] = {
  Resources: {
    DynamoDbTable: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        TableName: '${param:DATA_TABLE}',
        AttributeDefinitions: [
          {
            AttributeName: 'companyId',
            AttributeType: 'S',
          },
          {
            AttributeName: 'createdAt',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'companyId',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'createdAt',
            KeyType: 'RANGE',
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      },
    },
  },
  Outputs: {},
};
