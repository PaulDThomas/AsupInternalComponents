import { AitColumnRepeat, AitRowGroupData } from "../ait";
import { AitHeaderGroupData } from "../ait/aitInterface";

export const unProcessRowGroup = <T extends AitRowGroupData | AitHeaderGroupData>(
  processedGroup: T,
  columnRepeats: AitColumnRepeat[] | null,
): T => {
  const ret = {
    ...processedGroup,
    rows: processedGroup.rows
      .filter((r) => r.rowRepeat === undefined || r.rowRepeat.match(/^[[\]0,]+$/) !== null)
      .map((r) => {
        return {
          ...r,
          cells: r.cells.filter(
            (_, ci) =>
              columnRepeats === null ||
              (columnRepeats !== null &&
                columnRepeats[ci] !== undefined &&
                (columnRepeats[ci].colRepeat ?? "0").match(/^[[\]0,]+$/)),
          ),
        };
      }),
  };
  return ret;
};
