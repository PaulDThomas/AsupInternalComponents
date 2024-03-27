import { ContentState, convertFromHTML, convertFromRaw, RawDraftContentBlock } from "draft-js";

/**
 * Function to turn HTML string back into Draft-js content
 * @param s HTML string to load
 * @returns Content stats to load into Draft-js editor
 */
export const loadFromHTML = (s: string, editable?: boolean): ContentState => {
  // Update ~ here if it is not a DIV
  const initialBlocks = convertFromHTML(editable === false ? s.replace(/~/g, "<br/>") : s);
  // There are no spans to apply
  if (!s.match(/^<div classname=["']aie-text/i)) {
    const state = ContentState.createFromBlockArray(
      initialBlocks.contentBlocks,
      initialBlocks.entityMap,
    );
    return state;
  }

  // Work out where style ranges are includes
  else {
    const htmlIn = document.createElement("template");
    htmlIn.innerHTML = s.trim();
    const rawBlocks: RawDraftContentBlock[] = [];
    // There should be only one child
    for (let i = 0; i < htmlIn.content.children.length; i++) {
      const child = htmlIn.content.children[i] as HTMLDivElement;
      const rawBlock: RawDraftContentBlock = {
        key: child.dataset.key ?? "",
        type: child.dataset.type ?? "unstyled",
        // Update ~ here if it is a DIV
        text: editable === false ? child.innerText.replace(/~/g, "\n") : child.innerText,
        depth: 0,
        // Style ranges from data
        inlineStyleRanges: JSON.parse(child.dataset.inlineStyleRanges ?? "[]"),
        entityRanges: [],
      };
      // Seems to be a problem here for testing, not sure why the if is required...
      if (rawBlocks !== undefined) rawBlocks.push(rawBlock);
    }
    const state = convertFromRaw({ blocks: rawBlocks, entityMap: initialBlocks.entityMap });
    return state;
  }
};
