"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import irregular_verbs from "@verbs/data/irregular_verbs.json";

type ToZodObjectSchema<Type> = {
  [Property in keyof Type]?: z.ZodTypeAny;
};

type TIrregularVerb = {
  id?: string;
  verb: string;
  infinitive: string;
  simplePast: string;
  pastParticiple: string;
  moreUsed: boolean;
};

type IrregularVerbForm = TIrregularVerb & {
  INFINITIVE: string;
  SIMPLE_PAST: string;
  PAST_PARTICIPLE: string;
};

const compareProps = (inputed: string | unknown, reference: string | unknown) =>
  String(inputed).trim().toLowerCase() ===
  String(reference).trim().toLowerCase();

const irregularVerbSchema = z
  .object<ToZodObjectSchema<IrregularVerbForm>>({
    id: z.string(),
    verb: z.string(),
    moreUsed: z.boolean(),
    infinitive: z.string(),
    simplePast: z.string(),
    pastParticiple: z.string(),
    INFINITIVE: z.string(),
    SIMPLE_PAST: z.string(),
    PAST_PARTICIPLE: z.string(),
  })
  .refine(
    ({ infinitive, INFINITIVE }) => {
      return compareProps(infinitive, INFINITIVE);
    },
    (arg) => ({ path: ["infinitive"], message: String(arg.INFINITIVE) })
  )
  .refine(
    ({ simplePast, SIMPLE_PAST }) => compareProps(simplePast, SIMPLE_PAST),
    (arg) => ({ path: ["simplePast"], message: String(arg.SIMPLE_PAST) })
  )
  .refine(
    ({ pastParticiple, PAST_PARTICIPLE }) =>
      compareProps(pastParticiple, PAST_PARTICIPLE),
    (arg) => ({
      path: ["pastParticiple"],
      message: String(arg.PAST_PARTICIPLE),
    })
  );

export default function useIrregularVerbs() {
  const {
    control,
    formState,
    reset,
    getValues,
    trigger,
    getFieldState,
  } = useForm<IrregularVerbForm>({
    mode: "onSubmit",
    resolver: zodResolver(irregularVerbSchema),
    defaultValues: {
      id: "",
      verb: "",
      infinitive: "",
      simplePast: "",
      moreUsed: false,
      pastParticiple: "",
      INFINITIVE: "",
      SIMPLE_PAST: "",
      PAST_PARTICIPLE: "",
    },
  });

  const [filterSelected, setFilterSelected] = useState<"moreUsed" | "all">(
    "moreUsed"
  );
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [filledVerbs, setFilledVerbs] = useState<IrregularVerbForm[]>([]);

  const showPreviewButton = useMemo(
    () => currentVerbIndex > 0,
    [currentVerbIndex]
  );
  const irregularVerbsFilterd = useMemo(
    () =>
      irregular_verbs?.filter((verb) =>
        filterSelected === "all" ? true : verb?.moreUsed
      ),
    [filterSelected]
  );

  const handleDebounceTriggerError = useDebouncedCallback(
    useCallback(
      (field: keyof IrregularVerbForm) => {
        trigger(field);
      },
      [trigger]
    ),
    1000
  );

  const handlePreviewVerb = useCallback(() => {
    setCurrentVerbIndex((index) => (index > 0 ? index - 1 : index));
  }, []);

  const handleNextVerb = useCallback(async () => {
    await trigger();
    if (!formState.isValid) {
      return;
    }
    const currentVerb = getValues();
    if (!filledVerbs?.some((verb) => verb.id === currentVerb.id)) {
      setFilledVerbs([...filledVerbs, getValues()]);
    }
    setCurrentVerbIndex((index) =>
      index < irregularVerbsFilterd.length ? index + 1 : index
    );
  }, [
    trigger,
    filledVerbs,
    irregularVerbsFilterd,
    formState.isValid,
    getValues,
  ]);

  const handleFielterVerbs = useCallback(
    (filter: "moreUsed" | "all") => setFilterSelected(filter),
    []
  );

  const handleIsValidField = useCallback(
    (field: keyof IrregularVerbForm) => {
      return Boolean(
        getFieldState(field).isDirty && !getFieldState(field).invalid
      );
    },
    [getFieldState]
  );

  useEffect(() => {
    const verb = irregularVerbsFilterd[currentVerbIndex];
    const filledVerb = filledVerbs?.find(({ id }) => id === verb?.id);

    if (filledVerb) {
      reset({ ...filledVerb });
    } else if (verb) {
      reset({
        id: verb.id,
        verb: verb.verb,
        moreUsed: verb.moreUsed,
        infinitive: "",
        simplePast: "",
        pastParticiple: "",
        INFINITIVE: verb.infinitive,
        SIMPLE_PAST: verb.simplePast,
        PAST_PARTICIPLE: verb.pastParticiple,
      });
    }
  }, [irregularVerbsFilterd, currentVerbIndex, filledVerbs, reset]);

  useEffect(() => {
    const indexHasNotbeenYetFilled = irregularVerbsFilterd.findIndex(
      (verb) => !filledVerbs.some((filled) => filled?.id === verb?.id)
    );

    setCurrentVerbIndex(indexHasNotbeenYetFilled);
  }, [filledVerbs, irregularVerbsFilterd]);

  return {
    filterSelected,
    showPreviewButton,
    control,
    handleNextVerb,
    handlePreviewVerb,
    handleFielterVerbs,
    handleIsValidField,
    handleDebounceTriggerError,
  };
}
