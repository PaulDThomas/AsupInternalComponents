import { AioExternalReplacements } from "../aio";
import { newReplacementValues } from "./newReplacementValues";

export const newExternalReplacements = <T extends string | object>(
  blankT: T,
): AioExternalReplacements<T> => {
  return {
    givenName: "",
    newTexts: [newReplacementValues(blankT)],
  };
};
