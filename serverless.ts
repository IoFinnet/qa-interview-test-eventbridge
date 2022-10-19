
import type { AWS } from '@serverless/typescript';

import { functions, dynamoDb, eventBridge, } from './resources';

const serverlessConfiguration: AWS = {
  service: 'iofinnet-qa-interview-test-eventbridge',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-offline-aws-eventbridge',
    'serverless-dynamodb-local',
  ],
  package: {
    individually: true,
  },
  params: {
    default: {
      DATA_TABLE: 'iofinnet-qa-interview-test-dynamodb-${sls:stage}',
      EVENT_BRIDGE_NAME: 'iofinnet-qa-interview-eventbridge-${sls:stage}'
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: 'test',
    region: 'eu-west-1',
    environment: {
      DATA_TABLE: '${param:DATA_TABLE}',
      EVENT_BRIDGE_NAME: '${param:EVENT_BRIDGE_NAME}',
      EVENT_BRIDGE_OFFLINE_PORT: '${self:custom.serverless-offline-aws-eventbridge.port}',
      EVENT_BRIDGE_OFFLINE_HOST: '${self:custom.serverless-offline-aws-eventbridge.hostname}',
    },
    httpApi: {
      shouldStartNameWithService: true,
      disableDefaultEndpoint: false,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['events:PutEvents'],
        Resource: [
          'arn:aws:events:${aws:region}:${aws:accountId}:event-bus/${param:EVENT_BRIDGE_NAME}',
        ],
      },
      {
      Effect: 'Allow',
      Action: ['dynamodb:Query', 'dynamodb:BatchWriteItem', 'dynamodb:PutItem'],
      Resource: [
        'arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${param:DATA_TABLE}',
      ],
    },
    ],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      packager: 'npm',
      exclude: ['aws-sdk'],
      target: 'node16',
      platform: 'node',
      watch: {
        pattern: ['src/**/*.ts'],
      },
    },
    'serverless-offline-aws-eventbridge': {
      port: 4010, // port to run the eventBridge mock server on
      mockEventBridgeServer: true, // Set to false if EventBridge is already mocked by another stack
      hostname: "127.0.0.1", // IP or hostname of existing EventBridge if mocked by another stack
      pubSubPort: 4011, // Port to run the MQ server (or just listen if using an EventBridge mock server from another stack)
      debug: true, // flag to show debug messages
      account: '123456789' // account id that gets passed to the event
    },
    dynamodb: {
      stages: ['test'],
      start: {
        port: 8000,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: 'true',
        convertEmptyValues: 'true'
      }
    }
  },
  functions: { ...functions },
  resources: {
    Resources: {
      ...eventBridge?.Resources,
      ...dynamoDb?.Resources
    },
  },
};

module.exports = serverlessConfiguration;
