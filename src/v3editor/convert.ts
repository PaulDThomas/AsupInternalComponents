import { IEditorV3 } from "@asup/editor-v3";
import { stringToV3 } from "./stringToV3";
import {
  AitCellData,
  AitHeaderGroupData,
  AitHeaderRowData,
  AitRowData,
  AitRowGroupData,
  AitTableData,
} from "../components/table/interface";
import { AibBlockLine, AibLineType } from "../components/block/aibInterface";
import { AioReplacement, AioReplacementValues } from "../components/aio/aioInterface";
import { fromHtml } from "../components/functions/tofromHtml";

const convertHeaderCell = (cell: AitCellData<string | IEditorV3>): AitCellData<IEditorV3> => ({
  ...cell,
  text: typeof cell.text === "string" ? stringToV3(cell.text) : cell.text,
  replacedText:
    typeof cell.replacedText === "string" ? stringToV3(cell.replacedText) : cell.replacedText,
});

const convertHeaderRow = (
  row: AitHeaderRowData<string | IEditorV3>,
): AitHeaderRowData<IEditorV3> => ({
  ...row,
  cells: row.cells.map((c) => convertHeaderCell(c)),
});

const convertHeaderGroup = (
  rg: AitHeaderGroupData<string | IEditorV3>,
): AitHeaderGroupData<IEditorV3> => ({
  ...rg,
  rows: rg.rows.map((r) => convertHeaderRow(r)),
});

const convertCell = (cell: AitCellData<string | IEditorV3>): AitCellData<IEditorV3> => ({
  ...cell,
  text: typeof cell.text === "string" ? stringToV3(cell.text) : cell.text,
  replacedText:
    typeof cell.replacedText === "string" ? stringToV3(cell.replacedText) : cell.replacedText,
});

const convertRow = (row: AitRowData<string | IEditorV3>): AitRowData<IEditorV3> => ({
  ...row,
  cells: row.cells.map((c) => convertCell(c)),
});

export const convertRowGroup = (
  rg: AitRowGroupData<string | IEditorV3>,
): AitRowGroupData<IEditorV3> => ({
  ...rg,
  rows: rg.rows.map((r) => convertRow(r)),
  replacements: rg.replacements?.map((rep) => convertReplacements(rep)),
});

export const convertTable = (table: AitTableData<string | IEditorV3>): AitTableData<IEditorV3> => ({
  ...table,
  headerData: table.headerData ? convertHeaderGroup(table.headerData) : table.headerData,
  bodyData: table.bodyData ? table.bodyData.map((rg) => convertRowGroup(rg)) : table.bodyData,
});

export const convertBlockLine = (
  bl: AibBlockLine<string | IEditorV3>,
): AibBlockLine<IEditorV3> => ({
  ...bl,
  left: typeof bl.left === "string" ? stringToV3(bl.left) : bl.left ?? null,
  center: typeof bl.center === "string" ? stringToV3(bl.center) : bl.center ?? null,
  right: typeof bl.right === "string" ? stringToV3(bl.right) : bl.right ?? null,
  lineType:
    bl.left === undefined && bl.right === undefined
      ? AibLineType.centerOnly
      : bl.center === undefined && bl.right === undefined
        ? AibLineType.leftOnly
        : bl.center === undefined
          ? AibLineType.leftAndRight
          : AibLineType.leftCenterAndRight,
});

export const convertReplacements = (groupReplacement: AioReplacement): AioReplacement => ({
  ...groupReplacement,
  oldText: fromHtml(groupReplacement.oldText),
  newTexts: groupReplacement.newTexts.map((rv) => convertReplacementValues(rv)),
});

const convertReplacementValues = (
  replacementValue: AioReplacementValues,
): AioReplacementValues => ({
  ...replacementValue,
  texts: replacementValue.texts.map((text) => fromHtml(text)),
  subLists: replacementValue.subLists?.map((l) => convertReplacements(l)),
});
