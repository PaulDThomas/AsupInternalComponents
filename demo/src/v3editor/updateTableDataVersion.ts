import { AitHeaderCellData } from "components/table/interface";
import { AitCellData, AitRowData, AitTableData } from "main";
import { AioReplacement } from "../../../src/components/aio";
import { UpdateCellTextVersion } from "./updateCellTextVersion";
import { oldReplacement, updateReplacementVersion } from "./updateReplacementVersion";

interface OldTableData {
  headerData?: OldRowGroupData;
  bodyData?: OldRowGroupData[];
  comments?: string;
  rowHeaderColumns?: number;
  noRepeatProcessing?: boolean;
}

interface OldRowGroupData {
  aitid?: string;
  name?: string;
  rows: AitRowData<string>[];
  comments?: string;
  spaceAfter?: boolean;
  replacements?: AioReplacement<string>[] | oldReplacement[];
}

export const updateTableDataVersion = (
  inData: OldTableData | AitTableData<string>,
  defaultCellWidth: number,
): AitTableData<string> => {
  const headerData =
    inData.headerData === false
      ? false
      : inData.headerData !== undefined
        ? {
            ...inData.headerData,
            replacements:
              inData.headerData?.replacements !== undefined
                ? updateReplacementVersion(inData.headerData?.replacements)
                : undefined,
          }
        : undefined;
  const outData: AitTableData<string> = {
    ...inData,
    headerData: headerData,
    bodyData: inData.bodyData?.map((rg) => {
      const org = {
        ...rg,
        replacements:
          rg.replacements !== undefined ? updateReplacementVersion(rg.replacements) : undefined,
      };
      if (rg.replacements === undefined) delete org.replacements;
      return org;
    }),
  };

  // Ensure all column widths are consistent
  if (
    outData.bodyData?.some((rg) =>
      rg.rows.map((r) => r.cells.some((c) => c.colWidth === undefined)),
    )
  ) {
    const colWidths =
      // Get all column widths
      (
        outData.headerData
          ? outData.headerData.rows.map((r) => r.cells.map((c) => c.colWidth))
          : outData.bodyData.flatMap((rg) => rg.rows.map((r) => r.cells.map((c) => c.colWidth)))
      )
        // Get max, or zero if totally undefined
        .reduce(
          (prev, cur) =>
            cur.map((w, i) => ((w ?? 9999) < (prev[i] ?? 9999) ? w ?? 9999 : prev[i] ?? 9999)),
          [],
        )
        // Replace zeros with default
        .map((w) => (w === 9999 ? defaultCellWidth : w));
    if (outData.headerData)
      outData.headerData?.rows.forEach((r) =>
        r.cells.forEach((c, ci) => (c.colWidth = colWidths[ci])),
      );
    outData.bodyData?.forEach((rg) =>
      rg.rows.forEach((r) => r.cells.forEach((c, ci) => (c.colWidth = colWidths[ci]))),
    );
  }

  // Look for text to change to HTML, row and col span as zero
  if (outData.headerData)
    outData.headerData.rows.forEach(
      (r, ri) =>
        (r.cells = r.cells.map((c, ci, cells) => {
          const newCell: AitHeaderCellData<string> = {
            ...UpdateCellTextVersion(c),
          };
          // Work out which direction the span is in
          if (newCell.colSpan === 0 && newCell.rowSpan === 0) {
            if (ci === 0) {
              newCell.colSpan = 1;
            } else if (ri === 0) {
              newCell.rowSpan = 1;
            } else if (cells[ci - 1].colSpan === 1) newCell.colSpan = 1;
            else newCell.rowSpan = 0;
          }
          return newCell;
        })),
    );
  outData.bodyData?.forEach((rg) =>
    rg.rows.forEach(
      (r) =>
        (r.cells = r.cells.map((c) => {
          const newCell: AitCellData<string> = { ...UpdateCellTextVersion(c) };
          return newCell;
        })),
    ),
  );

  return outData;
};
