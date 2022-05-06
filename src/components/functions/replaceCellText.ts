import { newReplacedText } from "../aie/newReplacedText";
import { AitCellData } from "../ait";

export const replaceCellText = (cell: AitCellData, oldText: string, newText: string, spaceAfter?: boolean): AitCellData => {
  let replacedText = cell.replacedText !== undefined
    ? newReplacedText(cell.replacedText, oldText, newText)
    : cell.text.includes(oldText)
      ? newReplacedText(cell.text, oldText, newText)
      : undefined;
  return {
    ...cell,
    spaceAfterRepeat: cell.spaceAfterRepeat || spaceAfter,
    replacedText: replacedText
  };
}