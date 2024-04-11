import { AitCellData, AitHeaderRowData, AitRowData } from "../table/interface";

export const removeRowRepeatInfo = <T extends string | object>(
  rows: AitRowData<T>[],
): AitRowData<T>[] => {
  return rows.map((r) => {
    const ret: AitRowData<T> = {
      aitid: r.aitid,
      cells: r.cells
        // .filter(c => !c.replacedText?.includes("__filler"))
        .map((c) => {
          return {
            aitid: c.aitid,
            text: c.text,
            justifyText: c.justifyText,
            comments: c.comments,
            // colSpan: c.colSpan,
            // rowSpan: c.rowSpan,
            colWidth: c.colWidth,
            textIndents: c.textIndents,
            // replacedText: undefined,
            // repeatColSpan: undefined,
            // repeatRowSpan: undefined,
          } as AitCellData<T>;
        }),
      // spaceAfter: false,
      // rowRepeat: undefined,
    };
    return ret;
  });
};

export const removeHeaderRowRepeatInfo = <T extends string | object>(
  rows: AitHeaderRowData<T>[],
): AitHeaderRowData<T>[] => {
  return rows.map((r) => {
    const ret: AitRowData<T> = {
      aitid: r.aitid,
      cells: r.cells
        // .filter(c => !c.replacedText?.includes("__filler"))
        .map((c) => {
          return {
            aitid: c.aitid,
            text: c.text,
            justifyText: c.justifyText,
            comments: c.comments,
            colSpan: c.colSpan,
            rowSpan: c.rowSpan,
            colWidth: c.colWidth,
            textIndents: c.textIndents,
            // replacedText: undefined,
            // repeatColSpan: undefined,
            // repeatRowSpan: undefined,
          } as AitCellData<T>;
        }),
      // spaceAfter: false,
      // rowRepeat: undefined,
    };
    return ret;
  });
};
