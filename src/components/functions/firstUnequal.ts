import { AitCellType, AitCellData } from "components/ait/aitInterface";
import { v4 as uuidv4 } from "uuid";

/** Find first unequal obs in two number arrays */
export const firstUnequal = (a: number[], b: number[]): number => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return i;
  }
  if (b.length > a.length)
    return a.length;
  else
    return 0;
};

export const newCell = (type?: AitCellType): AitCellData => {
  let cell: AitCellData = { aitid: uuidv4(), text: "", rowSpan: 1, colSpan: 1 };
  if (type === AitCellType.header)
    cell.colWidth = 60;
  return cell;
};
