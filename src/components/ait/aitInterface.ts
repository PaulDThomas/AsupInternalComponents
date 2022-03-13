import { AioOptionGroup } from "components/aio/aioInterface";

export interface AitCellData {
  aitid?: string,
  text: string,
  originalText: string,
  options: AioOptionGroup,
  renderColumn?: number,
  readOnly?: boolean,
};

export interface AitRowData {
  aitid?: string,
  cells: Array<AitCellData>,
  options: AioOptionGroup,
};

export interface AitRowGroupData {
  aitid?: string,
  rows: Array<AitRowData>,
  options: AioOptionGroup,
};

export interface AitTableBodyData {
  aitid?: string,
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
  cell: number,
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

