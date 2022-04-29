import { AioReplacement, AitRowData } from "components";

interface AitTableData {
  headerData?: AitRowGroupData,
  bodyData?: AitRowGroupData[],
  comments?: string,
  rowHeaderColumns?: number,
  noRepeatProcessing?: boolean,
};

interface AitRowGroupData {
  aitid?: string,
  name?: string,
  rows: AitRowData[],
  comments?: string,
  spaceAfter?: boolean,
  replacements?: AioReplacement[] | oldReplacement[],
};

interface oldReplacementText {
  text: string,
  spaceAfter: boolean,
}

interface oldReplacementValue {
  newText: string,
  subList?: oldReplacementValue[],
}

interface oldReplacement {
  airid?: string,
  replacementTexts: oldReplacementText[],
  replacementValues: oldReplacementValue[],
  givenName?: string,
  externalName?: string,
}

export const tableDataPreProcess = (inData: AitTableData) => {
  return { 
    ...inData,
    headerData: {
      ...inData.headerData,
      replacements: textToReplacement(inData.headerData?.replacements)
    },
    bodyData: inData.bodyData?.map(rg => {
      return {
        ...rg,
        replacements: textToReplacement(rg.replacements)
      }
    })
   };
};

function textToReplacement(reps?: AioReplacement[] | oldReplacement[]): AioReplacement[] | undefined {
  // Check processing required
  if (reps === undefined || reps.length === 0) return [];
  if ((reps[0] as AioReplacement).oldText !== undefined) return reps as AioReplacement[];
  // Create the new object
  let oldReps = reps as oldReplacement[];
  let newReps: AioReplacement[] = [];
  for (let i = 0; i < oldReps.length; i++) {
    let oldRep = oldReps[i];
    for (let j = 0; j < oldRep.replacementTexts.length; j++) {
      let rts = oldRep.replacementTexts[j];
      let rvs = oldRep.replacementValues[j];
    }
  }

  return newReps;
};

// | undefined {
//   if (reps === undefined ) return reps;
//   console.log(ReturnType<typeof reps>);
//   let newRep: AioReplacement = [];

//   return [...reps.map(rep => {
//     // Just return if in the new format
//     if (rep.oldText !== undefined) return rep;
//     // Update if in the old format
//     else {
//       return {
        
//       }
//     }
//   })];
// }