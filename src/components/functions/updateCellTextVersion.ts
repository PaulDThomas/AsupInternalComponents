import { AitCellData } from "components/ait";

export const UpdateCellTextVersion = (cell: AitCellData): AitCellData => {
  return {
    ...cell,
    text:
      !cell.text.startsWith("<div") && cell.text !== ""
        ? `<div classname="aie-text"><span>${cell.text}</span></div>`
        : cell.text,
  };
};
