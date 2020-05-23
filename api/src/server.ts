import serverless from "serverless-http";
import { APIGatewayProxyEvent } from "aws-lambda";
import app from "./app";

export const handler = serverless(app, {
  request(request: any, event: APIGatewayProxyEvent) {
    // add aws lambda stage to request
    request.stage = event.requestContext.stage;
  }
});
