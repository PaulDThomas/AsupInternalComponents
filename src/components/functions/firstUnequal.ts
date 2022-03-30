/**
 * Find first unequal obs in two number arrays 
 * @param a First array
 * @param b Second array
 * @returns index of first unequal number
 */
export const firstUnequal = (a: number[], b: number[]): number => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return i;
  }
  if (b.length > a.length)
    return a.length;
  else
    return 0;
};