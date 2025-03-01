"use client";
import { useState } from "react";
import { useTranslate } from "@/hooks";
import { TranslateRequestForm } from "@/components";

export default function Home() {


  // located in different file for cleaner coding
  const {
    isLoading,
    translations,
    deleteTranslation,
    isDeleting,
  } = useTranslate();

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <main className="flex flex-col m-8">

    <TranslateRequestForm/>
    
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
