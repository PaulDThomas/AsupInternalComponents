import { OptionGroup } from "components/aio/aioInterface";

export interface AitCellData {
  aitid?: string,
  text: string,
  originalText: string,
  options: OptionGroup
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
  "header",
  "rowHeader",
  "body",
}

export enum AitRowType {
  "header",
  "body",
}

export function uuidv4(): string {
  return (''+[1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, ch => {
      let c = Number(ch);
      return ((c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & 15)) >> c / 4).toString(16)
    }
  )
}
