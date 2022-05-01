import { AitCellData, AitRowData } from "../ait/aitInterface";

export const removeRowRepeatInfo = (rows: AitRowData[]): AitRowData[] => {
  return rows.map(r => {
    return {
      aitid: r.aitid,
      cells: r.cells.map(c => {
        return {
          ...c,
          aitid: c.aitid,
          replacedText: undefined,
          repeatColSpan: undefined,
          repeatRowSpan: undefined,
        } as AitCellData;
      }),
      spaceAfter: false,
    } as AitRowData;
  });
};
