import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup, AioRepeats, AioReplacementValue } from "../aio/aioInterface";
import { AitCellData } from "./aitInterface";

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
export const firstUnequal = (a: number[], b: number[]): number => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return i;
  }
  if (b.length > a.length) return a.length;
  else return 0;
}

export const newCell = (): AitCellData => { return { aitid: uuidv4(), text: "", options: [] }; }
