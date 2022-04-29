import { AioReplacement } from "../aio";
import { appendReplacement } from "./appendReplacement";
import { updateExternals } from "./updateExternals";

/**
 * Consolidate replacements array into a single replacement
 * @param reps Input replacements array
 * @param exts External replacements array
 * @returns single replacement
 */
export const flattenReplacements = (reps: AioReplacement[], exts?: AioReplacement[]): AioReplacement | undefined => {

  // Do nothing if there is nothing to do 
  if (reps === undefined || reps.length === 0) return undefined;

  // Create holder
  let newReplacement: AioReplacement;

  // Check append is ok
  reps.map((rep, repi) => {

    // First update any external list
    let incoming = { ...rep};
    incoming = updateExternals(incoming, exts);

    // First entry can be used as a base
    if (repi === 0) {
      newReplacement = {...incoming};
      if (newReplacement.externalName !== undefined && exts?.some(e => e.givenName === rep.externalName)) {
        newReplacement.newText = [
          ...(exts.find(e => e.givenName === rep.externalName)!.newText)
        ];
      }
    }
    // Add the incoming list onto the end of the current
    else {
      newReplacement.subLists = appendReplacement(incoming, newReplacement.subLists);
    }

    return true;
  });

  return newReplacement!;
}