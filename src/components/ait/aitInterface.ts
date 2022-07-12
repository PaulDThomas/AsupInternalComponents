import { DraftComponent } from "draft-js";
import { AieStyleMap } from "../aie";
import { AioExternalReplacements, AioReplacement } from "../aio";

export interface AitCellData {
  aitid?: string, // Unique ID
  text: string, 
  justifyText?: DraftComponent.Base.DraftTextAlignment | "decimal",
  comments?: string,
  colSpan?: number,
  rowSpan?: number,
  colWidth?: number,
  textIndents?: number, // Spaces/tabs at the start of the cell
  replacedText?: string, // Visible text after any list replacements
  repeatColSpan?: number, // ColSpan after any list replacements
  repeatRowSpan?: number, // RowSpan after any list replacements
  spaceAfterRepeat?: boolean, // If a blank row is required after this repeat
  spaceAfterSpan?: number, // Number of rowSpaceAfters being crossed
};

export interface AitRowData {
  aitid?: string, // Unique ID
  rowRepeat?: string, // Repeat ID
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
  headerData?: AitRowGroupData | false,
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
  rowRepeat?: string
  colRepeat?: string,
}

export interface AitColumnRepeat {
  columnIndex: number,
  colRepeat?: string,
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
  /* Table options and setters */
  noRepeatProcessing?: boolean,
  externalLists?: AioExternalReplacements[],
  showCellBorders?: boolean,
  groupTemplateNames?: string[],
  commentStyles?: AieStyleMap,
  cellStyles?: AieStyleMap,
  columnRepeats?: AitColumnRepeat[] | null,
  
  /* Table options with setters */
  headerRows?: number,
  setHeaderRows?: (ret: number) => void,
  rowHeaderColumns?: number,
  setRowHeaderColumns?: (ret: number) => void,
  windowZIndex: number,
  setWindowZIndex?: (ret: number) => void,
}