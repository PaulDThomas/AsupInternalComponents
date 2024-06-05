import { cloneDeep } from "lodash";
import { fromHtml } from "../../functions/tofromHtml";

/**
 * Replace text in HTML string, updating inline-style-ranges
 * @param s
 * @param oldPhrase
 * @param newPhrase
 * @returns
 */
export const newReplacedText = <T extends string | object>(
  s: T,
  oldPhrase: string,
  newPhrase: T,
): T => {
  let ret: T;

  if (typeof newPhrase !== "string") {
    throw new Error("If newPhrase is not a string, a custom function is required");
  }

  // Generic object replacement
  else if (typeof s === "object") {
    const replaceText = (obj: object) => {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key as keyof typeof obj] === "object") {
          replaceText(obj[key as keyof typeof obj]);
        } else if (key === "text" && typeof obj[key as keyof typeof obj] === "string") {
          obj[key as keyof typeof obj] = (obj[key as keyof typeof obj] as string).replaceAll(
            oldPhrase,
            newPhrase,
          ) as (typeof obj)[keyof typeof obj];
        }
      });
    };
    ret = cloneDeep(s);
    replaceText(ret);
  }

  // Do standard replace if not aie-text or no inline styles
  else if (!s.match(/^<div classname=["']aie-text/i)) {
    ret = s.replaceAll(oldPhrase, newPhrase) as T;
  }

  // Otherwise work out new style points
  else {
    // Create element to manipulate
    const htmlIn = document.createElement("template");
    htmlIn.innerHTML = s.trim();
    // Cycle through each block as a div
    for (let i = 0; i < htmlIn.content.children.length; i++) {
      // Set up for inlineStyle manipulation
      let pos = 0;
      const inlineStyleRanges: { offset: number; length: number; style: string }[] = [];
      // Update element text
      const child = htmlIn.content.children[i] as HTMLDivElement;
      // Get new style lengths
      for (let j = 0; j < child.childNodes.length; j++) {
        child.childNodes[j].textContent =
          child.childNodes[j].textContent?.replaceAll(oldPhrase, fromHtml(newPhrase)) ?? "";
        // Should only be possible to have span and #text
        if (child.childNodes[j].nodeName === "SPAN") {
          const subchild = child.childNodes[j] as HTMLSpanElement;
          inlineStyleRanges.push({
            offset: pos,
            length: subchild.textContent?.length ?? 0,
            style: subchild.attributes.getNamedItem("classname")?.value ?? "",
          });
          pos = pos + (subchild.textContent?.length ?? 0);
        }
        // Move position marker
        else {
          pos = pos + (child.childNodes[j] as Text).length;
        }
      }
      // Replace block data
      child.dataset.inlineStyleRanges = JSON.stringify(inlineStyleRanges);
    }
    // Return processed element
    ret = htmlIn.innerHTML as T;
  }
  return ret as T;
};
