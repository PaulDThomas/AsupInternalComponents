import { AitCellType, AitRowGroupData, AitTableBodyData } from "./aitInterface";
import { AitCellOptionNames, AitTableOptionNames, OptionGroup } from "../aio/aioInterface";

export const processOptions = (initialOptions: OptionGroup, defaultOptions: OptionGroup) => {
  var newOptions = defaultOptions.map(a => { return { ...a } })

  // Get each value, or add blank
  for (let o of newOptions) {
    o.value = ((initialOptions ?? []).find((i) => { return i.optionName === o.optionName; }) !== undefined)
      ? initialOptions.find((i) => { return i.optionName === o.optionName; })!.value
      : o.value;
  }
  return newOptions;
};

export function processTable(headerData: AitRowGroupData, bodyData: AitTableBodyData, options: OptionGroup): [AitRowGroupData, AitTableBodyData, OptionGroup] {
  console.log(`Processing data`)
  console.log(`Header data has ${headerData.rows.length} rows`);
  console.log(`Body data has ${bodyData.rowGroups.length} row groups`);
  console.log(`There are ${options.length} options`);

  // Update cell type for rowHeaders
  let rowHeaderColumns = options.find(o => o.optionName === AitTableOptionNames.rowHeaderColumns)?.value ?? 1;
  console.log(`Setting ${rowHeaderColumns} row header columns`);

  for (let rgi in bodyData.rowGroups) {
    let rg = bodyData.rowGroups[rgi];
    for (let ri in rg.rows) {
      let r = rg.rows[ri];
      for (let ci in r.cells) {
        let c = r.cells[ci];
        if (c.options?.findIndex(o => o.optionName === AitCellOptionNames.cellType) > -1)
          c.options.find(o => o.optionName === AitCellOptionNames.cellType)!.value = ci < rowHeaderColumns ? AitCellType.rowHeader : AitCellType.body;
        //c.renderColumn = +ci;
      }
    }
  }




  return [headerData, bodyData, options];
}