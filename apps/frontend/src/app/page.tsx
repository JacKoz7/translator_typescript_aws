"use client";
import { useState } from "react";
import {
  ITranslateDbObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";

// const URL = "https://gvjdn7k7s0.execute-api.us-east-1.amazonaws.com/prod/";
const URL = "https://api.jacekkozlowski.com/";

const translateText = async ({
  inputLang,
  inputText,
  outputLang,
}: {
  inputLang: string;
  inputText: string;
  outputLang: string;
}) => {
  try {
    const request: ITranslateRequest = {
      sourceLang: inputLang,
      targetLang: outputLang,
      sourceText: inputText,
    };

    const result = await fetch(`${URL}`, {
      method: "POST",
      body: JSON.stringify(request),
    });

    const rtnValue = (await result.json()) as ITranslateResponse;
    return rtnValue;
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
};

const getTranslations = async () => {
  try {
    const result = await fetch(URL, {
      method: "GET",
    });

    const rtnValue = (await result.json()) as Array<ITranslateDbObject>;
    return rtnValue;
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
};

export default function Home() {
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);
  const [translations, setTranslations] = useState<Array<ITranslateDbObject>>(
    []
  );

  return (
    <main className="flex flex-col m-8">
      <form
        className="flex flex-col space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await translateText({
            inputLang,
            outputLang,
            inputText,
          });
          console.log("Translation result:", result);
          setOutputText(result);
        }}
      >
        <div>
          <label htmlFor="inputText">Input text:</label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="inputLang">Input Language:</label>
          <input
            id="inputLang"
            type="text"
            value={inputLang}
            onChange={(e) => setInputLang(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="outputLang">Output Language:</label>
          <input
            id="outputLang"
            type="text"
            value={outputLang}
            onChange={(e) => setOutputLang(e.target.value)}
          />
        </div>

        <button className="btn bg-blue-500" type="submit">
          translate
        </button>
      </form>

      <div>
        <p>Result:</p>
        <div>
          {JSON.stringify(outputText, null, 2)}
        </div>
      </div>

      <button
        className="btn bg-blue-500"
        type="button"
        onClick={async () => {
          const rtnValue = await getTranslations();
          console.log("Translations:", rtnValue);
          setTranslations(rtnValue);
        }}
      >
        getTranslations
      </button>
      <div>
        <p>Result:</p>
        <div>
          {translations.map((item) => {
            console.log("Rendering item:", item);
            return (
              <div key={item.requestId}>
                <p>
                  {item.sourceLang}/{item.sourceText}
                </p>
                <p>
                  {item.targetLang}/{item.targetText}
                </p>
                <br></br>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
