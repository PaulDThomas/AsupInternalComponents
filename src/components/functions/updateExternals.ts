import { AioExternalReplacements, AioReplacement } from "../aio";
import { updateExternal } from "./updateExternal";

/** Update base list with external lists */
export const updateExternals = <T extends string | object>(
  reps?: AioReplacement<T>[],
  exts?: AioExternalReplacements<T>[],
): AioReplacement<T>[] | undefined => {
  if (reps === undefined) return undefined;
  return reps.map((rep) => updateExternal(rep, exts));
};
