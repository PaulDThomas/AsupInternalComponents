import structuredClone from "@ungap/structured-clone";
import { v4 as uuidv4 } from "uuid";
import { AioRepeats, AioReplacement, AioReplacementText, AioReplacementValue } from "../aio/aioInterface";
import { AitCellData, AitCellType, AitColumnRepeat, AitCoord, AitRowData } from "./aitInterface";

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
const findTargets = (rows: AitRowData[], replacementTexts?: AioReplacementText[]): AitCoord[] => {
  let targetArray: AitCoord[] = [];
  if (!replacementTexts || replacementTexts.length === 0) return targetArray;

  textSearch: for (let i = 0; i < replacementTexts.length; i++) {
    rowSearch: for (let ri = 0; ri < rows.length; ri++) {
      for (let ci = 0; ci < rows[ri].cells.length; ci++) {
        if (rows[ri].cells[ci].text.includes(replacementTexts[i].text)) {
          targetArray.push({ row: ri, column: ci });
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
 * @param replacements
 * @param rowHeaderColumns 
 * @returns 
 */
export const repeatRows = (
  rows: AitRowData[],
  replacements?: AioReplacement[],
  noProcessing?: boolean,
  rowHeaderColumns?: number,
): { rows: AitRowData[], repeats: AioRepeats } => {

  // Strip repeat data if flagged 
  if (noProcessing
    || rows.length === 0
    || !replacements
    || replacements.length === 0
    || !replacements[0].replacementTexts
    || replacements[0].replacementTexts.length === 0
    || !replacements[0].replacementValues
    || replacements[0].replacementValues.length === 0
  ) return { rows: rows.map(r => removeRowRepeatInfo(r)), repeats: { numbers: [[]], values: [[]], last: [[]] } };

  // Process parts of replacements into single objects
  let replacementTexts: AioReplacementText[] = replacements.map(rep => rep.replacementTexts).flat();
  let repeats = getRepeats(replacements);

  // Stop processing if there is nothing to repeat 
  if (!repeats?.numbers || repeats.numbers.length === 0) return { rows: rows.map(r => removeRowRepeatInfo(r)), repeats: repeats ?? { numbers: [[]], values: [[]], last: [[]] } };

  // Get row numbers that contain the repeat texts 
  let targetArray = findTargets(rows, replacementTexts);

  // Rows to the returned by this function 
  let { newRows, newRepeatValues, newRepeatNumbers, newLast } = createRepeats(repeats, rows, targetArray);

  // Update text based on repeats */
  replaceText(newRows, replacementTexts, newRepeatValues);

  // Process newRows add rowSpan in rowHeaders */
  updateRowSpans(newRows, rowHeaderColumns ?? 0);

  return { rows: newRows, repeats: { numbers: newRepeatNumbers, values: newRepeatValues, last: newLast } };
}

export const repeatHeaders = (
  rows: AitRowData[],
  replacements?: AioReplacement[],
  noProcessing?: boolean,
  rowHeaderColumns?: number,
): { rows: AitRowData[], columnRepeats: AitColumnRepeat[] } => {

  // Strip repeat data if flagged 
  if (noProcessing
    || rows.length === 0
    || !replacements
    || replacements.length === 0
    || !replacements[0].replacementTexts
    || replacements[0].replacementTexts.length === 0
    || !replacements[0].replacementValues
    || replacements[0].replacementValues.length === 0
  ) return {
    rows: rows.map(r => removeRowRepeatInfo(r)),
    columnRepeats: Array.from(rows[rows.length - 1].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat })
  };

  // Process parts of replacements into single objects
  let replacementTexts: AioReplacementText[] = replacements.map(rep => rep.replacementTexts).flat();
  let repeats = getRepeats(replacements);

  // Stop processing if there is nothing to repeat 
  if (!repeats?.numbers
    || repeats.numbers.length === 0
  )
    return {
      rows: rows.map(r => removeRowRepeatInfo(r)),
      columnRepeats: Array.from(rows[rows.length - 1].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat })
    };

  // Get row numbers that contain the repeat texts 
  let targetArray = findTargets(rows, replacementTexts);

  // Stop if first level is inside the rowHeaderColumns
  if (targetArray.length === 0
    || targetArray[0].column < (rowHeaderColumns ?? 0)
  )
    return {
      rows: rows.map(r => removeRowRepeatInfo(r)),
      columnRepeats: Array.from(rows[rows.length - 1].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat })
    };

  // Work out which columns are repeating
  let columnsToRepeat = rows[targetArray[0].row].cells[targetArray[0].column].colSpan ?? 1;

  // Get column headers as a row object to process
  let targetBlock = transposeCells(
    rows.map(r => {
      let rowSlice: AitRowData = {
        aitid: r.aitid,
        cells: r.cells.slice(targetArray[0].column, targetArray[0].column + columnsToRepeat),
      }
      return rowSlice;
    })
  );

  // Rows to the returned by this function 
  let { newRows, newRepeatValues, newRepeatNumbers, originalRow } = createRepeats(repeats, targetBlock, targetArray);

  // Update text based on repeats
  replaceText(newRows, replacementTexts, newRepeatValues);

  // Process newRows add rowSpan in rowHeaders
  updateRowSpans(newRows, columnsToRepeat);

  // Change back to column headers
  let newBlock = transposeCells(newRows, (c) => {
    let newRS = c.colSpan;
    let newCS = c.rowSpan;
    return {
      aitid: uuidv4(),
      text: c.text,
      replacedText: c.replacedText,
      colSpan: newCS,
      rowSpan: newRS,
      colWidth: c.colWidth,
      textIndents: c.textIndents,
    } as AitCellData;
  });
  console.log(`newBlock:\n ${newBlock.map(r => r.cells.map(c => c.text).join(',')).join("\n")}`);
  let newHeaderInfo: [AitRowData, AitColumnRepeat[]][] = rows.map((r, ri) => {
    let newRow: AitRowData = { aitid: r.aitid, cells: [] };
    let columnRepeat: AitColumnRepeat[] = []
    // Add cells before
    if (targetArray[0].column > 0) {
      newRow.cells.push(...r.cells.slice(0, targetArray[0].column));
      columnRepeat.push(...Array.from(r.cells.slice(0, targetArray[0].column).keys()).map(n => {
        return { columnIndex: n } as AitColumnRepeat
      }));
    }
    // Add new block
    newRow.cells.push(...newBlock[ri].cells);
    columnRepeat.push(...Array.from(originalRow).map((n, i) => {
      return { columnIndex: n + targetArray[0].column, repeatNumbers: newRepeatNumbers[i] } as AitColumnRepeat
    }));
    // Add cells after
    if (targetArray[0].column + columnsToRepeat < r.cells.length) {
      newRow.cells.push(...r.cells.slice(targetArray[0].column + columnsToRepeat))
      columnRepeat.push(...Array.from(r.cells.slice(targetArray[0].column + columnsToRepeat).keys()).map(n => {
        return { columnIndex: n + targetArray[0].column + columnsToRepeat } as AitColumnRepeat
      }));
    }
    return [newRow, columnRepeat];
  });

  return {
    rows: newHeaderInfo.map(i => i[0]),
    columnRepeats: newHeaderInfo.map(i => i[1]).flat(),
  };
};

const removeRowRepeatInfo = (row: AitRowData): AitRowData => {
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

const getRepeats = (r: AioReplacement[]): AioRepeats => {
  let newRepeats: AioRepeats = { numbers: [], values: [], last: [] }
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

const createRepeats = (
  repeats: AioRepeats,
  rows: AitRowData[],
  targetArray: AitCoord[]
): {
  newRows: AitRowData[],
  newRepeatValues: string[][],
  newRepeatNumbers: number[][],
  newLast: boolean[][],
  originalRow: number[],
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
    if (slice.length === 0) return false;
    /** Push current repeats into the output */
    newRows.push(...structuredClone(slice));
    newRepeatNumbers.push(...Array(slice.length).fill(repNo));
    newLast.push(...Array(slice.length - 1).fill(Array(repLast.length).fill(false)), repLast);
    newRepeatValues.push(...Array(slice.length).fill(repVal));
    originalRow.push(repi = 0 ? 0 : targetArray[firstLevel].row);
    return true;
  });
  return { newRows, newRepeatValues, newRepeatNumbers, newLast, originalRow };
}

const replaceText = (
  rows: AitRowData[],
  replacementTexts: AioReplacementText[],
  newRepeatValues: string[][]
) => {
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].cells.length; c++) {
      let cell = rows[r].cells[c];
      let replacedText = cell.text;
      for (let rt = 0; rt < (replacementTexts?.length ?? 0); rt++) {
        // Replace if there in old and new text
        let o = replacementTexts![rt].text;
        let n = newRepeatValues[r][rt];
        if (n)
          replacedText = replacedText.replace(o, n);
      }
      if (replacedText !== cell.text)
        cell.replacedText = replacedText;
      else
        delete (cell.replacedText);
    }
  }
}

