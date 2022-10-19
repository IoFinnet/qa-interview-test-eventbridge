
import { ZodSchema } from 'zod';
import { APIGatewayProxyEventV2WithLambdaAuthorizer, APIGatewayAuthorizerResultContext } from 'aws-lambda'

type AWSApiEvent = APIGatewayProxyEventV2WithLambdaAuthorizer<APIGatewayAuthorizerResultContext>

export type APIGatewayEvent<ZodSchema extends Partial<AWSApiEvent> = AWSApiEvent> = Omit<
  AWSApiEvent,
  keyof ZodSchema
> &
  ZodSchema;