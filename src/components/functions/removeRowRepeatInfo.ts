import { AitCellData, AitRowData } from "../ait/aitInterface";

export const removeRowRepeatInfo = (rows: AitRowData[]): AitRowData[] => {
  return rows.map(r => {
    let ret: AitRowData = {
      aitid: r.aitid,
      cells: r.cells
      // .filter(c => !c.replacedText?.includes("__filler"))
      .map(c => {
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
        } as AitCellData;
      }),
      // spaceAfter: false,
      // rowRepeat: undefined,
    };
    return ret;
  });
};
