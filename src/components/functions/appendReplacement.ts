import { cloneDeep } from "lodash";
import { AioReplacement } from "../aio";

export const appendReplacement = <T extends string | object>(
  incoming: AioReplacement<T>,
  subLists?: AioReplacement<T>[],
): AioReplacement<T>[] | undefined => {
  let newSubLists: AioReplacement<T>[] = [];

  if (subLists === undefined || subLists.length === 0) {
    newSubLists.push(cloneDeep(incoming));
  } else {
    newSubLists = subLists.map((s) => {
      return {
        ...s,
        newTexts: s.newTexts.map((nt) => {
          return {
            ...nt,
            subLists: appendReplacement(incoming, nt.subLists),
          };
        }),
      };
    });
  }
  return newSubLists;
};
