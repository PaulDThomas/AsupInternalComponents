import structuredClone from "@ungap/structured-clone";
import { AioReplacementValue } from "../aio/aioInterface";

/**
 * Append a replacementValues list to a replacementValue, after recursion
 * @param baseV Start replacement value
 * @param addV Values to add as the last sublist
 * @returns clone of initial replacementValue with sublist appended on the end
 */
export const appendReplacementValue = (baseV: AioReplacementValue, addV: AioReplacementValue[]): AioReplacementValue => {
  let newV: AioReplacementValue = { newText: baseV.newText };
  // Add if there is no subList
  if (!baseV.subList) {
    newV.subList = structuredClone(addV);
  }

  // Or dive deeper
  else {
    newV.subList = baseV.subList.map(s => appendReplacementValue(s, addV));
  }
  return newV;
};
