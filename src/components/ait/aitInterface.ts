import { OptionGroup } from "components/aio/aioInterface";

export interface AitCellData {
  aitid?: string,
  text: string,
  originalText: string,
  options: OptionGroup,
  renderColumn?: number,
  readOnly?: boolean,
};

export interface AitRowData {
  aitid?: string,
  cells: Array<AitCellData>,
  options: OptionGroup,
};

export interface AitRowGroupData {
  aitid?: string,
  rows: Array<AitRowData>,
  options: OptionGroup,
};

export interface AitTableBodyData {
  aitid?: string,
  rowGroups: Array<AitRowGroupData>,
  options: OptionGroup,
};

export interface AitTableData {
  headerData: AitRowGroupData,
  bodyData: AitTableBodyData,
  options: OptionGroup,
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

