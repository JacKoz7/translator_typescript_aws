import * as clientTranslate from "@aws-sdk/client-translate"; // sdk - list of libraries
import * as lambda from "aws-lambda";
import { timeStamp } from "console";

const TranslateClient = new clientTranslate.TranslateClient({});

export const index: lambda.APIGatewayProxyHandler = async function (
  event: lambda.APIGatewayProxyEvent
) {
  try {
    if (!event.body) {
      throw new Error("Body is empty");
    }

    const body = JSON.parse(event.body); // parse - String convert to JSON
    const { sourceLang, targetLang, text} = body;

    const now = new Date(Date.now()).toString();
    console.log(now);

    const translateCmd = new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: text,
    });

    const result = await TranslateClient.send(translateCmd);
    console.log(result);

    const rtnData = {
      timeStamp: now,
      text: result.TranslatedText
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // required for CORS support to work
        "Access-Control-Allow-Credentials": true, //required for cookies
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(rtnData), // stringify - JSON convert to String
    };
  } catch (e: any) {
    // errors are always any type
    console.error(e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // required for CORS support to work
        "Access-Control-Allow-Credentials": true, //required for cookies
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(e.toString()),
    };
  }
};
