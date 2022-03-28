import React, { useState, useCallback, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
import { AitBorderRow } from "./aitBorderRow";
import { AitHeader } from "./aitHeader";
import { AitRowGroupData, AitTableData, AitOptionList, AitRowType, AitColumnRepeat } from "./aitInterface";
import { AitRowGroup } from "./aitRowGroup";
import { newCell } from "./processes";
import './ait.css';
import { AioBoolean } from "components/aio/aioBoolean";
import structuredClone from "@ungap/structured-clone";

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
  const [columnRepeats, setColumnRepeats] = useState<AitColumnRepeat[]>([]);
  const [headerData, setHeaderData] = useState<AitRowGroupData>(tableData.headerData);

  // Basic data checking... useful on load/reload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tableData.rowHeaderColumns === undefined) tableData.rowHeaderColumns = 1; }, [tableData.rowHeaderColumns]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tableData.noRepeatProcessing === undefined) tableData.noRepeatProcessing = false; }, [tableData.noRepeatProcessing]);

  useEffect(() => {
    let headerData: AitRowGroupData = structuredClone(tableData.headerData);
    let cr = Array.from(tableData.headerData.rows[tableData.headerData.rows.length - 1].cells.keys())
      .map(n => { return { columnIndex: n } as AitColumnRepeat })
      ;
    // Simulate repeat of last column
    cr[cr.length - 1].repeatNumbers = [0];
    cr.push({ columnIndex: tableData.headerData.rows[0].cells.length - 1, repeatNumbers: [1] });
    console.log("Setting column repeats");
    setColumnRepeats(cr);
    setHeaderData(headerData);
  }, [tableData.headerData]);

  // Return data
  const returnData = useCallback((tableUpdate: {
    headerData?: AitRowGroupData,
    bodyData?: AitRowGroupData[],
    rowHeaderColumns?: number,
    noRepeatProcessing?: boolean,
  }) => {
    if (typeof (setTableData) !== "function") return;

    console.log("Sending table return");
    const r = {
      headerData: tableUpdate.headerData ?? headerData,
      bodyData: tableUpdate.bodyData ?? tableData.bodyData,
      rowHeaderColumns: tableUpdate.rowHeaderColumns ?? tableData.rowHeaderColumns,
      noRepeatProcessing: tableUpdate.noRepeatProcessing ?? tableData.noRepeatProcessing,
    } as AitTableData;
    setTableData(r);
  }, [setTableData, headerData, tableData.bodyData, tableData.rowHeaderColumns, tableData.noRepeatProcessing]);

  // Update to a rowGroup data
  const updateRowGroup = useCallback((ret: AitRowGroupData, rgi: number) => {
    let newBody: AitRowGroupData[] = [...tableData.bodyData];
    newBody[rgi] = ret;
    returnData({ bodyData: newBody });
  }, [tableData.bodyData, returnData]);

  // Add a new row group to the table body
  const addRowGroup = useCallback((rgi: number) => {
    let newBody: AitRowGroupData[] = [...tableData.bodyData];
    let newRowGroup: AitRowGroupData = {
      aitid: uuidv4(),
      rows: [{
        aitid: uuidv4(),
        cells: [],
      }],
      replacements: [],
    };
    let cols = tableData.bodyData[0].rows[0].cells
      .map(c => c.colSpan ?? 1)
      .reduce((sum, a) => sum + a, 0);
    for (let i = 0; i < cols; i++) newRowGroup.rows[0].cells.push(newCell());
    newBody.splice(rgi + 1, 0, newRowGroup);
    returnData({ bodyData: newBody });
  }, [tableData.bodyData, returnData]);

  // Remove a row group from the table body
  const removeRowGroup = useCallback((rgi: number) => {
    let newRowGroups: AitRowGroupData[] = [...tableData.bodyData];
    newRowGroups.splice(rgi, 1);
    returnData({ bodyData: newRowGroups });
  }, [returnData, tableData.bodyData]);

  // Set up higher options, defaults need to be set
  let higherOptions = useMemo(() => {
    return {
      showCellBorders: showCellBorders,
      noRepeatProcessing: tableData.noRepeatProcessing ?? false,
      rowHeaderColumns: tableData.rowHeaderColumns ?? 1,
    };
  }, [showCellBorders, tableData.noRepeatProcessing, tableData.rowHeaderColumns]) as AitOptionList;

  // Add column 
  const addCol = useCallback((ci: number) => {
    let newBody: AitRowGroupData[] = [...tableData.bodyData];
    newBody = newBody.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(ci + 1, 0, newCell());
        return r;
      });
      return rg;
    });
    let newHeader: AitRowGroupData = { ...tableData.headerData };
    tableData.headerData.rows = newHeader.rows.map(r => {
      r.cells.splice(ci + 1, 0, newCell());
      return r;
    });
    returnData({ headerData: newHeader, bodyData: newBody });
  }, [tableData.bodyData, tableData.headerData, returnData]);

  // Remove column 
  const remCol = useCallback((ci: number) => {
    let newBody: AitRowGroupData[] = [...tableData.bodyData];
    newBody = newBody.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(ci, 1);
        return r;
      });
      return rg;
    });
    let newHeader: AitRowGroupData = { ...tableData.headerData };
    tableData.headerData.rows = newHeader.rows.map(r => {
      // Check for colSpan 
      let c = r.cells[ci];
      let found = false;
      if (c.colSpan === 0) {
        let ciUp = 1;
        while (!found && ciUp <= ci) {
          if (r.cells[ci - ciUp].colSpan > 1) {
            r.cells[ci - ciUp].colSpan--;
            found = true;
          }
          ciUp++;
        }
      }
      r.cells.splice(ci, 1);
      return r;
    });
    let newHeaderColumns = tableData.rowHeaderColumns;
    if (ci < newHeaderColumns) newHeaderColumns--;
    returnData({ headerData: newHeader, bodyData: newBody, rowHeaderColumns: newHeaderColumns });
  }, [tableData.bodyData, tableData.headerData, tableData.rowHeaderColumns, returnData]);

  // Add rowHeader columns
  const addRowHeaderColumn = useCallback(() => {
    // Check new column has not colspan
    if (tableData.rowHeaderColumns === tableData.bodyData[0].rows[0].cells.length - 1) return;
    if (tableData.headerData.rows.some(r => (r.cells[tableData.rowHeaderColumns + 1].colSpan ?? 1) !== 1)) return;
    let newHeaderColumns = tableData.rowHeaderColumns + 1;
    returnData({ rowHeaderColumns: newHeaderColumns });
  }, [returnData, tableData.bodyData, tableData.headerData.rows, tableData.rowHeaderColumns]);

  // Remove rowHeader columns
  const removeRowHeaderColumn = useCallback(() => {
    // Check new column has not colspan
    if (tableData.rowHeaderColumns === 0) return;
    if (tableData.headerData.rows.some(r => (r.cells[tableData.rowHeaderColumns - 1].colSpan ?? 1) !== 1)) return;
    let newHeaderColumns = tableData.rowHeaderColumns - 1;
    returnData({ rowHeaderColumns: newHeaderColumns });
  }, [returnData, tableData.headerData.rows, tableData.rowHeaderColumns]);

  // Print the table
  return (
    <>
      <div
        className="ait-holder"
        style={style}
      >
        <div>
          <div className="ait-tip">
            <div className={`ait-table-options visible`} onClick={() => { setShowOptions(true); }}>
              <span className="ait-tip-top ait-tiptext">Table settings</span>
            </div>
          </div>
          {showOptions &&
            <AsupInternalWindow Title={"Table options"} Visible={showOptions} onClose={() => { setShowOptions(false); }}>
              <div className="aiw-body-row">
                <AioBoolean label="Suppress repeats" value={tableData.noRepeatProcessing} setValue={(ret) => returnData({ noRepeatProcessing: ret })} />
              </div>
              <div className="aiw-body-row">
                <div className={"aio-label"}>Row headers: </div>
                <div className={"aio-ro-value"}>{tableData.rowHeaderColumns ?? 1}</div>
                <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                  {(tableData.rowHeaderColumns ?? 1) < tableData.bodyData[0].rows[0].cells.length - 1
                    ? <div className="aiox-button aiox-plus" onClick={() => addRowHeaderColumn()} />
                    : <div className="aiox-button" />
                  }
                  {(tableData.rowHeaderColumns ?? 1) > 0
                    ? <div className="aiox-button aiox-minus" onClick={() => removeRowHeaderColumn()} />
                    : <div className="aiox-button" />
                  }
                </div>
              </div>
            </AsupInternalWindow>
          }
        </div>
        <table className="ait-table">
          {headerData.rows.length > 0 &&
            <thead>
              <AitBorderRow
                rowLength={columnRepeats.length}
                spaceAfter={true}
                changeColumns={{
                  addColumn: addCol,
                  removeColumn: remCol,
                  showButtons: true,
                }}
                rowHeaderColumns={tableData.rowHeaderColumns}
                columnRepeats={columnRepeats}
              />
              <AitHeader
                aitid={headerData.aitid}
                rows={headerData.rows}
                replacements={headerData.replacements ??
                  [{
                    replacementTexts: [{ level: 0, text: "", spaceAfter: false }],
                    replacementValues: [{ newText: "" }],
                  }]
                }
                setHeaderData={(ret) => returnData({ headerData: ret })}
                higherOptions={{
                  ...higherOptions,
                  tableSection: AitRowType.header,
                  rowGroup: 0,
                }}
                columnRepeats={columnRepeats}
              />
              <AitBorderRow rowLength={columnRepeats.length} spaceBefore={true} noBorder={true} />
            </thead>
          }

          <tbody>
            <AitBorderRow
              rowLength={columnRepeats.length}
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
              rowHeaderColumns={tableData.rowHeaderColumns}
            />
            {
              tableData.bodyData?.map((rowGroup: AitRowGroupData, rgi: number) => {

                /** Protect against missing information on load */
                if (rowGroup.aitid === undefined) rowGroup.aitid = uuidv4();
                /** Default row group options */
                if (rowGroup.replacements === undefined) rowGroup.replacements = [{
                  replacementTexts: [{ text: "", spaceAfter: false }],
                  replacementValues: [{ newText: "" }]
                }];

                return (
                  <AitRowGroup
                    key={rowGroup.aitid}
                    aitid={rowGroup.aitid}
                    rows={rowGroup.rows}
                    replacements={rowGroup.replacements}
                    setRowGroupData={(ret) => { updateRowGroup(ret, rgi) }}
                    higherOptions={{
                      ...higherOptions,
                      tableSection: AitRowType.body,
                      rowGroup: rgi,
                    }}
                    addRowGroup={(rgi) => { addRowGroup(rgi) }}
                    removeRowGroup={rgi > 0 ? (rgi) => { removeRowGroup(rgi) } : undefined}
                    columnRepeats={columnRepeats}
                  />
                );
              })
            }
            <AitBorderRow rowLength={columnRepeats.length} />
          </tbody>
        </table>
      </div>
    </>
  );
};