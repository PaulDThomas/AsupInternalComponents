import { AieStyleMap } from "../aie";
import { AioReplacement } from "../aio";

export interface AitCellData {
  aitid?: string,
  text: string,
  comments?: string,
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
  spaceAfter?: number | false,
};

export interface AitRowGroupData {
  aitid?: string,
  name?: string,
  rows: Array<AitRowData>,
  comments?: string,
  spaceAfter?: boolean,
  includeTrailing?: boolean,
  replacements?: AioReplacement[],
};

export interface AitTableData {
  headerData?: AitRowGroupData,
  bodyData?: AitRowGroupData[],
  comments?: string,
  rowHeaderColumns?: number,
  noRepeatProcessing?: boolean,
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
  rowHeaderColumns?: number,
  externalLists?: AioReplacement[],
  tableSection?: AitRowType,
  rowGroup?: number,
  row?: number,
  column?: number,
  showCellBorders?: boolean,
  groupTemplateNames?: string[],
  repeatNumber?: number[],
  repeatValues?: string[],
  commentStyles?: AieStyleMap,
  cellStyles?: AieStyleMap,
}