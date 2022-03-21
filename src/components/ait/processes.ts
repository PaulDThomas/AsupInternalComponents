import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup, AioRepeats, AioReplacementText, AioReplacementValue } from "../aio/aioInterface";
import { AitCellData, AitRowData } from "./aitInterface";

/**
 * Update options with another set of options
 * @param incomingOptions 
 * @param previousOptions 
 * @returns Updated option group
 */
export const processOptions = (incomingOptions: AioOptionGroup, previousOptions: AioOptionGroup) => {
  // Return updated options if there is nothing to process against  
  if (previousOptions === undefined) {
    return incomingOptions ?? [];
  }

  // Create new options to update
  var newOptions = previousOptions.map(a => { return { ...a } });

  // Get each value, or add blank
  for (let uo of incomingOptions ?? []) {
    let i = newOptions.findIndex(no => no.optionName === uo.optionName);
    if (i >= 0) {
      newOptions[i].type = uo.type;
      newOptions[i].value = uo.value;
      newOptions[i].label = uo.label ?? newOptions[i].label;
      newOptions[i].availableValues = uo.availableValues ?? newOptions[i].availableValues;
      newOptions[i].readOnly = uo.readOnly ?? newOptions[i].readOnly;
    }
    else {
      newOptions.push({ ...uo });
    }
    uo.value = incomingOptions?.find((i) => { return i.optionName === uo.optionName; })?.value ?? uo.value;
  }
  return newOptions;
};

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

export const getReplacementValues = (rvs: AioReplacementValue[]): AioRepeats => {
  if (!rvs || rvs.length === 0) return { numbers: [], values: [], last:[]};
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
        ...subListRVs.last.map((s,si) => [si === subListRVs.last.length-1, ...s])
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

export const newCell = (): AitCellData => { return { aitid: uuidv4(), text: "", options: [] }; }

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
 * @param replacementText 
 * @param repeats 
 * @returns 
 */
export const repeatRows = (
  rows: AitRowData[],
  noProcessing?: boolean,
  replacementText?: AioReplacementText[],
  repeats?: AioRepeats
): { rows: AitRowData[], repeats: AioRepeats } => {

  /** Stop processing if flagged */
  if (noProcessing) return { rows: rows, repeats: { numbers: [[]], values: [[]], last: [[]] } };

  /** Stop processing if there is nothing to repeat */
  if (!repeats?.numbers || repeats.numbers.length === 0) return { rows: rows, repeats: repeats ?? { numbers: [[]], values: [[]], last: [[]] } };

  /** Get ros numbers that contain the repeat texts */
  let targetArray = findTargets(rows, replacementText);

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
    let slice = rows.slice(targetArray[firstLevel]);
    /** Push current repeats into the output */
    newRows.push(...slice);
    newRepeatNumbers.push(...Array(slice.length).fill(repNo));
    newLast.push(...Array(slice.length - 1).fill(Array(repLast.length).fill(false)), repLast);
    newRepeatValues.push(...Array(slice.length).fill(repVal));
    /** Update for the next loop */
    lastRepeat = [...repNo];
  }
  return { rows: newRows, repeats: { numbers: newRepeatNumbers, values: newRepeatValues, last: newLast } };
}