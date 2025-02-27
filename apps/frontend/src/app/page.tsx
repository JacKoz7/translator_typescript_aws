"use client";
import { useState } from "react";
import { ITranslateResult, ITranslateResponse } from "@sff/shared-types";
import { getCurrentUser } from "aws-amplify/auth";
import { useTranslate } from "@/hooks";

export default function Home() {
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);
  // const [translations, setTranslations] = useState<Array<ITranslateResult>>([]);
  const { isLoading, translations } = useTranslate();

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <main className="flex flex-col m-8">
      <form
        className="flex flex-col space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          let result = null;
          // try {
          //   const user = await getCurrentUser();
          //   if (user) {
          //     result = await translateUsersText({
          //       inputLang,
          //       outputLang,
          //       inputText,
          //     });
          //   } else {
          //     throw new Error("user not logged in");
          //   }
          // } catch (e) {
          //   console.error(e);
          //   result = await translatePublicText({
          //     inputLang,
          //     outputLang,
          //     inputText,
          //   });
          // }
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
        <div>{JSON.stringify(outputText, null, 2)}</div>
      </div>

      {/* <button
        className="btn bg-blue-500"
        type="button"
        onClick={async () => {
          const rtnValue = await getUsersTranslations();
          console.log("Translations:", rtnValue);
          setTranslations(rtnValue);
        }}
      >
        getTranslations
      </button> */}
      <div className="flex flex-col space-y-1 p-1">
        {translations.map((item) => {
          console.log("Rendering item:", item);
          return (
            <div
              className="flex flex-row p-1 justify-between spacing-x-1 bg-slate-500"
              key={item.requestId}
            >
              <p>
                {item.sourceLang}/{item.sourceText}
              </p>
              <p>
                {item.targetLang}/{item.targetText}
              </p>
              <br></br>
              {/* <button
                className="btn bg-red-500 hover:bg-red-300 rounded-md p-1"
                type="button"
                onClick={async () => {
                  const rtnValue = await deleteUserTranslation({
                    requestId: item.requestId,
                    username: item.username,
                  });
                  console.log("Translations:", rtnValue);
                  setTranslations(rtnValue);
                }}
              >
                X
              </button> */}
            </div>
          );
        })}
      </div>
    </main>
  );
}
