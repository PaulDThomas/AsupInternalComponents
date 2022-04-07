import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { AioBoolean } from "../aio/aioBoolean";
import { AioReplacement } from "../aio/aioInterface";
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import { newCell } from "../functions/newCell";
import { repeatHeaders } from "../functions/repeatHeaders";
import './ait.css';
import { AitBorderRow } from "./aitBorderRow";
import { AitHeader } from "./aitHeader";
import { AitCellData, AitCellType, AitColumnRepeat, AitOptionList, AitRowData, AitRowGroupData, AitRowType, AitTableData } from "./aitInterface";
import { AitRowGroup } from "./aitRowGroup";

interface AsupInternalTableProps {
  tableData: AitTableData,
  setTableData: (ret: AitTableData) => void,
  externalLists?: AioReplacement[],
  style?: React.CSSProperties,
  showCellBorders?: boolean,
  groupTemplates?: AitRowGroupData[] | false,
}

/**
 * Table view for clinical table data
 * @param props 
 * @returns 
 */
export const AsupInternalTable = ({
  tableData,
  setTableData,
  externalLists,
  style,
  showCellBorders,
  groupTemplates,
}: AsupInternalTableProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [columnRepeats, setColumnRepeats] = useState<AitColumnRepeat[]>();
  const [processedHeader, setProcessedHeader] = useState<AitRowGroupData>(tableData.headerData);

  // Basic data checking... useful on load/reload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tableData.rowHeaderColumns === undefined) tableData.rowHeaderColumns = 1; }, [tableData.rowHeaderColumns]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tableData.noRepeatProcessing === undefined) tableData.noRepeatProcessing = false; }, [tableData.noRepeatProcessing]);

  // Header data processing
  useEffect(() => {
    console.log("Header recalc");
    if (tableData.headerData.rows.length > 0) {
      let headerDataUpdate = repeatHeaders(
        tableData.headerData.rows ?? [],
        tableData.headerData.replacements ?? [],
        tableData.noRepeatProcessing ?? false,
        tableData.rowHeaderColumns ?? 0,
      );
      setProcessedHeader({
        aitid: "processedHeader",
        rows: headerDataUpdate.rows,
        replacements: tableData.headerData.replacements
      });
      setColumnRepeats(headerDataUpdate.columnRepeats);
    }
    // There is no header... 
    else {
      setColumnRepeats(Array.from(
        tableData.bodyData[0].rows[0].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat; }
        ))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData.bodyData[0].rows[0].cells.length, tableData.headerData, tableData.noRepeatProcessing, tableData.rowHeaderColumns]);

  // Return data
  const returnData = useCallback((tableUpdate: {
    headerData?: AitRowGroupData,
    bodyData?: AitRowGroupData[],
    rowHeaderColumns?: number,
    noRepeatProcessing?: boolean,
  }) => {
    if (typeof (setTableData) !== "function") return;
    console.log("Send table data");

    const r = {
      headerData: tableUpdate.headerData ?? tableData.headerData,
      bodyData: tableUpdate.bodyData ?? tableData.bodyData,
      rowHeaderColumns: tableUpdate.rowHeaderColumns ?? tableData.rowHeaderColumns,
      noRepeatProcessing: tableUpdate.noRepeatProcessing ?? tableData.noRepeatProcessing,
    } as AitTableData;
    setTableData(r);
  }, [setTableData, tableData.headerData, tableData.bodyData, tableData.rowHeaderColumns, tableData.noRepeatProcessing]);

  const updateHeader = useCallback((ret: AitRowGroupData) => {
    let retMinusRepeats = {
      aitid: ret.aitid,
      replacements: ret.replacements,
      rows: ret.rows.map(r => {
        return {
          aitid: r.aitid,
          cells: r.cells.filter((c, ci) => (
            !columnRepeats
            || !columnRepeats[ci]
            || !columnRepeats[ci].repeatNumbers
            || columnRepeats[ci].repeatNumbers?.reduce((r, a) => r + a, 0) === 0
          ))
        };
      })
    } as AitRowGroupData;
    returnData({ headerData: retMinusRepeats })
  }, [columnRepeats, returnData]);

  // Update to a rowGroup data
  const updateRowGroup = useCallback((ret: AitRowGroupData, rgi: number) => {
    let newBody: AitRowGroupData[] = [...tableData.bodyData];
    newBody[rgi] = ret;
    returnData({ bodyData: newBody });
  }, [tableData.bodyData, returnData]);

  /**
   * Add a new row group to the table body
   */
  const addRowGroup = useCallback((rgi: number, templateName?: string) => {
    // Create new body, take template if it can be found
    let newRowGroupTemplate: AitRowGroupData = templateName && groupTemplates && groupTemplates.find(g => g.name === templateName)
      ? groupTemplates.find(g => g.name === templateName)!
      : { rows: [{ cells: [] }] }
      ;
    // Ensure new template meets requirements
    let cols = tableData.bodyData[0].rows[0].cells.length;
    let newRowGroup = {
      aitid: uuidv4(),
      replacements: newRowGroupTemplate.replacements,
      rows: newRowGroupTemplate.rows.map(row => {
        let newCells: AitCellData[] = [];
        for (let ci = 0; ci < cols; ci++) {
          newCells.push(
            row.cells[ci] !== undefined
              ? { ...row.cells[ci], aitid: uuidv4() }
              : newCell()
          );
        }
        return {
          aitid: uuidv4(),
          cells: newCells,
        }
      })
    };
    // Copy existing body and splice in new data
    let newBody: AitRowGroupData[] = [...tableData.bodyData];
    newBody.splice(rgi + 1, 0, newRowGroup);
    // Update table body
    returnData({ bodyData: newBody });
  }, [groupTemplates, tableData.bodyData, returnData]);

  // Remove a row group from the table body
  const removeRowGroup = useCallback((rgi: number) => {
    let newRowGroups: AitRowGroupData[] = [...tableData.bodyData];
    newRowGroups.splice(rgi, 1);
    returnData({ bodyData: newRowGroups });
  }, [returnData, tableData.bodyData]);

  // Set up higher options, defaults need to be set
  let higherOptions = useMemo<AitOptionList>(() => {
    let groupTemplateNames =
      groupTemplates === false
        ? ["None"]
        : groupTemplates !== undefined
          ? groupTemplates.filter(g => g.name !== undefined).map(g => g.name).sort((a, b) => a!.localeCompare(b!)) as string[]
          : undefined
      ;
    return {
      showCellBorders: showCellBorders,
      noRepeatProcessing: tableData.noRepeatProcessing ?? false,
      rowHeaderColumns: tableData.rowHeaderColumns ?? 1,
      externalLists: externalLists ?? [],
      groupTemplateNames: groupTemplateNames,
    };
  }, [externalLists, groupTemplates, showCellBorders, tableData.noRepeatProcessing, tableData.rowHeaderColumns]) as AitOptionList;

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
      // Check for colSpan
      if ((r.cells[ci + 1]?.colSpan ?? 1) === 0) {
        // Add in blank cell
        let n = newCell();
        n.colSpan = 0;
        r.cells.splice(ci + 1, 0, n);
        // Change colSpan on previous spanner
        // Check that the target is showing
        let lookback = 0;
        let targetCellBefore = r.cells[ci];
        if (targetCellBefore.colSpan === undefined) targetCellBefore.colSpan = 1;
        while ((targetCellBefore?.colSpan ?? 0) === 0) {
          // Move to previous cell
          lookback++;
          targetCellBefore = r.cells[ci - lookback];
          if (targetCellBefore.colSpan === undefined) targetCellBefore.colSpan = 1;
        }
        targetCellBefore.colSpan = targetCellBefore.colSpan + lookback + 1;

      }
      else {
        r.cells.splice(ci + 1, 0, newCell());
      }
      return r;
    });
    returnData({
      headerData: newHeader,
      bodyData: newBody,
      rowHeaderColumns: (
        ci < tableData.rowHeaderColumns - 1
          ? tableData.rowHeaderColumns + 1
          : tableData.rowHeaderColumns
      )
    });
  }, [tableData.bodyData, tableData.headerData, tableData.rowHeaderColumns, returnData]);

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
    // Update header group
    tableData.headerData.rows = newHeader.rows.map(r => {
      // Check for colSpan 
      let c = r.cells[ci];
      if (c.colSpan === undefined) c.colSpan = 1;
      // Reduce where a hidden cell has been removed
      if (c.colSpan === 0) {
        let lookBack = 1;
        while (r.cells[ci - lookBack].colSpan === 0) {
          lookBack++;
        }
        r.cells[ci - lookBack].colSpan!--;
      }
      // Reveal where an expanded cell has been removed
      else if (c.colSpan > 1) {
        for (let cj = 1; cj < c.colSpan; cj++) {
          r.cells[ci + cj].colSpan = 1;
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

  // Add header if is is not there
  const addNewHeader = useCallback(() => {
    console.log("Adding new header");
    let newRow: AitRowData = {
      aitid: uuidv4(),
      cells: [],
    };
    let cols = tableData.bodyData[0].rows[0].cells.length;
    for (let i = 0; i < cols; i++) newRow.cells.push(newCell(AitCellType.header));
    let newHeader: AitRowGroupData = { ...tableData.headerData, rows: [newRow] };
    returnData({ headerData: newHeader });
  }, [returnData, tableData.bodyData, tableData.headerData]);

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
          {tableData.headerData.rows.length > 0 ?
            <thead>
              <AitBorderRow
                rowLength={columnRepeats?.length ?? tableData.bodyData[0].rows[0].cells.length}
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
                aitid={processedHeader.aitid!}
                rows={processedHeader.rows}
                replacements={processedHeader.replacements ??
                  [{
                    replacementTexts: [{ text: "", spaceAfter: false }],
                    replacementValues: [{ newText: "" }],
                  }]
                }
                setHeaderData={(ret) => updateHeader(ret)}
                higherOptions={{
                  ...higherOptions,
                  tableSection: AitRowType.header,
                  rowGroup: 0,
                }}
                columnRepeats={columnRepeats}
              />
              <AitBorderRow rowLength={columnRepeats?.length ?? tableData.bodyData[0].rows[0].cells.length} spaceBefore={true} noBorder={true} />
            </thead>
            :
            <thead>
              <tr>
                <td className="ait-cell">
                  <div className="ait-aie-holder">
                    <div className="ait-tip" style={{ display: "flex", alignContent: "flex-start" }}>
                      <div
                        className={`ait-options-button ait-options-button-add-row-group`}
                        onClick={addNewHeader}
                      >
                        <span className="ait-tiptext ait-tip-top">Add&nbsp;header</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
          }

          <tbody>
            <AitBorderRow
              rowLength={columnRepeats?.length ?? tableData.bodyData[0].rows[0].cells.length}
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
              columnRepeats={tableData.headerData.rows.length === 0 ? columnRepeats : undefined}
              minWidth={tableData.headerData.rows.length === 0 ? 120 : undefined}
            />
            {
              tableData.bodyData?.map((rowGroup: AitRowGroupData, rgi: number) => {

                /** Protect against missing information on load */
                if (rowGroup.aitid === undefined) rowGroup.aitid = uuidv4();
                rowGroup.rows = rowGroup.rows.map(r => { if (r.aitid === undefined) r.aitid = uuidv4(); return r; });
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
                    addRowGroup={groupTemplates !== false ? (rgi, templateName) => { addRowGroup(rgi, templateName) } : undefined}
                    removeRowGroup={(groupTemplates !== false && tableData.bodyData.length > 1) ? (rgi) => { removeRowGroup(rgi) } : undefined}
                    columnRepeats={columnRepeats}
                  />
                );
              })
            }
            <AitBorderRow rowLength={columnRepeats?.length ?? tableData.bodyData[0].rows[0].cells.length} />
          </tbody>
        </table>
      </div>
    </>
  );
};