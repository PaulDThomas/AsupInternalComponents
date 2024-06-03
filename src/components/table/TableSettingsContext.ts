import React from "react";
import { AitOptionList } from "./interface";
import { AsupInternalEditor } from "../aie/AsupInternalEditor";
import { getRawTextParts } from "../aie/functions/getRawTextParts";

const defaultSettings: AitOptionList<string | object> = {
  noRepeatProcessing: false,
  showCellBorders: true,
  windowZIndex: 10000,
  colWidthMod: 1.5,
  decimalAlignPercent: 60,
  defaultCellWidth: 60,
  blank: "",
  editable: true,
  Editor: AsupInternalEditor,
  getTextFromT: getRawTextParts,
};

export const TableSettingsContext = React.createContext<AitOptionList<string | object>>(
  defaultSettings as AitOptionList<string | object>,
);

TableSettingsContext.displayName = "TableSettingsContext";
