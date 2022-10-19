import { EventBridgeClient, EventBridgeClientConfig } from '@aws-sdk/client-eventbridge';

function getEventBridgeEndpoint() {
  if (process.env.IS_OFFLINE) {
    return `http://${process.env.EVENT_BRIDGE_OFFLINE_HOST}:${process.env.EVENT_BRIDGE_OFFLINE_PORT}`
  }
  return
}

const eventBridgeClientConfig: EventBridgeClientConfig = {
  endpoint: getEventBridgeEndpoint(),
}

const eventBridgeClient = new EventBridgeClient(eventBridgeClientConfig)

export { eventBridgeClient }