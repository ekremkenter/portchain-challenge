import app from "./app";
import serverless from "serverless-http";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = serverless(app, {
  request(request: any, event: APIGatewayProxyEvent) {
    //add aws lambda stage to request
    request.stage = event.requestContext.stage;
  }
});
