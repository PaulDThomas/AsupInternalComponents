import { AieStyleMap, AieStyleExcludeMap } from "./aieInterface";

/**
 * Returns style maps that are excluded from the given map
 * @param styleMap Current style map
 * @returns list of excluded maps
 */
export const styleMapToExclude = (styleMap?: AieStyleMap): AieStyleExcludeMap => {
  let e: AieStyleExcludeMap = {};
  if (styleMap !== undefined)
    for (let s of Object.keys(styleMap!))
      e[s] = styleMap![s].aieExclude;
  return e;
};
