import { DraftStyleMap } from "draft-js";
import { AieStyleMap } from "./AsupInternalEditor";

/**
 * Change AieStyle map into Draft-js version
 * @param styleMap Editor style map
 * @returns Draft-js style map
 */
export const styleMapToDraft = (styleMap?: AieStyleMap): DraftStyleMap => {
  let d: DraftStyleMap = {};
  if (styleMap !== undefined)
    for (let s of Object.keys(styleMap!)) {
      d[s] = styleMap![s].css;
    }
  return d;
};
