import type { AWS } from '@serverless/typescript';

export const eventBridge: AWS['resources'] = {
  Resources: {
    EventBridge: {
      Type: 'AWS::Events::EventBus',
      Properties: {
        Name: '${self:service}-${sls:stage}',
      },
    },
  },
  Outputs: {
    EventBridgeArn: {
      Value: {
        'Fn::GetAtt': ['EventBridge', 'Arn'],
      },
      Export: {
        Name: '${self:service}-event-bridge-${sls:stage}',
      },
    },
  },
};
