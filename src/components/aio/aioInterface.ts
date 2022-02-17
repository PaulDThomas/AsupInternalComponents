export interface Option {
  type: string,
  optionName: string,
  value: any,
  label?: string,
}

export interface OptionGroup extends Array<Option> {};