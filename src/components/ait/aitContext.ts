import React from "react";
import { AitOptionList } from "./aitInterface";

let defaultSettings: AitOptionList = {
  noRepeatProcessing: false,
  showCellBorders: true,
  windowZIndex: 10000,
};

export const TableSettingsContext = React.createContext(defaultSettings);