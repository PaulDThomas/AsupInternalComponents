import React, { useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';
import { AioOptionGroup, AioOptionType, AioReplacement } from "components/aio/aioInterface";
import { AioOptionDisplay } from "components/aio/aioOptionDisplay";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
import { AitBorderRow } from "./aitBorderRow";
import { AitHeader } from "./aitHeader";
import { AitTableOptionNames, AitRowGroupData, AitTableBodyData, AitTableData, AitCellType, AitOptionList, AitRowGroupOptionNames } from "./aitInterface";
import { AitRowGroup } from "./aitRowGroup";
import { newCell } from "./processes";
import './ait.css';

interface AsupInteralTableProps {
  tableData: AitTableData,
  setTableData: (ret: AitTableData) => void,
  style?: React.CSSProperties,
  showCellBorders?: boolean,
}

/**
 * Table view for clinical table data
 * @param props 
 * @returns 
 */
export const AsupInteralTable = ({ tableData, setTableData, style, showCellBorders }: AsupInteralTableProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const returnData = useCallback((tableUpdate: { headerData?: AitRowGroupData, bodyData?: AitTableBodyData, options?: AioOptionGroup }) => {
    if (typeof (setTableData) !== "function") return;


    const r = {
      headerData: tableUpdate.headerData ?? tableData.headerData,
      bodyData: tableUpdate.bodyData ?? tableData.bodyData,
      options: tableUpdate.options ?? tableData.options,
    };
    setTableData(r);
  }, [setTableData, tableData.bodyData, tableData.headerData, tableData.options]);

  // Update to a rowGroup data
  const updateRowGroup = useCallback((ret: AitRowGroupData, rgi: number) => {
    let newBody: AitTableBodyData = { rowGroups: tableData.bodyData.rowGroups, options: tableData.bodyData.options };
    newBody.rowGroups[rgi] = ret;
    returnData({ bodyData: newBody });
  }, [tableData.bodyData.options, tableData.bodyData.rowGroups, returnData]);

  // Add a new row group to the table body
  const addRowGroup = useCallback((rgi: number) => {
    let newBody: AitTableBodyData = { rowGroups: tableData.bodyData.rowGroups, options: tableData.bodyData.options };
    let newRowGroup: AitRowGroupData = {
      aitid: uuidv4(),
      options: [],
      rows: [{
        aitid: uuidv4(),
        options: [],
        cells: [],
      }]
    };
    let cols = tableData.bodyData.rowGroups[0].rows[0].cells
      .map(c => c.colSpan ?? 1)
      .reduce((sum, a) => sum + a, 0);
    for (let i = 0; i < cols; i++) newRowGroup.rows[0].cells.push(newCell());
    newBody.rowGroups.splice(rgi + 1, 0, newRowGroup);
    returnData({ bodyData: newBody });
  }, [tableData.bodyData.options, tableData.bodyData.rowGroups, returnData]);

  // Remove a row group from the table body
  const removeRowGroup = useCallback((rgi: number) => {
    let newBody: AitTableBodyData = { rowGroups: tableData.bodyData.rowGroups, options: tableData.bodyData.options };
    newBody.rowGroups.splice(rgi, 1);
    returnData({ bodyData: newBody });
  }, [returnData, tableData.bodyData.options, tableData.bodyData.rowGroups]);

  let higherOptions = useMemo(() => {
    return {
      showCellBorders: showCellBorders,
      noRepeatProcessing: tableData.options?.find(o => o.optionName === AitTableOptionNames.noRepeatProcessing)?.value,
      rowHeaderColumns: tableData.options?.find(o => o.optionName === AitTableOptionNames.rowHeaderColumns)?.value,
    };
  }, [showCellBorders, tableData.options]) as AitOptionList;

  const addCol = useCallback((col: number) => {
    let newBody: AitTableBodyData = { rowGroups: tableData.bodyData.rowGroups, options: tableData.bodyData.options };
    newBody.rowGroups = newBody.rowGroups.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(col + 1, 0, newCell());
        return r;
      });
      return rg;
    });
    let newHeader: AitRowGroupData = { ...tableData.headerData };
    tableData.headerData.rows = newHeader.rows.map(r => {
      r.cells.splice(col + 1, 0, newCell());
      return r;
    });
    returnData({ headerData: newHeader, bodyData: newBody });
  }, [tableData.bodyData.options, tableData.bodyData.rowGroups, tableData.headerData, returnData]);

  const remCol = useCallback((col: number) => {
    let newBody: AitTableBodyData = { rowGroups: tableData.bodyData.rowGroups, options: tableData.bodyData.options };
    newBody.rowGroups = newBody.rowGroups.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(col, 1);
        return r;
      });
      return rg;
    });
    let newHeader: AitRowGroupData = { ...tableData.headerData };
    tableData.headerData.rows = newHeader.rows.map(r => {
      r.cells.splice(col, 1);
      return r;
    });
    returnData({ headerData: newHeader, bodyData: newBody });
  }, [tableData.bodyData.options, tableData.bodyData.rowGroups, tableData.headerData, returnData]);

  // Print the table
  return (
    <>
      <div
        className="ait-holder"
        style={style}
      >
        <div>
          <div className={`ait-table-options visible`} onClick={() => { setShowOptions(true); }}>
          </div>
          {showOptions &&
            <AsupInternalWindow Title={"Table options"} Visible={showOptions} onClose={() => { setShowOptions(false); }}>
              <AioOptionDisplay options={tableData.options} setOptions={(ret) => returnData({ options: ret })} />
            </AsupInternalWindow>
          }
        </div>
        <table className="ait-table">
          {tableData.headerData.rows.length > 0 &&
            <thead>
              <AitBorderRow
                rowCells={tableData.bodyData.rowGroups[0].rows[0].cells}
                spaceAfter={true}
                changeColumns={{
                  addColumn: addCol,
                  removeColumn: remCol,
                  showButtons: true,
                }}
              />
              <AitHeader
                aitid={tableData.headerData.aitid}
                rows={tableData.headerData.rows}
                options={
                  tableData.headerData.options?.length > 0
                    ?
                    tableData.headerData.options
                    :
                    /** Default header options */
                    [
                      { optionName: AitRowGroupOptionNames.rgName, label: "Group name", type: AioOptionType.string, value: "Header" },
                      {
                        optionName: AitRowGroupOptionNames.replacements,
                        label: "Replacement lists",
                        type: AioOptionType.replacements,
                        value: [{ replacementTexts: [{ level: 0, text: "", spaceAfter: false }], replacementValues: [{ newText: "" }] }] as AioReplacement[]
                      },
                    ]
                }
                setHeaderData={(ret) => returnData({ headerData: ret })}
                higherOptions={{
                  ...higherOptions,
                  tableSection: AitCellType.header,
                  rowGroup: 0,
                }}
              />
              <AitBorderRow rowCells={tableData.bodyData.rowGroups[0].rows[0].cells} spaceBefore={true} noBorder={true} />
            </thead>
          }

          <tbody>
            <AitBorderRow
              rowCells={tableData.bodyData.rowGroups[0].rows[0].cells}
              spaceAfter={true}
              changeColumns={tableData.headerData.rows.length === 0
                ?
                {
                  addColumn: addCol,
                  removeColumn: remCol,
                  showButtons: true,
                }
                : undefined
              }
            />
            {
              tableData.bodyData.rowGroups?.map((rowGroup: AitRowGroupData, rgi: number) => {

                /** Protect against missing information on load */
                if (rowGroup.aitid === undefined) rowGroup.aitid = uuidv4();
                /** Default row group options */
                if (rowGroup.options === undefined || rowGroup.options.length === 0) rowGroup.options = [
                  { optionName: AitRowGroupOptionNames.rgName, label: "Group name", type: AioOptionType.string, value: "New group" },
                  {
                    optionName: AitRowGroupOptionNames.replacements,
                    label: "Replacement lists",
                    type: AioOptionType.replacements,
                    value: [{ replacementTexts: [{ level: 0, text: "", spaceAfter: false }], replacementValues: [{ newText: "" }] }] as AioReplacement[]
                  },
                ];

                return (
                  <AitRowGroup
                    key={rowGroup.aitid}
                    aitid={rowGroup.aitid}
                    rows={rowGroup.rows}
                    options={rowGroup.options}
                    setRowGroupData={(ret) => { updateRowGroup(ret, rgi) }}
                    higherOptions={{
                      ...higherOptions,
                      tableSection: AitCellType.body,
                      rowGroup: rgi,
                    }}
                    addRowGroup={(rgi) => { addRowGroup(rgi) }}
                    removeRowGroup={rgi > 0 ? (rgi) => { removeRowGroup(rgi) } : undefined}
                  />
                );
              })
            }
            <AitBorderRow rowCells={tableData.bodyData.rowGroups[0].rows[0].cells} />
          </tbody>
        </table>
      </div>
    </>
  );
};