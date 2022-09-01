import { AitCellData } from '../ait';
import { v4 as uuidv4 } from 'uuid';
import { newCell } from './newCell';

/**
 * Preprocessing for cells
 * @param cs
 * @returns compliant cell
 */
export const cellPreProcess = (cs?: AitCellData[], defaultCellWidth?: number): AitCellData[] => {
  if (cs === undefined) return [newCell(defaultCellWidth)];
  // Check aitid
  return cs.map((c) => {
    return {
      ...c,
      aitid: c.aitid ?? uuidv4(),
    };
  });
};
