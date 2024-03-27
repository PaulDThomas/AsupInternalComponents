import { cloneDeep } from "lodash";
import { AioExternalReplacements, AioReplacement, AioReplacementValues } from "../aio";
import { updateExternals } from "./updateExternals";

export const updateExternal = (
  rep: AioReplacement,
  exts?: AioExternalReplacements[],
): AioReplacement => {
  const ix =
    rep.externalName !== undefined && exts !== undefined
      ? exts.findIndex((e) => e.givenName === rep.externalName)
      : -1;
  let found: AioReplacementValues[] | undefined =
    ix > -1 && exts !== undefined && exts.length > ix ? cloneDeep(exts[ix].newTexts) : undefined;
  if (!found) {
    found = rep.newTexts.some((nt) => nt.subLists !== undefined)
      ? rep.newTexts.map((nts) => {
          const s1: AioReplacement[] | undefined =
            nts.subLists === undefined ? undefined : updateExternals(nts.subLists, exts);
          const nt: AioReplacementValues = {
            ...nts,
            subLists: s1,
          };
          return nt;
        })
      : rep.newTexts;
  }
  const newR: AioReplacement = {
    ...rep,
    newTexts: found,
  };
  return newR;
};
