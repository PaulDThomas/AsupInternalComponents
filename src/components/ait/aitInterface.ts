import { OptionGroup } from "components/aio/aioInterface";

export interface AitCellData {
  text: string,
  originalText: string,
  options: OptionGroup
  rowSpan?: number,
  colSpan?: number,
};

export interface AitLocation {
  tableSection: string,
  rowGroup: number,
  row: number,
  cell: number,
}

export enum AitOptionLocation {
  tableSection = "tableSection",
  rowGroup = "rowGroup",
  row = "row",
  cell = "cell",
}

export enum AitCellType {
  "header",
  "rowHeader",
  "body",
}