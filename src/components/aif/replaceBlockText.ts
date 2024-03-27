import { newReplacedText } from "../aie/functions/newReplacedText";
import { AioExternalSingle } from "../aio";

export const replaceBlockText = (
  text?: string | null,
  rep?: AioExternalSingle,
): { newText: string | null | undefined; updated: boolean } => {
  // Stop processing
  if (
    text === undefined ||
    text === null ||
    rep === undefined ||
    rep.oldText === undefined ||
    rep.oldText === "" ||
    rep.newText === undefined
  )
    return { newText: text, updated: false };
  // Not found
  if (!text.includes(rep.oldText)) return { newText: text, updated: false };
  // Make replacement
  return { newText: newReplacedText(text, rep.oldText, rep.newText), updated: true };
};
