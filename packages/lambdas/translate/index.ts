import * as clientTranslate from "@aws-sdk/client-translate"; // sdk - list of libraries
import * as dynamodb from "@aws-sdk/client-dynamodb";
import * as lambda from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { gateway } from "/opt/nodejs/utils-lambda-layer";
import {
  ITranslateDbObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";

const { TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY } = process.env;
console.log("{ TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY }", {
  TRANSLATION_TABLE_NAME,
  TRANSLATION_PARTITION_KEY,
});

if (!TRANSLATION_TABLE_NAME) {
  throw new Error("TRANSLATION_TABLE_NAME is empty");
}

if (!TRANSLATION_PARTITION_KEY) {
  throw new Error("TRANSLATION_PARTITION_KEY is empty");
}

const TranslateClient = new clientTranslate.TranslateClient({});
const dynamodbClient = new dynamodb.DynamoDBClient({});

export const translate: lambda.APIGatewayProxyHandler = async function (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) {
  try {
    if (!event.body) {
      throw new Error("Body is empty");
    }

    console.log(event.body);

    let body = JSON.parse(event.body) as ITranslateRequest; // parse - String convert to JSON

    if (!body.sourceLang) {
      throw new Error("sourceLang is empty");
    }
    if (!body.targetLang) {
      throw new Error("targetLang is empty");
    }
    if (!body.sourceText) {
      throw new Error("sourceText is empty");
    }

    const { sourceLang, targetLang, sourceText } = body;

    const now = new Date(Date.now()).toString();
    console.log(now);

    const translateCmd = new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: sourceText,
    });

    const result = await TranslateClient.send(translateCmd);
    console.log(result);

    if (!result.TranslatedText) {
      throw new Error("Translation is  empty");
    }

    const rtnData: ITranslateResponse = {
      timestamp: now,
      targetText: result.TranslatedText,
    };

    // save the translation into our translation table in database
    // the table object that is saved to database
    const tableObj: ITranslateDbObject = {
      requestId: context.awsRequestId,
      ...body,
      ...rtnData,
    };

    const tableInsertCmd: dynamodb.PutItemCommandInput = {
      TableName: TRANSLATION_TABLE_NAME,
      Item: marshall(tableObj), // marshal converts tableObj to format suitable for our db
    };

    await dynamodbClient.send(new dynamodb.PutItemCommand(tableInsertCmd));
    return gateway.createSuccessJsonResponse(rtnData);
  } catch (e: any) {
    // errors are always any type
    console.error(e);
    return gateway.createErrorJsonResponse(e);
  }
};

export const getTranslations: lambda.APIGatewayProxyHandler = async function (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) {
  try {
    const ScanCmd: dynamodb.ScanCommandInput = {
      TableName: TRANSLATION_TABLE_NAME,
    };
    console.log("ScanCmd", ScanCmd);

    const { Items } = await dynamodbClient.send(
      new dynamodb.ScanCommand(ScanCmd)
    );

    if (!Items) {
      throw new Error("No items found");
    }

    console.log("Items", Items);

    const rtnData = Items.map((item) => unmarshall(item) as ITranslateDbObject);
    console.log(rtnData);
    return gateway.createSuccessJsonResponse(rtnData);
  } catch (e: any) {
    // errors are always any type
    console.error(e);
    return gateway.createErrorJsonResponse(e);
  }
};
