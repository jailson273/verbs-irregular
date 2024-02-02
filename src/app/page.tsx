"use client";

import Button from "@verbs/components/Button";
import InputInfo from "@verbs/components/InputInfo";
import useIrregularVerbs from "@verbs/hooks/useIrregularVerbs";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const {
    filterSelected,
    showPreviewButton,
    control,
    handleNextVerb,
    handlePreviewVerb,
    handleFielterVerbs,
    handleIsValidField,
    handleDebounceTriggerError,
  } = useIrregularVerbs();

  const navClassName =
    "w-[50%] flex flex-col justify-center items-center cursor-pointer text-[14px] border-[2px] border-[#ccc]";
  const classNavSelected = "bg-[#003057] text-[#fff] border-none";

  return (
    <main className="flex min-h-screen flex-col gap-4 p-5 w-full md:w-[500px] lg:w-[500px] items-center justify-center mx-auto">
      <div className={twMerge(`flex w-full h-[40px]`)}>
        <span
          className={twMerge(
            `${navClassName} ${
              filterSelected === "moreUsed" && classNavSelected
            }`
          )}
          onClick={() => handleFielterVerbs("moreUsed")}
        >
          more used
        </span>
        <span
          className={twMerge(
            `${navClassName} ${filterSelected === "all" && classNavSelected}`
          )}
          onClick={() => handleFielterVerbs("all")}
        >
          all
        </span>
      </div>
      <Controller
        control={control}
        name="verb"
        render={({ field }) => (
          <InputInfo placeholder="Verb" subtitle="Verb" readOnly {...field} disabled/>
        )}
      />

      <Controller
        control={control}
        name="infinitive"
        render={({ field: { onChange, ...restField }, fieldState }) => (
          <InputInfo
            {...restField}
            onChange={(e) => {
              onChange(e);
              handleDebounceTriggerError("infinitive");
            }}
            placeholder="Infinitive"
            subtitle="Infinitive"
            error={fieldState?.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="simplePast"
        render={({ field: { onChange, ...restField }, fieldState }) => (
          <InputInfo
            {...restField}
            onChange={(e) => {
              onChange(e);
              handleDebounceTriggerError("simplePast");
            }}
            placeholder="Simple past"
            subtitle="Simple past"
            error={fieldState?.error?.message}
            disabled={!handleIsValidField('infinitive')}
          />
        )}
      />

      <Controller
        control={control}
        name="pastParticiple"
        render={({ field: { onChange, ...restField }, fieldState }) => (
          <InputInfo
            {...restField}
            onChange={(e) => {
              onChange(e);
              handleDebounceTriggerError("pastParticiple");
            }}
            placeholder="Past participle"
            subtitle="Past participle"
            error={fieldState?.error?.message}
            disabled={!handleIsValidField('simplePast')}
          />
        )}
      />
      <div className={twMerge("flex flex-col gap-[8px] w-full")}>
        <Button text="Next" btn="primary" onClick={handleNextVerb} />
        {showPreviewButton && (
          <Button text="Preview" btn="secondary" onClick={handlePreviewVerb} />
        )}
      </div>
    </main>
  );
}
