import structuredClone from "@ungap/structured-clone";
import { v4 as uuidv4 } from "uuid";
import { AioRepeats, AioReplacement, AioReplacementText, AioReplacementValue } from "../aio/aioInterface";
import { AitCellData, AitCellType, AitRowData } from "./aitInterface";

export const objEqual = (a: any, b: any, path?: string): [boolean, string] => {
  if (a === b) return [true, ""];
  if (typeof a !== "object" && typeof b !== "object" && a !== b) return [false, `${path}:notEqual:${a}<>${b}`];
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return [a === b, (a === b) ? "" : `${path}:notMismatch:${a}<>${b}`];
  if (a === null || a === undefined || b === null || b === undefined) return [false, `${path}:nullMismatch:${a}<>${b}`];
  if (a.prototype !== b.prototype) return [false, `${path}:prototypeMismatch:${a}<>${b}`];
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return [false, `${path}:lengthMismatch:${keys.length}<>${Object.keys(b).length}`];
  let checkObject = keys
    .map(k => objEqual(a[k], b[k], `${path}.${k}`));
  let checkObjectR = checkObject
    .reduce(([overall, str], [b, s]) => {
      let tf = (overall === true && b === true);
      let badPath = (s !== "") ? `${str}${str !== "" ? "\n" : ""}${s}` : str;
      return [tf, badPath];
    }
      , [true, ""]
    );
  return checkObjectR;
}

const getReplacementValues = (rvs: AioReplacementValue[]): AioRepeats => {
  if (!rvs || rvs.length === 0) return { numbers: [], values: [], last: [] };
  let thisNumbers: number[][] = [];
  let thisValues: string[][] = [];
  let thisLast: boolean[][] = [];
  for (let i = 0; i < rvs.length; i++) {
    if (!rvs[i].subList || rvs[i].subList?.length === 0) {
      thisNumbers.push([i]);
      thisLast.push([true]);
      thisValues.push([rvs[i].newText]);
    }
    else {
      let subListRVs = getReplacementValues(rvs[i].subList!);
      thisNumbers.push(
        ...subListRVs.numbers.map(s => [i, ...s])
      );
      thisLast.push(
        ...subListRVs.last.map((s, si) => [si === subListRVs.last.length - 1, ...s])
      );
      thisValues.push(
        ...subListRVs.values.map(s => [rvs[i].newText, ...s])
      );
    }
  }
  return { numbers: thisNumbers, values: thisValues, last: thisLast };
}

/** Find first unequal obs in two number arrays */
const firstUnequal = (a: number[], b: number[]): number => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return i;
  }
  if (b.length > a.length) return a.length;
  else return 0;
}

export const newCell = (type?: AitCellType): AitCellData => {
  let cell: AitCellData = { aitid: uuidv4(), text: "", rowSpan: 1, colSpan: 1 };
  if (type === AitCellType.header) cell.colWidth = 60;
  return cell;
}

/** Find which row replacementText first appears in */
const findTargets = (rows: AitRowData[], replacementText?: AioReplacementText[]): number[] => {
  let targetArray: number[] = [];
  if (!replacementText || replacementText.length === 0) return targetArray;

  textSearch: for (let i = 0; i < replacementText.length; i++) {
    rowSearch: for (let ri = 0; ri < rows.length; ri++) {
      for (let ci = 0; ci < rows[ri].cells.length; ci++) {
        if (rows[ri].cells[ci].text.includes(replacementText[i].text)) {
          targetArray.push(ri);
          break rowSearch;
        }
      }
      if (targetArray.length < i) break textSearch;
    }
  }
  return targetArray;
}

/**
 * Repeat rows based on repeat number array with potential for partial repeats 
 * @param rows 
 * @param noProcessing 
 * @param replacementTexts 
 * @param repeats 
 * @returns 
 */
