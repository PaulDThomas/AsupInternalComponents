import { AioExternalReplacements, AioReplacement } from '../aio';
import { updateExternal } from './updateExternal';

/** Update base list with external lists */
export const updateExternals = (
  reps?: AioReplacement[],
  exts?: AioExternalReplacements[],
): AioReplacement[] | undefined => {
  if (reps === undefined) return undefined;
  return reps.map((rep) => updateExternal(rep, exts));
};
