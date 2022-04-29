import { AioReplacement, AioReplacementValues, AitRowData, AitRowGroupData, AitTableData } from "components";
import { v4 as uuidv4 } from "uuid";

interface OldTableData {
  headerData?: OldRowGroupData,
  bodyData?: OldRowGroupData[],
  comments?: string,
  rowHeaderColumns?: number,
  noRepeatProcessing?: boolean,
};

interface OldRowGroupData {
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

export const tableDataUpdate = (inData: OldTableData): AitTableData => {
  return {
    ...inData,
    headerData: {
      ...inData.headerData,
      replacements: textToReplacement(inData.headerData?.replacements)
    } as AitRowGroupData,
    bodyData: inData.bodyData?.map(rg => {
      return {
        ...rg,
        replacements: textToReplacement(rg.replacements)
      } as AitRowGroupData;
    })
  };
};

function textToReplacement(reps?: AioReplacement[] | oldReplacement[]): AioReplacement[] {
  // Check processing required
  if (reps === undefined || reps.length === 0) return [];
  if ((reps[0] as AioReplacement).oldText !== undefined) return reps as AioReplacement[];
  // Create the new object
  let oldReps = reps as oldReplacement[];
  let newReps: AioReplacement[] = [];
  for (let i = 0; i < oldReps.length; i++) {
    let oldRep = oldReps[i];
    if (!oldRep.replacementValues.some(rv => (rv.subList?.length ?? 0) > 0)) {
      let newRV: AioReplacementValues = {
        airid: uuidv4(),
        texts: oldRep.replacementValues.map(rv => rv.newText),
        spaceAfter: oldRep.replacementTexts[0]?.spaceAfter ?? false,
        subLists: [],
      };
      let newRep: AioReplacement = {
        airid: uuidv4(),
        oldText: oldRep.replacementTexts[0].text ?? "",
        newTexts: [newRV],
        includeTrailing: true,
        externalName: oldRep.externalName
      }
      newReps.push(newRep);
    }
    else {
      let newRep: AioReplacement = {
        airid: uuidv4(),
        oldText: oldRep.replacementTexts[0].text,
        newTexts: [],
        includeTrailing: true,
        externalName: oldRep.externalName
      }
      for (let j = 0; j < oldRep.replacementValues.length; j++) {
        let nextLevel:oldReplacement = {
          replacementTexts: oldRep.replacementTexts.slice(1),
          replacementValues: oldRep.replacementValues[j].subList ?? [],
        };
        let newRV: AioReplacementValues = {
          airid: uuidv4(),
          texts: [oldRep.replacementValues[j].newText],
          spaceAfter: oldRep.replacementTexts[0].spaceAfter,
          subLists: nextLevel.replacementTexts.length > 0 ? textToReplacement([nextLevel]) : undefined,
        };
        newRep.newTexts.push(newRV);
      }
      newReps.push(newRep);
    }
  }
  return newReps;
}
