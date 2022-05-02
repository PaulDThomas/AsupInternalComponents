import structuredClone from "@ungap/structured-clone";
import { AioExternalReplacements, AioReplacement, AioReplacementValues } from "../aio";

/** Update base list with external lists */
export const updateExternals = (reps?: AioReplacement[], exts?: AioExternalReplacements[]): AioReplacement[] | undefined => {
  if (reps === undefined) return undefined;
  return reps.map(rep => updateExternal(rep, exts));
}

const updateExternal = (rep: AioReplacement, exts?: AioExternalReplacements[]): AioReplacement => {
  let found: AioReplacementValues[] | undefined = rep.externalName !== undefined && exts?.some(e => e.givenName === rep.externalName)
    ? structuredClone(exts.find(e => rep.externalName === e.givenName)?.newTexts!)
    : undefined;
  if (!found) {
    found = rep.newTexts.some(nt => nt.subLists !== undefined)
      ? rep.newTexts.map(nts => {
        let s1: AioReplacement[] | undefined = nts.subLists === undefined
          ? undefined
          : updateExternals(nts.subLists, exts)
          ;
        let nt: AioReplacementValues = {
          ...nts,
          subLists: s1,
        }
        return nt;
      })
      : rep.newTexts;
  }
  let newR: AioReplacement = {
    ...rep,
    newTexts: found
  };
  return newR;
};