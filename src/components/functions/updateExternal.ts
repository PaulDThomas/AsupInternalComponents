import { cloneDeep } from "lodash";
import { AioExternalReplacements, AioReplacement, AioReplacementValues } from "../aio";
import { updateExternals } from "./updateExternals";

export const updateExternal = <T extends string | object>(
  rep: AioReplacement<T>,
  exts?: AioExternalReplacements<T>[],
): AioReplacement<T> => {
  const ix =
    rep.externalName !== undefined && exts !== undefined
      ? exts.findIndex((e) => e.givenName === rep.externalName)
      : -1;
  let found: AioReplacementValues<T>[] | undefined =
    ix > -1 && exts !== undefined && exts.length > ix ? cloneDeep(exts[ix].newTexts) : undefined;
  if (!found) {
    found = rep.newTexts.some((nt) => nt.subLists !== undefined)
      ? rep.newTexts.map((nts) => {
          const s1: AioReplacement<T>[] | undefined =
            nts.subLists === undefined ? undefined : updateExternals(nts.subLists, exts);
          const nt: AioReplacementValues<T> = {
            ...nts,
            subLists: s1,
          };
          return nt;
        })
      : rep.newTexts;
  }
  const newR: AioReplacement<T> = {
    ...rep,
    newTexts: found,
  };
  return newR;
};
