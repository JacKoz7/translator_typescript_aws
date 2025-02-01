export type ITranslateRequest = {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
};

export type ITranslateResponse = {
  timestamp: string;
  targetText: string;
};

//combination of these both above and some new fields
export type ITranslateDbObject = ITranslateRequest &
  ITranslateResponse & {
    requestId: string;
  };
