import { AitHeaderRowData, AitRowData } from "../table/interface";
import { newCell, newHeaderCell } from "./newCell";

export const newRow = <T extends string | object>(
  defaultCellWidth: number,
  l?: number,
): AitRowData<T> => {
  const newRow: AitRowData<T> = { aitid: crypto.randomUUID(), cells: [] };
  // Add new cells in a loop to avoid duplicate aitid
  for (let i = 0; i < (l ?? 1); i++) newRow.cells.push(newCell(defaultCellWidth));
  return newRow;
};

export const newHeaderRow = <T extends string | object>(
  defaultCellWidth: number,
  l?: number,
): AitHeaderRowData<T> => {
  const newRow: AitHeaderRowData<T> = { aitid: crypto.randomUUID(), cells: [] };
  // Add new cells in a loop to avoid duplicate aitid
  for (let i = 0; i < (l ?? 1); i++) newRow.cells.push(newHeaderCell(defaultCellWidth));
  return newRow;
};
