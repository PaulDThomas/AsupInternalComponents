import structuredClone from '@ungap/structured-clone';
import { AioReplacement } from '../aio';

export const appendReplacement = (
  incoming: AioReplacement,
  subLists?: AioReplacement[],
): AioReplacement[] | undefined => {
  let newSubLists: AioReplacement[] = [];

  if (subLists === undefined || subLists.length === 0) {
    newSubLists.push(structuredClone(incoming));
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
