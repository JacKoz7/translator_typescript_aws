"use client";
import { eventNames } from "process";
import { useState } from "react";

const URL = "https://xe6yt2kyj9.execute-api.eu-central-1.amazonaws.com/prod/";

function translateText({
  inputLang,
  outputLang,
  inputText,
}: {
  inputLang: string;
  outputLang: string;
  inputText: string;
}) {
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      sourceLang: inputLang,
      targetLang: outputLang,
      text: inputText,
    }),
  })
    .then((result) => result.json())
    .catch((e) => e.toString());
}

export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [outputText, setOutputText] = useState<any>(null);

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          // console.log({ inputText, inputLang, outputLang });
          const result = await translateText({
            inputText,
            inputLang,
            outputLang,
          });
          setOutputText(result);
        }}
      >
        <div>
          <label htmlFor="inputText">Input text:</label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="inputLang">Input Language:</label>
          <input
            id="inputLang"
            value={inputLang}
            onChange={(event) => setInputLang(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="outputLang">Output Language:</label>
          <input
            id="outputLang"
            value={outputLang}
            onChange={(event) => setOutputLang(event.target.value)}
          />
        </div>

        <button className="btn bg-blue-500 p-2 mt-2 rounded-xl" type="submit">
          Translate
        </button>
      </form>
      <pre style={{ whiteSpace: "pre-wrap" }} className="w-full">
        {JSON.stringify(outputText, null, 2)}
      </pre>
    </main>
  );
}