const updateRowSpans = (
  rows: AitRowData[],
  rowHeaderColumns: number
) => {
  for (let r = 0; r < rows.length; r++) {
    let col = 0;
    while (col < (rowHeaderColumns ?? 0)) {
      // Get cell to check 
      let currentCell = rows[r].cells[col];
      // Ensure it has not already been udpated 
      if (currentCell?.rowSpan === 0) {
        col++;
        continue;
      }
      // Start checking 
      let rowSpan = 1;
      // Look for duplicate text in the next row 
      while (
        currentCell?.replacedText !== undefined
        && rows[r + rowSpan]?.cells[col]?.replacedText === currentCell.replacedText
      ) rowSpan++;
      // Update rowSpans if duplicates have been found 
      if (rowSpan > 1) {
        currentCell.rowSpan = rowSpan;
        for (let _r = 1; _r < rowSpan; _r++) {
          rows[r + _r].cells[col].rowSpan = 0;
        }
      }
      else {
        currentCell.rowSpan = 1;
      }
      col++;
    }
    while (col < rows[r].cells.length) {
      rows[r].cells[col].rowSpan = 1;
      col++;
    }
  }
}

const transposeCells = (t: AitRowData[], flipFn?: (target: AitCellData) => AitCellData): AitRowData[] => {
  let newRows: AitRowData[] = [];
  for (let r = 0; r < t.length; r++) {
    for (let c = 0; c < t[r].cells.length; c++) {
      let target = t[r].cells[c];
      if (target === undefined) {
        console.warn("Undefined target in transpose");
        continue;
      }
      if (typeof flipFn === "function") {
        target = flipFn(target);
      }
      if (r === 0) {
        newRows.push({ aitid: `[${c}]`, cells: [target] });
      }
      else {
        newRows[c].cells.push(target);
      }
    }
  }
  return newRows;
}