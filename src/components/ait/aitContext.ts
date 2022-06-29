import React from "react";
import { AitOptionList } from "./aitInterface";

let defaultSettings: AitOptionList = {
  noRepeatProcessing: false,
  showCellBorders: true,
};

export const TableSettingsContext = React.createContext(defaultSettings);