import { v4 as uuidv4 } from "uuid";
import { AioReplacement } from "../aio";
import { newReplacementValues } from "./newReplacementValues";

export const newReplacement = (): AioReplacement => {
  return {
    airid: uuidv4(),
    oldText: "",
    newTexts: [newReplacementValues()],
    includeTrailing: false,
    externalName: "",
  };
}