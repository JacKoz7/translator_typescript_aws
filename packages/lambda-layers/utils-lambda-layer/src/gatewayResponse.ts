import * as lambda from "aws-lambda";

const createGatewayResponse = ({
  statusCode,
  body,
}: {
  statusCode: number;
  body: string;
}): lambda.APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // required for CORS support to work
      "Access-Control-Allow-Credentials": true, //required for cookies
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
    body, // stringify - JSON convert to String
  };
};

export const createSuccessJsonResponse = (body: object) =>
  createGatewayResponse({
    statusCode: 200,
    body: JSON.stringify(body),
  });

export const createErrorJsonResponse = (body: object) =>
  createGatewayResponse({
    statusCode: 500,
    body: JSON.stringify(body),
  });
