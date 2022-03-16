/**
 * 
 */
export interface AioOption {
  optionName: AitCellOptionNames | AitRowOptionNames | AitRowGroupOptionNames | AitTableOptionNames | AioNewItem,
  type: AioOptionType,
  value: any,
  label?: string,
  availableValues?: string[],
  readOnly?: boolean,
}
export interface AioOptionGroup extends Array<AioOption> { };


export interface AioReplacementText {
  level: number,
  text: string,
}

/**
 * Single replacement value, allowing for sublists
 * @interface newText Text that will be applied
 * @interface subList Sub list of replacements that are associated with only this value
 */
export interface AioReplacementValue {
  newText: string,
  subList?: AioReplacementValue[],
}

export interface AioReplacement {
  replacementText: AioReplacementText[],
  replacementValues: AioReplacementValue[],
}

export enum AioOptionType {
  string = "string",
  number = "number",
  array = "array",
  object = "object",
  select = "select",
  replacements = "replacements",
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