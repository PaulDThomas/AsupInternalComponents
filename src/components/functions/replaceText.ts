import { AioReplacementText } from "../aio/aioInterface";
import { AitRowData } from "../ait/aitInterface";

export const replaceText = (
  rows: AitRowData[],
  replacementTexts: AioReplacementText[],
  newRepeatValues: string[][]
) => {
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].cells.length; c++) {
      let cell = rows[r].cells[c];
      let replacedText = cell.text;
      for (let rt = 0; rt < (replacementTexts?.length ?? 0); rt++) {
        // Replace if there in old and new text
        let o = replacementTexts![rt].text;
        let n = newRepeatValues[r][rt];
        if (n)
          replacedText = replacedText.replace(o, n);
      }
      if (replacedText !== cell.text) {
        cell.replacedText = replacedText;
      }
      else
        delete (cell.replacedText);
    }
  }
};
