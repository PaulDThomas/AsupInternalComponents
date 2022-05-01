import { AioExternalReplacements, AioReplacement, AioReplacementValues } from "components";
import { v4 as uuidv4 } from "uuid";

interface oldReplacementText {
  text: string,
  spaceAfter: boolean,
}

interface oldReplacementValue {
  newText: string,
  subList?: oldReplacementValue[],
}

export interface oldReplacement {
  airid?: string,
  replacementTexts: oldReplacementText[],
  replacementValues: oldReplacementValue[],
  givenName?: string,
  externalName?: string,
}

export function updateReplacementVersion(reps?: AioReplacement[] | oldReplacement[]): AioReplacement[] {
  // Check processing required
  if (reps === undefined || reps.length === 0)
    return [];
  if ((reps[0] as AioReplacement).oldText !== undefined)
    return reps as AioReplacement[];
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
        includeTrailing: false,
        externalName: oldRep.externalName
      };
      newReps.push(newRep);
    }
    else {
      let newRep: AioReplacement = {
        airid: uuidv4(),
        oldText: oldRep.replacementTexts[0].text,
        newTexts: [],
        includeTrailing: false,
        externalName: oldRep.externalName
      };
      for (let j = 0; j < oldRep.replacementValues.length; j++) {
        let nextLevel: oldReplacement = {
          replacementTexts: oldRep.replacementTexts.slice(1),
          replacementValues: oldRep.replacementValues[j].subList ?? [],
        };
        let newRV: AioReplacementValues = {
          airid: uuidv4(),
          texts: [oldRep.replacementValues[j].newText],
          spaceAfter: oldRep.replacementTexts[0].spaceAfter,
          subLists: nextLevel.replacementTexts.length > 0 ? updateReplacementVersion([nextLevel]) : undefined,
        };
        newRep.newTexts.push(newRV);
      }
      newReps.push(newRep);
    }
  }
  return newReps;
}

export function updateReplToExtl(
  reps: AioExternalReplacements[] | oldReplacement[] | { name: string, list: oldReplacement[] }[]): AioExternalReplacements[] {
  // Check processing required
  if (reps === undefined || reps.length === 0)
    return [];
  if ((reps[0] as AioExternalReplacements).givenName !== undefined)
    return reps as AioExternalReplacements[];
  // Change from old to new
  let oldReps: oldReplacement[];
  if ((reps[0] as { name: string, list: oldReplacement[] }).name !== undefined) {
    oldReps = reps.map(r => (r as { name: string, list: oldReplacement[] }).list).flat();
  }
  else {
    oldReps = reps as oldReplacement[];
  }
  // Extract
  let newExl: AioExternalReplacements[] = [];
  newExl.push(...oldReps.filter(o => o.givenName !== undefined).map(oRep => {
    let nReps: AioReplacement[] = updateReplacementVersion([oRep]);
    let nRvs: AioReplacementValues[] = nReps.map(nRep => { return nRep.newTexts; }).flat();
    return {
      givenName: oRep.givenName,
      newTexts: nRvs,
    } as AioExternalReplacements;
  }));
  return newExl;
}