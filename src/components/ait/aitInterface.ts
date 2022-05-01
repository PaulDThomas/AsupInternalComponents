import { AieStyleMap } from "../aie";
import { AioExternalReplacements, AioReplacement } from "../aio";

export interface AitCellData {
  aitid?: string, // Unique ID
  text: string, 
  comments?: string,
  colSpan?: number,
  rowSpan?: number,
  colWidth?: number,
  textIndents?: number, // Spaces/tabs at the start of the cell
  replacedText?: string, // Visible text after any list replacements
  repeatColSpan?: number, // ColSpan after any list replacements
  repeatRowSpan?: number, // RowSpan after any list replacements
};

export interface AitRowData {
  aitid?: string, // Unique ID
  cells: AitCellData[],
  spaceAfter?: boolean, // Indicator if there is space after a row
};

export interface AitRowGroupData {
  aitid?: string, // Unique ID
  name?: string, // Optional name for a row group type
  rows: AitRowData[],
  comments?: string,
  spaceAfter?: boolean, // Indicator if there is space after the last row in the group
  replacements?: AioReplacement[], // Replacement lists to use for repeats
};

export interface AitTableData {
  headerData?: AitRowGroupData,
  bodyData?: AitRowGroupData[],
  comments?: string,
  rowHeaderColumns?: number, // Number of label type columns before data is presented
  noRepeatProcessing?: boolean, // Indicator is repeat lists should be processed
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
  externalLists?: AioExternalReplacements[],
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