export {}

// import { AioRepeats, AioReplacementValue } from "../aio/aioInterface";

// export const getReplacementValues = (rvs: AioReplacementValue[]): AioRepeats => {
//   if (!rvs || rvs.length === 0)
//     return { numbers: [], values: [], last: [] };
//   let thisNumbers: number[][] = [];
//   let thisValues: string[][] = [];
//   let thisLast: boolean[][] = [];
//   for (let i = 0; i < rvs.length; i++) {
//     if (!rvs[i].subList || rvs[i].subList?.length === 0) {
//       thisNumbers.push([i]);
//       thisLast.push([true]);
//       thisValues.push([rvs[i].newText]);
//     }
//     else {
//       let subListRVs = getReplacementValues(rvs[i].subList!);
//       thisNumbers.push(
//         ...subListRVs.numbers.map(s => [i, ...s])
//       );
//       thisLast.push(
//         ...subListRVs.last.map((s, si) => [si === subListRVs.last.length - 1, ...s])
//       );
//       thisValues.push(
//         ...subListRVs.values.map(s => [rvs[i].newText, ...s])
//       );
//     }
//   }
//   return { numbers: thisNumbers, values: thisValues, last: thisLast };
// };
