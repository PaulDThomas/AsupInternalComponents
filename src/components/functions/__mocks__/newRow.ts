import { AitRowData } from "../../table";
import { AitHeaderRowData } from "../../table/interface";
import { newCell, newHeaderCell } from "./newCell";

let mockUUID = 2000;

export const newRow = <T extends string | object>(
  defaultCellWidth: number,
  blank: T,
  l?: number,
): AitRowData<T> => {
  const newRow: AitRowData<T> = { aitid: `mockUUID-${++mockUUID}`, cells: [] };
  // Add new cells in a loop to avoid duplicate aitid
  for (let i = 0; i < (l ?? 1); i++) newRow.cells.push(newCell(defaultCellWidth, blank));
  return newRow;
};

export const newHeaderRow = <T extends string | object>(
  defaultCellWidth: number,
  blank: T,
  l?: number,
): AitHeaderRowData<T> => {
  const newRow: AitHeaderRowData<T> = { aitid: `mockUUID-${++mockUUID}`, cells: [] };
  // Add new cells in a loop to avoid duplicate aitid
  for (let i = 0; i < (l ?? 1); i++) newRow.cells.push(newHeaderCell(defaultCellWidth, blank));
  return newRow;
};
