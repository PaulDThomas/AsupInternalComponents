import { TableSettingsContext } from 'components/ait/aitContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AitCellData } from '../ait/aitInterface';

/**
 * Create a blank new cell
 * @param type Type of cell to create
 * @returns data for a new blank cell
 */
export const newCell = (): AitCellData => {
  const tableSettings = useContext(TableSettingsContext);
  const cell: AitCellData = {
    aitid: uuidv4(),
    text: '',
    rowSpan: 1,
    colSpan: 1,
    colWidth: tableSettings.defaultColumnWidth,
  };
  return cell;
};
