export interface Option {
  type: string,
  name: string,
  value: any,
  label?: string,
}

export interface OptionGroup extends Array<Option> {};