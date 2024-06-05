import { AioExternalReplacements, AioReplacement } from "../aio";
import { appendReplacement } from "./appendReplacement";
import { newReplacement } from "./newReplacement";
import { updateExternals } from "./updateExternals";

/**
 * Consolidate replacements array into a single replacement
 * @param reps Input replacements array
 * @param exts External replacements array
 * @returns single replacement
 */
export const flattenReplacements = <T extends string | object>(
  reps?: AioReplacement<T>[],
  exts?: AioExternalReplacements<T>[],
  blankT: T = "" as T,
): AioReplacement<T> | undefined => {
  // Do nothing if there is nothing to do
  if (reps === undefined || reps.length === 0) return undefined;

  // Create holder
  let newRep: AioReplacement<T> = newReplacement(blankT);

  // Check append is ok
  reps.map((rep, repi) => {
    // First update any external list
    const uEx = updateExternals([{ ...rep }], exts);
    if (!uEx || uEx.length === 0) return;
    const incoming = uEx[0];

    // First entry can be used as a base
    if (repi === 0) {
      newRep = incoming;
    }
    // Add the incoming list onto the end of the current
    else {
      newRep.newTexts = newRep.newTexts.map((nt) => {
        return {
          ...nt,
          subLists: appendReplacement(incoming, nt.subLists),
        };
      });
    }
    return true;
  });
  return newRep;
};
