export {}

// import structuredClone from "@ungap/structured-clone";
// import { AioReplacement } from "../aio/aioInterface";

// /**
//  * Consolidate replacements array into a single replacement
//  * @param reps Input replacements array
//  * @param exts External replacements array
//  * @returns single replacement
//  */
// export const flattenReplacements = (reps: AioReplacement[], exts?: AioReplacement[]): AioReplacement => {
//   let newReplacement: AioReplacement = { replacementTexts: [], replacementValues: [] };

//   // Check append is ok
//   reps.map((rep, repi) => {
//     // Just apppend the texts
//     newReplacement.replacementTexts.push(...rep.replacementTexts);

//     if (repi === 0) {
//       newReplacement.replacementValues = rep.externalName === undefined
//         ? structuredClone(rep.replacementValues)
//         : structuredClone(exts?.find(e => e.givenName === rep.externalName)?.replacementValues ?? [])
//         ;
//     }
//     else {
//       newReplacement.replacementValues = newReplacement.replacementValues.map(
//         rv => appendReplacementValue(
//           rv,
//           rep.externalName === undefined
//             ? rep.replacementValues
//             : exts?.find(e => e.givenName === rep.externalName)?.replacementValues ?? []
//         )
//       );
//     }

//     return true;
//   });

//   return newReplacement;
// }