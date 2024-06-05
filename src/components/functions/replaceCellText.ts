import { isEqual } from "lodash";
import { AitCellData, AitHeaderCellData } from "../table/interface";

export const replaceCellText = <
  T extends string | object,
  R extends AitCellData<T> | AitHeaderCellData<T>,
>(
  cell: R,
  oldText: string,
  newText: T,
  replaceText: (s: T, oldPhrase: string, newPhrase: T) => T,
): R => {
  const replacedText = replaceText(cell.replacedText ?? cell.text, oldText, newText);
  return {
    ...cell,
    replacedText: !isEqual(cell.text, replacedText) ? replacedText : undefined,
  };
};
