export interface Option {
  type: OptionType,
  optionName: CellOptionNames | RowOptionNames | RowGroupOptionNames | TableOptionNames ,
  value: any,
  label?: string,
}

export interface OptionGroup extends Array<Option> {};

export enum OptionType {
  string = "string",
  number = "number",
  array = "array",
  object = "object",
}

export enum CellOptionNames {
  cellWidth = "cellWidth",
};
export enum RowOptionNames {};
export enum RowGroupOptionNames {};
export enum TableOptionNames {};