"use client";
import { useTranslate } from "@/hooks";
import { ITranslateRequest } from "@sff/shared-types";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useApp } from "./AppProvider";
import { Combobox, IComboBoxOption } from "./ui/combobox";
import { ILanguage, LANGUAGE_LIST } from "@/lib";

const languageOptions: Array<IComboBoxOption<ILanguage>> = LANGUAGE_LIST.map(
  (item) => ({
    value: item.name,
    label: item.name,
    data: item,
  })
);

export const TranslateRequestForm = () => {
  const { translate, isTranslating } = useTranslate();
  const { selectedTranslation } = useApp();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ITranslateRequest>();

  // whenever the value changes of the selected translation we are going to update our form
  useEffect(() => {
    if (selectedTranslation) {
      setValue("sourceLang", selectedTranslation.sourceLang);
      setValue("sourceText", selectedTranslation.sourceText);
      setValue("targetLang", selectedTranslation.targetLang);
    }
    // zastanowic sie czy dobrze:
  }, [selectedTranslation, setValue]);

  const onSubmit: SubmitHandler<ITranslateRequest> = (data, event) => {
    event?.preventDefault();
    console.log("Calling translate function with data:", data);
    translate(data);
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label className="text-custom-cream font-bold" htmlFor="sourceText">Input text:</Label>
        <Textarea
          id="sourceText"
          {...register("sourceText", { required: true })}
          rows={3}
        />
        {errors.sourceText && <span>field is required</span>}
      </div>

      <div>
        <Label htmlFor="sourceLang">Input Language:</Label>
        <Combobox
          placeholder="Language"
          options={languageOptions}
          selected={languageOptions.find(
            (i) => i.data.code === selectedTranslation?.sourceLang
          )}
          onSelect={(a) => {
            console.log(a);
            setValue("sourceLang", a.data.code);
          }}
        />
        {errors.sourceLang && <span>field is required</span>}
      </div>

      <div>
        <Label htmlFor="targetLang">Output Language:</Label>
        <Combobox
          placeholder="Language"
          options={languageOptions}
          selected={languageOptions.find(
            (i) => i.data.code === selectedTranslation?.targetLang
          )}
          onSelect={(a) => {
            setValue("targetLang", a.data.code);
          }}
        />
        {errors.targetLang && <span>field is required</span>}
      </div>

      <Button type="submit">
        {isTranslating ? "translating..." : "translate"}
      </Button>

      <div>
        <Label htmlFor="targetText">Translated text:</Label>
        <Textarea
          readOnly
          id="targetText"
          value={selectedTranslation?.targetText}
          rows={3}
        />
      </div>
    </form>
  );
};
