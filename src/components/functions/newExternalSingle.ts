import { AioExternalSingle } from "../aio";

export const newExternalSingle = (): AioExternalSingle => {
  return {
    airid: crypto.randomUUID(),
    oldText: "",
    newText: "",
  };
};
