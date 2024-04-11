import { newReplacedText } from "../aie/functions/newReplacedText";
import { AitCellData, AitHeaderCellData } from "../table/interface";
import { isEqual } from "lodash";

export const replaceCellText = <
  T extends string | object,
  R extends AitCellData<T> | AitHeaderCellData<T>,
>(
  cell: R,
  oldText: string,
  newText: string,
): R => {
  const replacedText = newReplacedText(cell.replacedText ?? cell.text, oldText, newText);
  return {
    ...cell,
    replacedText: !isEqual(cell.text, replacedText) ? replacedText : undefined,
  };
};
