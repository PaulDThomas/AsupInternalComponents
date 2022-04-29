// import { AioReplacement } from "../aio";

// /** Update base list with external lists */
// export const updateExternals = (base: AioReplacement, exts?: AioReplacement[]): AioReplacement => {
//   let newR: AioReplacement = {
//     ...base,
//     newTexts: base.externalName !== undefined && exts?.some(e => e.givenName === base.externalName)
//       ? exts.find(e => base.externalName === e.givenName)?.newTexts!
//       : base.newTexts
//     ,
//     subLists: base.subLists?.map(s => updateExternals(s, exts))
//   };
//   // Push in external sublists if they exist
//   if (base.externalName !== undefined 
//     && (exts?.find(e => e.givenName === base.externalName)?.subLists?.length ?? 0 )> 0
//     ) {
//     // Create subList if undefined
//     if (newR.spaceAfter === undefined) 
//       newR.subLists = [];
//     // Push sublists in
//     newR.subLists!.push(...exts!.find(e => e.givenName === base.externalName)!.subLists!)
//   }
//   return newR;
// };

export { }