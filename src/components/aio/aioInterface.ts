export interface Option {
  type: OptionType,
  optionName: AitCellOptionNames | AitRowOptionNames | AitRowGroupOptionNames | AitTableOptionNames,
  value: any,
  label?: string,
}

export interface OptionGroup extends Array<Option> { };

export enum OptionType {
  string = "string",
  number = "number",
  array = "array",
  object = "object",
}

export enum AitCellOptionNames {
  cellWidth = "cellWidth",
  cellStatistic = "cellStatisic",
  cellText = "cellText",
};
export enum AitRowOptionNames {

};
export enum AitRowGroupOptionNames {

};
export enum AitTableOptionNames {
  tableName = "tableName",
  tableDescription = "tableDescription",
  rowHeaderColumns = "rowHeaderColumns",
  repeatingColumns = "repeatingColumns",
  columnRepeatList = "columnRepeatList",
};