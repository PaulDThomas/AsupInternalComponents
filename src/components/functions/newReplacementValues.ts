import { AioReplacementValues } from "../aio";

export const newReplacementValues = (): AioReplacementValues => {
  return {
    airid: crypto.randomUUID(),
    texts: [""],
    spaceAfter: false,
    subLists: [],
  };
};
