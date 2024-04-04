import { v4 as uuidv4 } from "uuid";
import { AioReplacementValues } from "../aio";

export const newReplacementValues = (): AioReplacementValues => {
  return {
    airid: uuidv4(),
    texts: [""],
    spaceAfter: false,
    subLists: [],
  };
};
