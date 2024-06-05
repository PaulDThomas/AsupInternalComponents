import { AioExternalSingle } from "../aio";

export const newExternalSingle = <T extends string | object>(blankT: T): AioExternalSingle<T> => {
  return {
    airid: crypto.randomUUID(),
    oldText: "",
    newText: blankT,
  };
};
