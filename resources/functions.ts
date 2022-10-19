import type { AWS } from '@serverless/typescript';

export const functions: AWS['functions'] = {
  createEvent: {
    handler: 'handlers.createEventHandler',
    events: [
      {
        httpApi: {
          method: 'POST',
          path: '/events',
        },
      },
    ],
  },
  listEvents: {
    handler: 'handlers.listEventsHandler',
    events: [
      {
        httpApi: {
          method: 'GET',
          path: '/events',
        },
      },
    ],
  },
  subscribeToEvents: {
    handler: 'handlers.subscribeEventHandler',
    events: [{
      eventBridge: {
        eventBus: '${param:EVENT_BRIDGE_NAME}',
        pattern: {
          'detail-type': ['EXAMPLE_EVENT'],
        },
      },
    }
    ],
  },
};
