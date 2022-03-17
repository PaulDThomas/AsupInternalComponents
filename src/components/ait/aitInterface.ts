import { AioOptionGroup, AioReplacement } from "components/aio/aioInterface";

export interface AitCellData {
  aitid: string,
  text: string,
  options: AioOptionGroup,
  readOnly?: boolean,
};

export interface AitRowData {
  aitid: string,
  cells: AitCellData[],
  options: AioOptionGroup,
};

export interface AitRowGroupData {
  aitid: string,
  rows: Array<AitRowData>,
  options: AioOptionGroup,
};

export interface AitTableBodyData {
  rowGroups: Array<AitRowGroupData>,
  options: AioOptionGroup,
};

export interface AitTableData {
  headerData: AitRowGroupData,
  bodyData: AitTableBodyData,
  options: AioOptionGroup,
};


export interface AitLocation {
  tableSection: AitCellType,
  rowGroup: number,
  row: number,
  column: number,
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
  "header",
  "body",
}

export interface AitOptionList {
  tableSection: AitCellType,
  rowGroup: number,
  row: number,
  column: number,
  showCellBorders: boolean,
  replacements: AioReplacement[],
  repeatNumber: number[],
  repeatValues: string[],
}