// import structuredClone from "@ungap/structured-clone";
// import { AioReplacement } from "../aio";

// export const appendReplacement = (incoming: AioReplacement, subLists?: AioReplacement[]): AioReplacement[] | undefined => {
//   let newSubLists:AioReplacement[] = [];
  
//   if (subLists === undefined) {
//     newSubLists.push(structuredClone(incoming));
//   }
//   else {
//     newSubLists = subLists.map(s => {
//       return {
//         ...s,
//         subLists: appendReplacement(incoming, s.subLists)
//       }
//     })
//   }

//   return newSubLists;
// }

export {}