export const repeatRows = (
  rows: AitRowData[],
  noProcessing?: boolean,
  replacementTexts?: AioReplacementText[],
  repeats?: AioRepeats,
  rowHeaderColumns?: number,
): { rows: AitRowData[], repeats: AioRepeats } => {

  /** Strip repeat data if flagged */
  if (noProcessing || rows.length === 0) return { rows: rows.map(r => removeRowRepeatInfo(r)), repeats: { numbers: [[]], values: [[]], last: [[]] } };

  /** Stop processing if there is nothing to repeat */
  if (!repeats?.numbers || repeats.numbers.length === 0) return { rows: rows.map(r => removeRowRepeatInfo(r)), repeats: repeats ?? { numbers: [[]], values: [[]], last: [[]] } };

  /** Get ros numbers that contain the repeat texts */
  let targetArray = findTargets(rows, replacementTexts);

  /** Rows to the returned by this function */
  let newRows: AitRowData[] = [];
  /** Row repeat number signature to be returned by this function */
  let newRepeatNumbers: number[][] = [];
  /** Last value indicator be returned by this function */
  let newLast: boolean[][] = [];
  /** Row repeat values to be returned by this function */
  let newRepeatValues: string[][] = [];
  /** Value of the previous repeat signature, used to check which rows need to be repeated */
  let lastRepeat: number[] = [];
  /** Loop through each of the repeat levels */
  for (let repi = 0; repi < repeats.numbers.length; repi++) {
    /** Current repeat signature */
    let repNo: number[] = repeats.numbers[repi];
    /** Current last repeat value indicator */
    let repLast: boolean[] = repeats.last[repi];
    /** Current repeat values */
    let repVal: string[] = repeats.values !== undefined ? repeats.values[repi] : [];
    /** First row number that needs to be repeated for this level */
    let firstLevel: number = firstUnequal(repNo, lastRepeat);
    /** Rows that need to be repeated for this level */
    let slice = repi === 0 ? rows : rows.slice(targetArray[firstLevel]);
    /** Push current repeats into the output */
    newRows.push(...(repi === 0 ? slice : structuredClone(slice)));
    newRepeatNumbers.push(...Array(slice.length).fill(repNo));
    newLast.push(...Array(slice.length - 1).fill(Array(repLast.length).fill(false)), repLast);
    newRepeatValues.push(...Array(slice.length).fill(repVal));
    /** Update for the next loop */
    lastRepeat = [...repNo];
  }

  /** Update text based on repeats */
  for (let r = 0; r < newRows.length; r++) {
    for (let c = 0; c < newRows[r].cells.length; c++) {
      let cell = newRows[r].cells[c];
      let replacedText = cell.text;
      for (let rt = 0; rt < (replacementTexts?.length ?? 0); rt++) {
        // Replace if there in old and new text
        let o = replacementTexts![rt].text;
        let n = newRepeatValues[r][rt];
        if (n) replacedText = replacedText.replace(o, n);
      }
      if (replacedText !== cell.text) cell.replacedText = replacedText;
      else delete (cell.replacedText);
    }
  }

  // /** Process newRows add rowSpan in rowHeaders */
  for (let r = 0; r < newRows.length; r++) {
    let col = 0;
    while (col < (rowHeaderColumns ?? 0)) {
      /** Get cell to check */
      let currentCell = newRows[r].cells[col];
      /** Ensure it has not already been udpated */
      if (currentCell?.rowSpan === 0) {
        col++;
        continue;
      }
      /** Start checking */
      let rowSpan = 1;
      /** Look for duplicate text in the next row */
      while (
        currentCell?.replacedText !== undefined
        && newRows[r + rowSpan]?.cells[col]?.replacedText === currentCell.replacedText
      ) rowSpan++;
      /** Update rowSpans if duplicates have been found */
      if (rowSpan > 1) {
        currentCell.rowSpan = rowSpan;
        for (let _r = 1; _r < rowSpan; _r++) {
          newRows[r + _r].cells[col].rowSpan = 0;
        }
      }
      else {
        currentCell.rowSpan = 1;
      }
      col++;
    }
    while (col < newRows[r].cells.length) {
      newRows[r].cells[col].rowSpan = 1;
      col++;
    }
  }
  return { rows: newRows, repeats: { numbers: newRepeatNumbers, values: newRepeatValues, last: newLast } };
}

export const removeRowRepeatInfo = (row: AitRowData): AitRowData => {
  let newRow: AitRowData = {
    aitid: row.aitid,
    cells: row.cells.map(c => {
      if (c.replacedText !== undefined) delete (c.replacedText);
      c.rowSpan = 1;
      return c;
    }),
  };
  return newRow;
}

export const getRepeats = (r: AioReplacement[], newRepeats: AioRepeats) => {
  if (!r || r.length === 0) return newRepeats;
  for (let i = 0; i < r.length; i++) {
    if (i === 0)
      newRepeats = getReplacementValues(r[i].replacementValues);
    else {
      let thisRepeat = getReplacementValues(r[i].replacementValues);
      let newRepeatNumbers: number[][] = [];
      let newLast: boolean[][] = [];
      let newRepeatValues: string[][] = [];
      for (let j = 0; j < newRepeats.numbers.length; j++) {
        for (let k = 0; k < thisRepeat.numbers.length; k++) {
          newRepeatNumbers.push([...newRepeats.numbers[j], ...thisRepeat.numbers[k]]);
          newLast.push([...newRepeats.last[j].map(l => l && k === thisRepeat.numbers.length - 1), ...thisRepeat.last[k]]);
          newRepeatValues.push([...newRepeats.values[j], ...thisRepeat.values[k]]);
        }
      }
      newRepeats = {
        numbers: newRepeatNumbers,
        values: newRepeatValues,
        last: newLast,
      };
    }
  }
  return newRepeats;
}
