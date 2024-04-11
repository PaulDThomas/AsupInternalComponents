import { AitHeaderCellData } from "components/table/interface";
import { AitCellData } from "main";

export const UpdateCellTextVersion = <
  T extends string | object,
  R extends AitCellData<T> | AitHeaderCellData<T>,
>(
  cell: R,
): R => {
  return {
    ...cell,
    text:
      typeof cell.text === "string" && !cell.text.startsWith("<div") && cell.text !== ""
        ? `<div classname="aie-text"><span>${cell.text}</span></div>`
        : cell.text,
  };
};
