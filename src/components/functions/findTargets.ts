import { AitRowData, AitCoord } from "components/ait/aitInterface";
import { AioReplacementText } from "../aio/aioInterface";

/** Find which row replacementText first appears in */
export const findTargets = (rows: AitRowData[], replacementTexts?: AioReplacementText[]): AitCoord[] => {
  let targetArray: AitCoord[] = [];
  if (!replacementTexts || replacementTexts.length === 0)
    return targetArray;

  textSearch: for (let i = 0; i < replacementTexts.length; i++) {
    rowSearch: for (let ri = 0; ri < rows.length; ri++) {
      for (let ci = 0; ci < rows[ri].cells.length; ci++) {
        if (rows[ri].cells[ci].text.includes(replacementTexts[i].text)) {
          targetArray.push({ row: ri, column: ci });
          break rowSearch;
        }
      }
      if (targetArray.length < i)
        break textSearch;
    }
  }
  return targetArray;
};
