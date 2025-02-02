import * as clientTranslate from "@aws-sdk/client-translate"; // sdk - list of libraries
import { ITranslateRequest } from "@sff/shared-types"; // shared-types - list of libraries

export async function getTranslation({
  sourceLang,
  targetLang,
  sourceText,
}: ITranslateRequest) {
  const TranslateClient = new clientTranslate.TranslateClient();

  const translateCmd = new clientTranslate.TranslateTextCommand({
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang,
    Text: sourceText,
  });
  const result = await TranslateClient.send(translateCmd);
  return result;
}
