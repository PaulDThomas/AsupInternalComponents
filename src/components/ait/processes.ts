import { AioOptionGroup } from "../aio/aioInterface";

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
  // console.log(`Checking ${path}`);
  if (a === b) return [true, ""];
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return [a === b, (a === b) ? "" : `${path}:notMismatch:${a}:${b}`];
  if (a === null || a === undefined || b === null || b === undefined) return [false, `${path}:nullMismatch:${a}:${b}`];
  if (a.prototype !== b.prototype) return [false, `${path}:prototypeMismatch:${a}!==${b}`];
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return [false, `${path}:lengthMismatch:${keys.length}:${Object.keys(b).length}`];
  let checkObject = keys
    .map(k => objEqual(a[k], b[k], k))
    .reduce(([overall, str], [b, s]) => {
      let tf = (overall === true && b === true);
      let badPath = (s !== "") ? `${str}${str !== "" ? "\n" : ""}${s}` : "";
      return [tf, badPath];
    }
      , [true, ""]
    );
  return checkObject;
}