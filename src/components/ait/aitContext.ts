import React from 'react';
import { AitOptionList } from './aitInterface';

const defaultSettings: AitOptionList = {
  noRepeatProcessing: false,
  showCellBorders: true,
  windowZIndex: 10000,
  colWidthMod: 1.5,
  decimalAlignPercent: 60,
  defaultCellWidth: 60,
};

export const TableSettingsContext = React.createContext(defaultSettings);
