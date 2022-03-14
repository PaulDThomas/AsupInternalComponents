import { AitCellData, AitCellType, AitRowData, AitRowGroupData, AitTableBodyData } from "./aitInterface";
import { AitCellOptionNames, AioOptionGroup, AitProcessingOptions, AioOptionType, AitRowGroupOptionNames, AioReplacement } from "../aio/aioInterface";

export const processOptions = (updatedOptions: AioOptionGroup, previousOptions: AioOptionGroup) => {
  // Return updated options if there is nothing to process against  
  if (previousOptions === undefined) {
    return updatedOptions;
  }

  // Create new options to update
  var newOptions = previousOptions.map(a => { return { ...a } });

  // Get each value, or add blank
  for (let uo of updatedOptions) {
    let i = newOptions.findIndex(no => no.optionName === uo.optionName);
    if (i >= 0) {
      newOptions[i].type = uo.type;
      newOptions[i].value = uo.value;
      newOptions[i].label = uo.label ?? newOptions[i].label;
      newOptions[i].availableValues = uo.availableValues ?? newOptions[i].availableValues;
      newOptions[i].readOnly = uo.readOnly ?? newOptions[i].readOnly;
    }
    else {
      newOptions.push({ ...uo });
    }
    uo.value = updatedOptions?.find((i) => { return i.optionName === uo.optionName; })?.value ?? uo.value;
  }
  return newOptions;
};


/* 
 * Process row data using available (processed) options 
 */
export function processCell(c: AitCellData, og: AioOptionGroup): AitCellData {
  console.log(`Processing cell ${c.originalText}`);
  for (let po of og) {
    switch (po.optionName) {
      // Update cellType
      case (AitProcessingOptions.setCellType):
        let i = c.options?.findIndex(o => o.optionName === AitCellOptionNames.cellType) ?? -1;
        if (i >= 0) {
          c.options[i].value = po.value;
        }
        else {
          c.options.push({
            optionName: AitCellOptionNames.cellType,
            label: "Cell type",
            value: po.value,
            type: AioOptionType.select,
            readOnly: true,
          });
        }
        break;

      default: break;
    }
  }

  return c;
}


/* 
 * Process row data using available (processed) options 
 */
export function processRow(r: AitRowData, og: AioOptionGroup): AitRowData {
  r.cells = r.cells.map(c => {
    // Ensure default options are present
    c.options = processOptions(c.options ?? [], [
      { optionName: AitCellOptionNames.cellWidth, label: "Minimum width", value: "120px", type: AioOptionType.string, },
      { optionName: AitCellOptionNames.cellType, label: "Cell Type", value: AitCellType.body, type: AioOptionType.select, readOnly: true, availableValues: [AitCellType.body, AitCellType.header, AitCellType.rowHeader] },
      { optionName: AitCellOptionNames.colSpan, label: "Column span", value: 1, type: AioOptionType.number, readOnly: true },
      { optionName: AitCellOptionNames.rowSpan, label: "Row span", value: 1, type: AioOptionType.number, readOnly: true },
    ] as AioOptionGroup
    );
    // Cell data processing
    processCell(c, [
      ...c.options,
      ...og,
    ])

    return c;
  });
  return r;
}


/* 
 * Process row group data using available (processed) options 
 */
export function processRowGroup(rg: AitRowGroupData, og: AioOptionGroup): AitRowGroupData {
  // Process replacements
  let ri = og.findIndex(o => o.optionName === AitRowGroupOptionNames.replacements);
  if (ri >= 0) {
    let rep = og[ri].value as AioReplacement;
    let shallowCopy = rg.rows.map(r => ({ ...r } as AitRowData)) as AitRowData[];
    for (let rvi in rep.replacementValues) {
      // Add replacement option
      if (rvi === '0') {
        // Add single replacment option
        rg.rows.map(r => {
          r.options.push(
            {
              optionName: AitProcessingOptions.replacement,
              type: AioOptionType.processing,
              value: { replaceText: og[rvi].value.replacementText, replaceValue: og[rvi].value.replacementValues[0] }
            });
          return r;
        });
      }
      // Copy with new replacement option
      else {
        let addRows = [...shallowCopy];
        addRows.map(r => {
          r.options.push(
            {
              optionName: AitProcessingOptions.replacement,
              type: AioOptionType.processing,
              value: { replaceText: og[rvi].value.replacementText, replaceValue: og[rvi].value.replacementValues[0] }
            });
          return r;
        })
        rg.rows.push(...addRows);
      }
    }
  }


  rg.rows = rg.rows.map(r => processRow(r, [
    ...r.options,
    ...og,
  ]));
  return rg;
}

/*
 * Process table data from passed options
 */
export function processTable(headerData: AitRowGroupData, bodyData: AitTableBodyData, options: AioOptionGroup): [AitRowGroupData, AitTableBodyData, AioOptionGroup] {
  console.log(`Processing table data`)
  // console.log(`Header data has ${headerData.rows.length} rows`);
  // console.log(`Body data has ${bodyData.rowGroups.length} row groups`);
  // console.log(`There are ${options.length} options`);

  // Process header data
  headerData = processRowGroup(headerData, [
    { optionName: AitProcessingOptions.setCellType, value: AitCellType.header, type: AioOptionType.processing },
    ...headerData.options,
    ...options,
  ]);
  bodyData.rowGroups = bodyData.rowGroups.map(rg => processRowGroup(rg, [
    ...rg.options,
    ...options
  ]));

  /*
  
    for (let rg of bodyData.rowGroups) {
      // let rgi = bodyData.rowGroups.findIndex(rgi);
      let replace = rg.options.findIndex(o => o.optionName === AitRowGroupOptionNames.replacements) > -1 ? rg.options.find(o => o.optionName === AitRowGroupOptionNames.replacements) : undefined;
      let replaceFlag = false;
      for (let r of rg.rows) {
        // let ri = rg.rows[ri];
        for (let c of r.cells) {
          // let c = r.cells[ci];
          let ci = r.cells.indexOf(c);
          // Set body cells to correct cell type
          if (c.options?.findIndex(o => o.optionName === AitCellOptionNames.cellType) > -1)
            c.options.find(o => o.optionName === AitCellOptionNames.cellType)!.value = ci < rowHeaderColumns ? AitCellType.rowHeader : AitCellType.body;
  
          //c.renderColumn = +ci;
          // Check for replacement text - make any replaced cells read only
          console.log("Replace check");
          if (replace?.value?.replacementText !== undefined) {
            if (c.originalText.includes(replace?.value?.replacementText)) {
              c.readOnly = true;
              replaceFlag = true;
            }
            else {
              c.readOnly = false;
            }
          }
        }
      }
      // perform replacements...
      if (replaceFlag) {
        let originalRows = rg.rows.splice(0, rg.rows.length);
        if (replace) for (let replacement of replace?.value.replacementValues) {
          let newRows = originalRows.map((r, ri) => {
            return {
              aitid: `${r.aitid}-R` + ri,
              cells: r.cells.map(c => {
                var re = new RegExp(replace?.value.replacementText, "g");
                c.originalText = c.originalText.replace(re, replacement);
                c.text = c.originalText;
                return c;
              }),
              options: [...r.options],
            } as AitRowData;
          });
          // newRows.map(r => { r.cells.map(c => { c.originalText = c.originalText.replace(replace?.value.replacementText, replacement); return c; }); return r; });
          rg.rows = rg.rows.concat(newRows);
          console.log(`Rows in row group is now $${rg.rows}`);
        }
      }
    }
  */
  return [headerData, bodyData, options];
}