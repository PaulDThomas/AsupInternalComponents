import { fromHtml } from "../../functions/tofromHtml";

export const getRawTextParts = <T extends string | object>(s: T): string[] => {
  // Generic object search
  if (typeof s === "object" && s !== null) {
    const ret: string[] = [];
    const extractText = (obj: object) => {
      Object.keys(obj).forEach((key) => {
        if (
          typeof obj[key as keyof typeof obj] === "object" &&
          obj[key as keyof typeof obj] !== null
        ) {
          extractText(obj[key as keyof typeof obj]);
        } else if (key === "text") {
          ret.push(obj[key as keyof typeof obj]);
        }
      });
    };
    extractText(s);
    return ret;
  }

  // Do standard replace if not aie-text or no inline styles
  else if (!s.match(/^<div classname=["']aie-text/i) || !s.includes("data-inline-style-ranges")) {
    return [fromHtml(s)] as string[];
  }

  // Standard HTML text
  else {
    // Create element to manipulate
    const ret: string[] = [];
    const htmlIn: HTMLTemplateElement = document.createElement("template");
    htmlIn.innerHTML = s.trim();
    // Cycle through elements
    htmlIn.content.childNodes.forEach((el) => {
      if (el.textContent !== null) ret.push(el.textContent);
    });
    return ret;
  }
};
