import structuredClone from "@ungap/structured-clone";
import { AioRepeats } from "../aio/aioInterface";
import { AitCoord, AitRowData } from "../ait/aitInterface";
import { firstUnequal } from "./firstUnequal";

export const createRepeats = (
  repeats: AioRepeats,
  rows: AitRowData[],
  targetArray: AitCoord[]
): {
  newRows: AitRowData[];
  newRepeatValues: string[][];
  newRepeatNumbers: number[][];
  newLast: boolean[][];
  originalRow: number[];
} => {
  let newRows: AitRowData[] = [];
  /** Row repeat number signature to be returned by this function */
  let newRepeatNumbers: number[][] = [];
  /** Last value indicator be returned by this function, used for spaceAfter indicators */
  let newLast: boolean[][] = [];
  /** Row repeat values to be returned by this function */
  let newRepeatValues: string[][] = [];
  /** Original row numbers used */
  let originalRow: number[] = [];
  /** Loop through each of the repeat levels */
  repeats.numbers.map((repNo, repi) => {
    /** Current last repeat value indicator */
    let repLast: boolean[] = repeats.last[repi];
    /** Current repeat values */
    let repVal: string[] = repeats.values !== undefined ? repeats.values[repi] : [];
    /** First row number that needs to be repeated for this level */
    let firstLevel: number = repi > 0 ? firstUnequal(repNo, repeats.numbers[repi - 1]) : 0;
    /** Rows that need to be repeated for this level */
    let slice = repi === 0 ? rows : rows.slice(targetArray[firstLevel].row);
    if (slice.length === 0)
      return false;
    /** Push current repeats into the output */
    newRows.push(...structuredClone(slice));
    newRepeatNumbers.push(...Array(slice.length).fill(repNo));
    newLast.push(...Array(slice.length - 1).fill(Array(repLast.length).fill(false)), repLast);
    newRepeatValues.push(...Array(slice.length).fill(repVal));
    originalRow.push(...Array.from(slice.keys()).map(ri => ri + targetArray[firstLevel].row));
    return true;
  });
  return { newRows, newRepeatValues, newRepeatNumbers, newLast, originalRow };
};
