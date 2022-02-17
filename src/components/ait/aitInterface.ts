import { OptionGroup } from "components/aio/aioInterface";

export interface AitCellData {
  text: string,
  originalText: string,
  options: OptionGroup
  rowSpan?: number,
  colSpan?: number,
};

export interface AitRowData {
  cells: Array<AitCellData>,
  options: OptionGroup,
};

export interface AitRowGroupData {
  rows: Array<AitRowData>,
  options: OptionGroup,
};

export interface AitTableBodyData {
  rowGroups: Array<AitRowGroupData>,
  options: OptionGroup,
};

export interface AitTableData {
  headerData: AitRowGroupData,
  bodyData: AitTableBodyData,
  options: OptionGroup,
};


export interface AitLocation {
  tableSection: string,
  rowGroup?: number,
  row?: number,
  cell?: number,
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

export enum AitRowType {
  "header",
  "body",
}