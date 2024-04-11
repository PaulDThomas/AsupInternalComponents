import { fromHtml } from "../../functions/tofromHtml";

export const getRawTextParts = (s: string | object): string[] => {
  // Generic object search
  if (typeof s === "object") {
    const ret: string[] = [];
    const extractText = (obj: object) => {
      for (const key in Object.keys(obj)) {
        if (typeof obj[key as keyof typeof obj] === "object") {
          extractText(obj[key as keyof typeof obj]);
        } else if (key === "text") {
          ret.push(obj[key as keyof typeof obj]);
        }
      }
    };
    extractText(s);
    return ret;
  }

  // Do standard replace if not aie-text or no inline styles
  else if (!s.match(/^<div classname=["']aie-text/i) || !s.includes("data-inline-style-ranges")) {
    return [fromHtml(s)];
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
