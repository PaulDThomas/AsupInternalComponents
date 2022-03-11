export interface Option {
  type: OptionType,
  optionName: AitCellOptionNames | AitRowOptionNames | AitRowGroupOptionNames | AitTableOptionNames | AioNewItem,
  value: any,
  label?: string,
  availableValues?: Array<string>,
  readOnly?: boolean,
}

export interface OptionGroup extends Array<Option> { };

export enum OptionType {
  string = "string",
  number = "number",
  array = "array",
  object = "object",
  select = "select"
}

export enum AitCellOptionNames {
  cellWidth = "cellWidth",
  cellStatistic = "cellStatisic",
  cellText = "cellText",
  colSpan = "colSpan",
  rowSpan = "rowSpan",
  cellType = "cellType",
};
export enum AitRowOptionNames {

};
export enum AitRowGroupOptionNames {
  rgName = "rgName",
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