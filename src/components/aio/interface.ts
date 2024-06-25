/** Individual options */
export interface AioOption {
  optionName?: AioNewItem;
  type: AioOptionType;
  value: unknown;
  label?: string;
  availableValues?: string[];
  readOnly?: boolean;
}

/** Text replacements, and their replacement matrix */
export interface AioReplacement<T extends string | object> {
  airid?: string;
  oldText: string;
  newTexts: AioReplacementValues<T>[];
  includeTrailing?: boolean;
  externalName?: string;
}

export interface AioReplacementValues<T extends string | object> {
  airid?: string;
  texts: T[];
  spaceAfter?: boolean;
  subLists?: AioReplacement<T>[];
}

export interface AioExternalReplacements<T extends string | object> {
  givenName: string;
  newTexts: AioReplacementValues<T>[];
}

export interface AioExternalSingle<T extends string | object> {
  airid?: string;
  oldText?: string;
  newText?: T;
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
