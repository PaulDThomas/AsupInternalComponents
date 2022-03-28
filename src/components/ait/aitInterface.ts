import { AioReplacement } from "components/aio/aioInterface";

export interface AitCellData {
  aitid: string,
  text: string,
  rowSpan: number,
  colSpan: number,
  colWidth?: number,
  textIndents?: number,
  replacedText?: string,
};

export interface AitRowData {
  aitid: string,
  cells: AitCellData[],
};

export interface AitRowGroupData {
  aitid: string,
  rows: Array<AitRowData>,
  replacements: AioReplacement[],
};

export interface AitTableData {
  headerData: AitRowGroupData,
  bodyData: AitRowGroupData[],
  rowHeaderColumns: number,
  noRepeatProcessing: boolean,
};

export interface AitCoord {
  row: number,
  column: number,
}

export interface AitLocation extends AitCoord {
  tableSection: AitRowType,
  rowGroup: number,
  repeat: string
}

export enum AitOptionLocation {
  tableSection = "tableSection",
  rowGroup = "rowGroup",
  row = "row",
  cell = "cell",
}

export enum AitCellType {
  header = "header",
  rowHeader = "rowHeader",
  body = "body",
}

export enum AitRowType {
  header = "header",
  body = "body",
}

export interface AitOptionList {
  tableSection: AitRowType,
  noRepeatProcessing: boolean,
  headerRows: number,
  columns: number,
  rowHeaderColumns: number,
  rowGroup: number,
  row: number,
  column: number,
  showCellBorders: boolean,
  replacements?: AioReplacement[],
  repeatNumber?: number[],
  repeatValues?: string[],
}