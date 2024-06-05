import { AioExternalReplacements, AioReplacement, AioReplacementValues } from "../aio";

interface oldReplacementText {
  text: string;
  spaceAfter: boolean;
}

interface oldReplacementValue {
  newText: string;
  subList?: oldReplacementValue[];
}

export interface oldReplacement {
  airid?: string;
  replacementTexts: oldReplacementText[];
  replacementValues: oldReplacementValue[];
  givenName?: string;
  externalName?: string;
}

export const updateReplacementVersion = (
  reps?: AioReplacement<string>[] | oldReplacement[],
): AioReplacement<string>[] => {
  // Check processing required
  if (reps === undefined || reps.length === 0) return [];
  if ((reps[0] as AioReplacement<string>).oldText !== undefined)
    return reps as AioReplacement<string>[];
  // Create the new object
  const oldReps = reps as oldReplacement[];
  const newReps: AioReplacement<string>[] = [];
  for (let i = 0; i < oldReps.length; i++) {
    const oldRep = oldReps[i];
    if (!oldRep.replacementValues.some((rv) => (rv.subList?.length ?? 0) > 0)) {
      const newRV: AioReplacementValues<string> = {
        airid: crypto.randomUUID(),
        texts: oldRep.replacementValues.map((rv) => rv.newText),
        spaceAfter: oldRep.replacementTexts[0]?.spaceAfter ?? false,
        subLists: [],
      };
      const newRep: AioReplacement<string> = {
        airid: crypto.randomUUID(),
        oldText: oldRep.replacementTexts[0].text ?? "",
        newTexts: [newRV],
        includeTrailing: false,
        externalName: oldRep.externalName,
      };
      newReps.push(newRep);
    } else {
      const newRep: AioReplacement<string> = {
        airid: crypto.randomUUID(),
        oldText: oldRep.replacementTexts[0].text,
        newTexts: [],
        includeTrailing: false,
        externalName: oldRep.externalName,
      };
      for (let j = 0; j < oldRep.replacementValues.length; j++) {
        const nextLevel: oldReplacement = {
          replacementTexts: oldRep.replacementTexts.slice(1),
          replacementValues: oldRep.replacementValues[j].subList ?? [],
        };
        const newRV: AioReplacementValues<string> = {
          airid: crypto.randomUUID(),
          texts: [oldRep.replacementValues[j].newText],
          spaceAfter: oldRep.replacementTexts[0].spaceAfter,
          subLists:
            nextLevel.replacementTexts.length > 0
              ? updateReplacementVersion([nextLevel])
              : undefined,
        };
        newRep.newTexts.push(newRV);
      }
      newReps.push(newRep);
    }
  }
  return newReps;
};

export function updateReplToExtl(
  reps:
    | AioExternalReplacements<string>[]
    | oldReplacement[]
    | { name: string; list: oldReplacement[] }[],
): AioExternalReplacements<string>[] {
  // Check processing required
  if (reps === undefined || reps.length === 0) return [];
  if ((reps[0] as AioExternalReplacements<string>).givenName !== undefined)
    return reps as AioExternalReplacements<string>[];
  // Change from old to new
  let oldReps: oldReplacement[];
  if ((reps[0] as { name: string; list: oldReplacement[] }).name !== undefined) {
    oldReps = reps.map((r) => (r as { name: string; list: oldReplacement[] }).list).flat();
  } else {
    oldReps = reps as oldReplacement[];
  }
  // Extract
  const newExl: AioExternalReplacements<string>[] = [];
  newExl.push(
    ...oldReps
      .filter((o) => o.givenName !== undefined)
      .map((oRep) => {
        const nReps: AioReplacement<string>[] = updateReplacementVersion([oRep]);
        const nRvs: AioReplacementValues<string>[] = nReps
          .map((nRep) => {
            return nRep.newTexts;
          })
          .flat();
        return {
          givenName: oRep.givenName,
          newTexts: nRvs,
        } as AioExternalReplacements<string>;
      }),
  );
  return newExl;
}
