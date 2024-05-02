import { AioReplacement } from "../aio";
import { newReplacementValues } from "./newReplacementValues";

export const newReplacement = (): AioReplacement => {
  return {
    airid: crypto.randomUUID(),
    oldText: "",
    newTexts: [newReplacementValues()],
    includeTrailing: false,
  };
};
