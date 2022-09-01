import { v4 as uuidv4 } from 'uuid';
import { AitRowData } from '../ait/aitInterface';
import { newCell } from './newCell';

/**
 * Create new table row
 * @param l Length of row
 * @param type Type of row to be created, header or body
 * @returns New row data
 */
export const newRow = (l?: number, defaultCellWidth?: number): AitRowData => {
  const newRow: AitRowData = { aitid: uuidv4(), cells: [] };
  // Add new cells in a loop to avoid duplicate aitid
  for (let i = 0; i < (l ?? 1); i++) newRow.cells.push(newCell(defaultCellWidth));
  return newRow;
};
