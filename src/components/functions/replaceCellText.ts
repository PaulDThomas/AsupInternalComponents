import { newReplacedText } from "components/aie/newReplacedText";
import { AitCellData } from "components/ait";

export const replaceCellText = (cell: AitCellData, oldText: string, newText: string): AitCellData => {
  let replacedText = cell.replacedText !== undefined
   ? newReplacedText(cell.replacedText,oldText, newText)
   : cell.text.includes(oldText) 
   ? newReplacedText(cell.text,oldText, newText)
   : undefined;
  return {
    ...cell,
    replacedText:replacedText
  };
}