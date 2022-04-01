import { AioRepeats, AioReplacement } from "../aio/aioInterface";
import { getReplacementValues } from "./getReplacementValues";

/**
 * Change replacements into repeats for row processing
 * @param r Replacements array
 * @returns repeats
 */
export const getRepeats = (r: AioReplacement[]): AioRepeats => {
  let newRepeats: AioRepeats = { numbers: [], values: [], last: [] };
  if (!r || r.length === 0)
    return newRepeats;
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
};