/** Individual options */
export interface AioOption {
  optionName?: AioNewItem,
  type: AioOptionType,
  value: any,
  label?: string,
  availableValues?: string[],
  readOnly?: boolean,
}
export interface AioOptionGroup extends Array<AioOption> { };

/** Individual text replacements */
export interface AioReplacementText {
  text: string,
  spaceAfter: boolean,
}

/** Single replacement value, allowing for sublists */
export interface AioReplacementValue {
  newText: string,
  subList?: AioReplacementValue[],
}

/** Text replacements, and their replacement matrix */
export interface AioReplacement {
  replacementTexts: AioReplacementText[],
  replacementValues: AioReplacementValue[],
}

export interface AioRepeats { numbers: number[][], values: string[][], last: boolean[][] };

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