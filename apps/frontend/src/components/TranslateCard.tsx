"use client";
import React from "react";
import { ITranslateResult } from "@sff/shared-types";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Trash2 } from "lucide-react";
import { getDate, getTime } from "@/lib";
import { Button } from "./ui/button";
import { useTranslate } from "@/hooks";

export const TranslateCard = ({
  selected,
  onSelected,
  translateItem,
}: {
  selected: boolean;
  onSelected: (item: ITranslateResult) => void;
  translateItem: ITranslateResult;
}) => {
  const { deleteTranslation, isDeleting } = useTranslate();

  return (
    <Card
      onClick={() => {
        onSelected(translateItem);
      }}
      className={cn(
        "flex flex-row items-center justify-between px-4 py-2 space-x-1 border-0",
        "bg-custom-cream hover:bg-custom-teal cursor-pointer",
        selected && "bg-blue-400 hover:bg-blue-500"
      )}
    >
      <div className={cn("flex flex-col text-midnight")}>
        <div className="flex flex-row text-base font-semibold">
          <p>{translateItem.sourceLang}</p>
          <ArrowRight />
          <p>{translateItem.targetLang}</p>
        </div>

        <p>{translateItem.sourceText}</p>
        <div className="text-midnight text-sm font-medium shadow-sm tracking-wide flex flex-col items-start gap-0.5">
          <p className="opacity-80">
            {getDate(parseInt(translateItem.requestId))}
          </p>
          <p className="opacity-60 italic">
            {getTime(parseInt(translateItem.requestId))}
          </p>
        </div>
      </div>

      <Button
        className="bg-transparent hover:bg-transparent text-gray-700 hover:text-red-700"
        onClick={async () => {
          deleteTranslation(translateItem);
        }}
      >
        {isDeleting ? "deleting..." : <Trash2 />}
      </Button>
    </Card>
  );
};
