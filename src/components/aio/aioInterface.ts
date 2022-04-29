/** Individual options */
export interface AioOption {
  optionName?: AioNewItem,
  type: AioOptionType,
  value: any,
  label?: string,
  availableValues?: string[],
  readOnly?: boolean,
}

/** Text replacements, and their replacement matrix */
export interface AioReplacement {
  airid?: string,
  oldText: string,
  newTexts: AioReplacementValues[],
  includeTrailing?: boolean,
  externalName?: string,
}

export interface AioReplacementValues {
  airid?: string,
  texts: string[],
  spaceAfter?: boolean,
  subLists?: AioReplacement[],
}

export interface AioExternalReplacements {
  givenName: string,
  subLists: AioReplacementValues[],
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