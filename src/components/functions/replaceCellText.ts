import { AitHeaderCellData } from "components/ait/aitInterface";
import { newReplacedText } from "../aie/functions/newReplacedText";
import { AitCellData } from "../ait";

export const replaceCellText = <T extends AitCellData | AitHeaderCellData>(
  cell: T,
  oldText: string,
  newText: string,
): T => {
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
