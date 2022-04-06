import { AioRepeats, AioReplacement } from "../aio/aioInterface";
import { getReplacementValues } from "./getReplacementValues";

/**
 * Change replacements into repeats for row processing
 * @param r Replacements array
 * @returns repeats
 */
export const getRepeats = (r: AioReplacement[], e?: AioReplacement[]): AioRepeats => {
  // Set up return object
  let newRepeats: AioRepeats = { numbers: [], values: [], last: [] };
  // Return if there is nothing to do
  if (!r || r.length === 0)
    return newRepeats;
  // Run through each repeat
  for (let i = 0; i < r.length; i++) {
    // Get repeats from this object
    let thisRepeat: AioRepeats =
      r[i].externalName === undefined
        ? getReplacementValues(r[i].replacementValues)
        // or the external list
        : getReplacementValues(e?.find(e => e.givenName === r[i].externalName)?.replacementValues ?? []);

    if (i === 0)
      newRepeats = { ...thisRepeat };
    else {
      let newRepeatNumbers: number[][] = [];
      let newLast: boolean[][] = [];
      let newRepeatValues: string[][] = [];
      for (let j = 0; j < newRepeats.numbers.length; j++) {
        if (thisRepeat.numbers.length === 0) {
          newRepeatNumbers.push([...newRepeats.numbers[j]]);
          newLast.push([...newRepeats.last[j]]);
          newRepeatValues.push([...newRepeats.values[j]]);
        }
        else for (let k = 0; k < thisRepeat.numbers.length; k++) {
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
};