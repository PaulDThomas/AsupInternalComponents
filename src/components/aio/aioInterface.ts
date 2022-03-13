export interface Option {
  optionName: AitCellOptionNames | AitRowOptionNames | AitRowGroupOptionNames | AitTableOptionNames 
  | AioNewItem | AitProcessingOptions,
  type: OptionType,
  value: any,
  label?: string,
  availableValues?: Array<string>,
  readOnly?: boolean,
}
export interface OptionGroup extends Array<Option> { };

export interface Replacement {
  replacementText: string,
  replacementValues: Array<string>
}


export enum OptionType {
  string = "string",
  number = "number",
  array = "array",
  object = "object",
  select = "select",
  replacements = "replacements",
  processing = "processing",
}

export enum AitCellOptionNames {
  cellWidth = "cellWidth",
  cellStatistic = "cellStatisic",
  cellText = "cellText",
  colSpan = "colSpan",
  rowSpan = "rowSpan",
  cellType = "cellType",
  readOnly = "readOnly",
};
export enum AitRowOptionNames {

};
export enum AitRowGroupOptionNames {
  rgName = "rgName",
  replacements = "replacements",
};
export enum AitTableOptionNames {
  tableName = "tableName",
  tableDescription = "tableDescription",
  rowHeaderColumns = "rowHeaderColumns",
  repeatingColumns = "repeatingColumns",
  columnRepeatList = "columnRepeatList",
};

export enum AioNewItem {
  newKey = "newKey",
  newType = "newType",
}

export enum AitProcessingOptions {
  setCellType = "setCellType"
}