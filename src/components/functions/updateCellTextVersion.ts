import { AitCellData } from "components/ait";
import { AitHeaderCellData } from "components/ait/aitInterface";

export const UpdateCellTextVersion = <T extends AitCellData | AitHeaderCellData>(cell: T): T => {
  return {
    ...cell,
    text:
      !cell.text.startsWith("<div") && cell.text !== ""
        ? `<div classname="aie-text"><span>${cell.text}</span></div>`
        : cell.text,
  };
};
