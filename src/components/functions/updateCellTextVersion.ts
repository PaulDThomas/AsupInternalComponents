import { AitHeaderCellData } from "components/table/interface";
import { AitCellData } from "main";

export const UpdateCellTextVersion = <T extends AitCellData | AitHeaderCellData>(cell: T): T => {
  return {
    ...cell,
    text:
      !cell.text.startsWith("<div") && cell.text !== ""
        ? `<div classname="aie-text"><span>${cell.text}</span></div>`
        : cell.text,
  };
};
