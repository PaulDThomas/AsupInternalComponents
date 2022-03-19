import { AitCellOptionNames, AitRowGroupOptionNames, AitRowOptionNames, AitTableOptionNames } from "components/ait/aitInterface";

/** Individual options */
export interface AioOption {
  optionName: AitCellOptionNames | AitRowOptionNames | AitRowGroupOptionNames | AitTableOptionNames | AioNewItem,
  type: AioOptionType,
  value: any,
  label?: string,
  availableValues?: string[],
  readOnly?: boolean,
}
export interface AioOptionGroup extends Array<AioOption> { };

/** Individual text replacements */
export interface AioReplacementText {
  level: number,
  text: string,
}

/** Single replacement value, allowing for sublists */
export interface AioReplacementValue {
  newText: string,
  subList?: AioReplacementValue[],
}

export interface AioRepeats { numbers: number[][], values: string[][] };

/** Text replacements, and their replacement matrix */
export interface AioReplacement {
  replacementText: AioReplacementText[],
  replacementValues: AioReplacementValue[],
}

export enum AioOptionType {
  string = "string",
  number = "number",
  array = "array",
  object = "object",
  boolean = "boolean",
  select = "select",
  replacements = "replacements",
}

export enum AioNewItem {
  newKey = "newKey",
  newType = "newType",
}