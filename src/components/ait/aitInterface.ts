import { AioOptionGroup, AioReplacement } from "components/aio/aioInterface";

export interface AitCellData {
  aitid: string,
  text: string,
  options: AioOptionGroup,
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

export enum AitCellOptionNames {
  cellWidth = "cellWidth",
  cellStatistic = "cellStatisic",
  cellText = "cellText",
  colSpan = "colSpan",
  rowSpan = "rowSpan",
  cellType = "cellType",
  readOnly = "readOnly",
};
export enum AitRowOptionNames {

};
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
  tableSection: AitCellType,
  noRepeatProcessing: boolean,
  rowGroup: number,
  row: number,
  column: number,
  showCellBorders: boolean,
  replacements?: AioReplacement[],
  repeatNumber?: number[],
  repeatValues?: string[],
}