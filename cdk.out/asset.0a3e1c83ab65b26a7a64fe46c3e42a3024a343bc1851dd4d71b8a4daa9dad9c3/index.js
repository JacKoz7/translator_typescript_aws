"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// infrastructure/lambda/timeOfday.ts
var timeOfday_exports = {};
__export(timeOfday_exports, {
  index: () => index
});
module.exports = __toCommonJS(timeOfday_exports);
var clientTranslate = __toESM(require("@aws-sdk/client-translate"));
var TranslateClient2 = new clientTranslate.TranslateClient({});
var index = async function(event) {
  try {
    if (!event.body) {
      throw new Error("Body is empty");
    }
    let body = JSON.parse(event.body);
    const { sourceLang, targetLang, sourceText } = body;
    const now = new Date(Date.now()).toString();
    console.log(now);
    const translateCmd = new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: sourceText
    });
    const result = await TranslateClient2.send(translateCmd);
    console.log(result);
    if (!result.TranslatedText) {
      throw new Error("Translation is  empty");
    }
    const rtnData = {
      timestamp: now,
      targetText: result.TranslatedText
    };
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // required for CORS support to work
        "Access-Control-Allow-Credentials": true,
        //required for cookies
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify(rtnData)
      // stringify - JSON convert to String
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // required for CORS support to work
        "Access-Control-Allow-Credentials": true,
        //required for cookies
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify(e.toString())
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  index
});
