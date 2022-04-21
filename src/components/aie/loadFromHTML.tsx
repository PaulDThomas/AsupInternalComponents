import { ContentState, convertFromHTML, convertFromRaw, RawDraftContentBlock } from "draft-js";

/**
 * Function to turn HTML string back into Draft-js content
 * @param s HTML string to load
 * @returns Content stats to load into Draft-js editor
 */
export const loadFromHTML = (s: string): ContentState => {
  // There are no spans to apply
  let initialBlocks = convertFromHTML(s);
  if (!s.startsWith("<div className='aie-text'")) {
    let state = ContentState.createFromBlockArray(initialBlocks.contentBlocks, initialBlocks.entityMap);
    return state;
  }

  // 
  else {
    let htmlIn = document.createElement('template');
    htmlIn.innerHTML = s.trim();
    let rawBlocks: RawDraftContentBlock[] = [];
    for (let i = 0; i < htmlIn.content.children.length; i++) {
      let child = htmlIn.content.children[i] as HTMLDivElement;
      let rawBlock: RawDraftContentBlock = {
        key: child.dataset.key ?? "",
        type: child.dataset.type ?? "unstyled",
        text: child.innerText,
        depth: 0,
        inlineStyleRanges: JSON.parse(child.dataset.inlineStyleRanges ?? "[]"),
        entityRanges: [],
      };
      rawBlocks.push(rawBlock);
    }
    let state = convertFromRaw({ blocks: rawBlocks, entityMap: initialBlocks.entityMap });
    return state;
  }
};
