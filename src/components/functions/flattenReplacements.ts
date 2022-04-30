import { AioExternalReplacements, AioReplacement } from "../aio";
import { appendReplacement } from "./appendReplacement";
import { updateExternals } from "./updateExternals";

/**
 * Consolidate replacements array into a single replacement
 * @param reps Input replacements array
 * @param exts External replacements array
 * @returns single replacement
 */
export const flattenReplacements = (reps?: AioReplacement[], exts?: AioExternalReplacements[]): AioReplacement | undefined => {

  // Do nothing if there is nothing to do 
  if (reps === undefined || reps.length === 0) return undefined;

  // Create holder
  let newReplacement: AioReplacement;

  // Check append is ok
  reps.map((rep, repi) => {

    // First update any external list
    let incoming:AioReplacement = updateExternals({ ...rep}, exts)!;

    // First entry can be used as a base
    if (repi === 0) {
      newReplacement = incoming;
    }
    // Add the incoming list onto the end of the current
    else {
      newReplacement.newTexts = newReplacement.newTexts.map(nt => {
        return {
          ...nt,
          subLists: appendReplacement(incoming, nt.subLists)
        }
      });
    }
    return true;
  });
  return newReplacement!;
}
