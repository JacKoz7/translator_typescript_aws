"use client";
import { useState } from "react";
import { useTranslate } from "@/hooks";

export default function Home() {
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");

  // located in different file for cleaner coding
  const {
    isLoading,
    translations,
    translate,
    isTranslating,
    deleteTranslation,
    isDeleting,
  } = useTranslate();

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <main className="flex flex-col m-8">
      <form
        className="flex flex-col space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          let result = await translate({
            sourceLang: inputLang,
            targetLang: outputLang,
            sourceText: inputText,
          });

          console.log("Translation result:", result);
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
          {isTranslating ? "translating..." : "translate"}
        </button>
      </form>

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
              <button
                className="btn bg-red-500 hover:bg-red-300 rounded-md p-1"
                type="button"
                onClick={async () => {
                  deleteTranslation(item);
                  console.log("Translations:", rtnValue);
                }}
              >
                {isDeleting ? "..." : "X"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
