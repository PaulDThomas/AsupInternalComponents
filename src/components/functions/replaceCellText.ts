import { newReplacedText } from "../aie/functions/newReplacedText";
import { AitCellData } from "../ait";

export const replaceCellText = (
  cell: AitCellData,
  oldText: string,
  newText: string,
): AitCellData => {
  const replacedText =
    cell.replacedText !== undefined
      ? newReplacedText(cell.replacedText, oldText, newText)
      : cell.text.includes(oldText)
      ? newReplacedText(cell.text, oldText, newText)
      : undefined;
  return {
    ...cell,
    replacedText: replacedText,
  };
};
