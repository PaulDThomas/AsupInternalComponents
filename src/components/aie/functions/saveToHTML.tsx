import { DraftStyleMap, RawDraftContentState } from "draft-js";
import { toHtml } from "../../functions";
import { htmlBlock } from "./htmlBlock";

/**
 * Aggregate function to change editor contents into HTML string
 * @param d Raw Draft-js block
 * @param dsm Style map that has been applied
 * @returns URI encoded HTML string of the content
 */
export const saveToHTML = (d: RawDraftContentState, dsm: DraftStyleMap): string => {
  /** Check for just a single line with no formatting/leading spaces */
  if (d.blocks.length === 1
    && d.blocks[0].inlineStyleRanges.length === 0
    && !d.blocks[0].text.startsWith(" ")
    && !d.blocks[0].text.startsWith("&nbsp;")
    && !d.blocks[0].text.startsWith("\u00A0"))
    return toHtml(d.blocks[0].text);


  /** Otherwise save full format */
  else
    return d.blocks.map(b => htmlBlock(b, dsm)).join(``);
};
