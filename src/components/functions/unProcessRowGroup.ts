import { AitColumnRepeat } from "components/table";
import { AitHeaderGroupData } from "components/table/interface";
import { AitRowGroupData } from "main";

export const unProcessRowGroup = <
  T extends string | object,
  R extends AitRowGroupData<T> | AitHeaderGroupData<T>,
>(
  processedGroup: R,
  columnRepeats: AitColumnRepeat[] | null,
): R => {
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
