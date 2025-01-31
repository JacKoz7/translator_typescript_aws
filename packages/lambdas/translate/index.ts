import * as clientTranslate from "@aws-sdk/client-translate"; // sdk - list of libraries
import * as lambda from "aws-lambda";
import {ITranslateRequest, ITranslateResponse} from "@sff/shared-types"

const TranslateClient = new clientTranslate.TranslateClient({});

export const index: lambda.APIGatewayProxyHandler = async function (
  event: lambda.APIGatewayProxyEvent
) {
  try {
    if (!event.body) {
      throw new Error("Body is empty");
    }

    console.log(event.body);

    let body = JSON.parse(event.body) as ITranslateRequest; // parse - String convert to JSON

    if(!body.sourceLang){
      throw new Error("sourceLang is empty");
    }
    if(!body.targetLang){
      throw new Error("targetLang is empty");
    }
    if(!body.sourceText){
      throw new Error("sourceText is empty");
    }

    const { sourceLang, targetLang, sourceText} = body;

    const now = new Date(Date.now()).toString();
    console.log(now);

    const translateCmd = new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: sourceText,
    });

    const result = await TranslateClient.send(translateCmd);
    console.log(result);

    if(!result.TranslatedText){
      throw new Error("Translation is  empty");
    }

    const rtnData: ITranslateResponse = {
      timestamp: now,
      targetText: result.TranslatedText
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
