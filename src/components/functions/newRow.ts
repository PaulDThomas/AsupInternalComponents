import { v4 as uuidv4 } from "uuid";
import { AitHeaderRowData, AitRowData } from "../table/interface";
import { newCell, newHeaderCell } from "./newCell";

export const newRow = (defaultCellWidth: number, l?: number): AitRowData => {
  const newRow: AitRowData = { aitid: uuidv4(), cells: [] };
  // Add new cells in a loop to avoid duplicate aitid
  for (let i = 0; i < (l ?? 1); i++) newRow.cells.push(newCell(defaultCellWidth));
  return newRow;
};

export const newHeaderRow = (defaultCellWidth: number, l?: number): AitHeaderRowData => {
  const newRow: AitHeaderRowData = { aitid: uuidv4(), cells: [] };
  // Add new cells in a loop to avoid duplicate aitid
  for (let i = 0; i < (l ?? 1); i++) newRow.cells.push(newHeaderCell(defaultCellWidth));
  return newRow;
};
