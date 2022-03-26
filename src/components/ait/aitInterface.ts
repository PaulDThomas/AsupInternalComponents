import { AioOptionGroup, AioReplacement } from "components/aio/aioInterface";

export interface AitCellData {
  aitid: string,
  text: string,
  replacedText?: string,
  rowSpan: number,
  colSpan: number,
  colWidth?: number,
};

export interface AitRowData {
  aitid: string,
  cells: AitCellData[],
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
  tableSection: AitRowType,
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

export enum AitRowGroupOptionNames {
  rgName = "rgName",
  replacements = "replacements",
};
export enum AitTableOptionNames {
  tableName = "tableName",
  tableDescription = "tableDescription",
  noRepeatProcessing = "noRepeatProcessing",
  rowHeaderColumns = "rowHeaderColumns",
  repeatingColumns = "repeatingColumns",
  columnRepeatList = "columnRepeatList",
};
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