import { AioReplacement } from '../aio';
import { AitRowData, AitRowGroupData, AitTableData } from '../ait';
import { oldReplacement, updateReplacementVersion } from './updateReplacementVersion';

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
  rows: AitRowData[];
  comments?: string;
  spaceAfter?: boolean;
  replacements?: AioReplacement[] | oldReplacement[];
}

export const updateTableDataVersion = (
  inData: OldTableData | AitTableData,
  defaultCellWidth: number,
): AitTableData => {
  const headerData =
    inData.headerData === false
      ? false
      : inData.headerData !== undefined
      ? ({
          ...inData.headerData,
          replacements:
            inData.headerData?.replacements !== undefined
              ? updateReplacementVersion(inData.headerData?.replacements)
              : undefined,
        } as AitRowGroupData)
      : undefined;
  const outData: AitTableData = {
    ...inData,
    headerData: headerData,
    bodyData: inData.bodyData?.map((rg) => {
      const org = {
        ...rg,
        replacements:
          rg.replacements !== undefined ? updateReplacementVersion(rg.replacements) : undefined,
      } as AitRowGroupData;
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
        // Get max, or zero if totall undefined
        .reduce(
          (prev, cur) => cur.map((w, i) => ((w ?? 0) > (prev[i] ?? 0) ? w ?? 0 : prev[i] ?? 0)),
          [],
        )
        // Replace zeros with default
        .map((w) => (w === 0 ? defaultCellWidth : w));
    if (outData.headerData)
      outData.headerData?.rows.forEach((r) =>
        r.cells.forEach((c, ci) => (c.colWidth = colWidths[ci])),
      );
    outData.bodyData?.forEach((rg) =>
      rg.rows.forEach((r) => r.cells.forEach((c, ci) => (c.colWidth = colWidths[ci]))),
    );
  }

  return outData;
};
