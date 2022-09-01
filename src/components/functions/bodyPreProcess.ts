import { v4 as uuidv4 } from 'uuid';
import { AitRowGroupData } from '../ait';
import { rowPreProcess } from './rowPreProcess';

/**
 * Preprocessing for bodyData row groups
 * @param rgs
 * @returns compliant row groups
 */
export const bodyPreProcess = (rgs?: AitRowGroupData[]): AitRowGroupData[] => {
  if (rgs === undefined) return [];
  return rgs.map((rg) => {
    return {
      ...rg,
      rows: rowPreProcess(rg.rows),
      aitid: rg.aitid ?? uuidv4(),
    };
  });
};
