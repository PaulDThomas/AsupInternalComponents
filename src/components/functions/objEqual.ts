export const objEqual = (a: any, b: any, path?: string): [boolean, string] => {
  if (a === b)
    return [true, ""];
  if (typeof a !== "object" && typeof b !== "object" && a !== b)
    return [false, `${path}:notEqual:${a}<>${b}`];
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return [a === b, (a === b) ? "" : `${path}:notMismatch:${a}<>${b}`];
  if (a === null || a === undefined || b === null || b === undefined)
    return [false, `${path}:nullMismatch:${a}<>${b}`];
  if (a.prototype !== b.prototype)
    return [false, `${path}:prototypeMismatch:${a}<>${b}`];
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length)
    return [false, `${path}:lengthMismatch:${keys.length}<>${Object.keys(b).length}`];
  let checkObject = keys
    .map(k => objEqual(a[k], b[k], `${path}.${k}`));
  let checkObjectR = checkObject
    .reduce(([overall, str], [b, s]) => {
      let tf = (overall === true && b === true);
      let badPath = (s !== "") ? `${str}${str !== "" ? "\n" : ""}${s}` : str;
      return [tf, badPath];
    },
      [true, ""]
    );
  return checkObjectR;
};
