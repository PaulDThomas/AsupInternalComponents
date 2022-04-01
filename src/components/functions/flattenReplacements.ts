import structuredClone from "@ungap/structured-clone";
import { AioReplacement } from "../aio/aioInterface";
import { appendReplacementValue } from "./appendReplacementValue";

/**
 * Consolidate replacements array into a single replacement
 * @param replacements Input replacements array
 * @returns single replacement
 */
export const flattenReplacements = (replacements: AioReplacement[]): AioReplacement => {
  let newReplacement: AioReplacement = { replacementTexts: [], replacementValues: [] };

  // Check append is ok
  replacements.map((rep, repi) => {
    // Just apppend the texts
    newReplacement.replacementTexts.push(...rep.replacementTexts);

    if (repi === 0) {
      newReplacement.replacementValues = structuredClone(rep.replacementValues);
    }
    else {
      newReplacement.replacementValues = newReplacement.replacementValues.map(
        rv => appendReplacementValue(rv, rep.replacementValues)
      );
    }

    return true;
  });

  return newReplacement;
}