import { AioReplacement } from "../aio/aioInterface";

export interface AitCellData {
  aitid?: string,
  text: string,
  colSpan?: number,
  rowSpan?: number,
  colWidth?: number,
  textIndents?: number,
  replacedText?: string,
  repeatColSpan?: number,
  repeatRowSpan?: number,
};

export interface AitRowData {
  aitid?: string,
  cells: AitCellData[],
  spaceAfter?: boolean,
};

export interface AitRowGroupData {
  aitid?: string,
  rows: Array<AitRowData>,
  replacements?: AioReplacement[],
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

export interface AitColumnRepeat {
  columnIndex: number,
  repeatNumbers?: number[],
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
  noRepeatProcessing?: boolean,
  headerRows?: number,
  columns?: number,
  rowHeaderColumns?: number,
  externalLists?: AioReplacement[],
  tableSection?: AitRowType,
  rowGroup?: number,
  row?: number,
  column?: number,
  showCellBorders?: boolean,
  replacements?: AioReplacement[],
  repeatNumber?: number[],
  repeatValues?: string[],
  columnRepeats?: AitColumnRepeat[],
}