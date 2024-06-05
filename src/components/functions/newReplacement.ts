import { AioReplacement } from "../aio";
import { newReplacementValues } from "./newReplacementValues";

export const newReplacement = <T extends string | object>(blankT: T): AioReplacement<T> => {
  return {
    airid: crypto.randomUUID(),
    oldText: "",
    newTexts: [newReplacementValues(blankT)],
    includeTrailing: false,
  };
};
