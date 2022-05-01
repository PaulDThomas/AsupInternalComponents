import structuredClone from "@ungap/structured-clone";
import { AioExternalReplacements, AioReplacement, AioReplacementValues } from "../aio";

/** Update base list with external lists */
export const updateExternals = (base?: AioReplacement, exts?: AioExternalReplacements[]): AioReplacement | undefined => {
  if (base === undefined) return undefined;
  let found: AioReplacementValues[] | undefined = base.externalName !== undefined && exts?.some(e => e.givenName === base.externalName)
    ? structuredClone(exts.find(e => base.externalName === e.givenName)?.newTexts!)
    : undefined;
  if (!found) {
    found = base.newTexts.some(nt => nt.subLists !== undefined)
      ? base.newTexts.map(nts => {
        let s1: AioReplacement[] | undefined = nts.subLists === undefined
          ? undefined
          : nts.subLists?.map(s => {
            return updateExternals(s, exts) as AioReplacement;
          });
        let nt: AioReplacementValues = {
          ...nts,
          subLists: s1,
        }
        return nt;
      })
      : base.newTexts;
  }
  let newR: AioReplacement = {
    ...base,
    newTexts: found
  };
  return newR;
};