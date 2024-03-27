import { DraftStyleMap, RawDraftContentState } from "draft-js";
import { htmlBlock } from "./htmlBlock";

/**
 * Aggregate function to change editor contents into HTML string
 * @param d Raw Draft-js block
 * @param dsm Style map that has been applied
 * @returns URI encoded HTML string of the content
 */
export const saveToHTML = (d: RawDraftContentState, dsm: DraftStyleMap): string => {
  return d.blocks.map((b) => htmlBlock(b, dsm)).join("");
};
