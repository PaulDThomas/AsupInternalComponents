import { AioReplacementValues } from "../aio";

export const newReplacementValues = <T extends string | object>(
  blankT: T,
): AioReplacementValues<T> => {
  return {
    airid: crypto.randomUUID(),
    texts: [blankT],
    spaceAfter: false,
    subLists: [],
  };
};
