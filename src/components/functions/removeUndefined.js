// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeUndefined = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.filter((v) => v !== undefined).map((v) => removeUndefined(v));
  }
  return Object.fromEntries(
    Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([k, v]) => v !== undefined && !k.match(/^ai.id$/))
      .map(([k, v]) => [k, v && typeof v === 'object' ? removeUndefined(v) : v]),
  );
};
