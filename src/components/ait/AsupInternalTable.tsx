import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AieStyleMap } from "../aie";
import { AioBoolean, AioComment, AioExternalReplacements, AioIconButton } from "../aio";
import { AsupInternalWindow } from "../aiw";
import { bodyPreProcess, headerPreProcess, newCell, newRow } from "../functions";
import { newRowGroup } from "../functions/newRowGroup";
import './ait.css';
import { AitBorderRow } from "./aitBorderRow";
import { AitHeader } from "./aitHeader";
import { AitColumnRepeat, AitOptionList, AitRowGroupData, AitRowType, AitTableData } from "./aitInterface";
import { AitRowGroup } from "./aitRowGroup";

interface AsupInternalTableProps {
  tableData: AitTableData,
  setTableData: (ret: AitTableData) => void,
  externalLists?: AioExternalReplacements[],
  style?: React.CSSProperties,
  showCellBorders?: boolean,
  groupTemplates?: AitRowGroupData[] | false,
  commentStyles?: AieStyleMap,
  cellStyles?: AieStyleMap,
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
  commentStyles,
  cellStyles,
}: AsupInternalTableProps) => {
  // Internal state
  const [showOptions, setShowOptions] = useState(false);
  const [columnRepeats, setColumnRepeats] = useState<AitColumnRepeat[] | null>(null);
  // const [processedHeader, setProcessedHeader] = useState<AitRowGroupData | null>(null);

  // Explode tableData
  const [headerData, setHeaderData] = useState<AitRowGroupData>();
  const [bodyData, setBodyData] = useState<AitRowGroupData[]>();
  const [comments, setComments] = useState<string>();
  const [rowHeaderColumns, setRowHeaderColumns] = useState<number>();
  const [noRepeatProcessing, setNoRepeatProcessing] = useState<boolean>();

  // Pushdown data
  useEffect(() => {
    // console.log("Received table data from page");
    setHeaderData(headerPreProcess(tableData.headerData));
    setBodyData(bodyPreProcess(tableData.bodyData));
    setComments(tableData.comments ?? "");
    setRowHeaderColumns(tableData.rowHeaderColumns ?? 1);
    setNoRepeatProcessing(tableData.noRepeatProcessing ?? false);
  }, [tableData]);

  // Return data
  const returnData = useCallback((tableUpdate: {
    headerData?: AitRowGroupData,
    bodyData?: AitRowGroupData[],
    comments?: string,
    rowHeaderColumns?: number,
    noRepeatProcessing?: boolean,
  }) => {
    if (typeof (setTableData) !== "function") return;
    // console.log("Table return");
    const r = {
      headerData: tableUpdate.headerData ?? headerData,
      bodyData: tableUpdate.bodyData ?? bodyData,
      comments: tableUpdate.comments ?? comments,
      rowHeaderColumns: tableUpdate.rowHeaderColumns ?? rowHeaderColumns,
      noRepeatProcessing: tableUpdate.noRepeatProcessing ?? noRepeatProcessing,
    } as AitTableData;
    setTableData(r);
  }, [setTableData, headerData, bodyData, comments, rowHeaderColumns, noRepeatProcessing]);

  // Update to a rowGroup data
  const updateRowGroup = useCallback((ret: AitRowGroupData, rgi: number) => {
    let newBody: AitRowGroupData[] = [...(bodyData ?? [])];
    newBody[rgi] = ret;
    returnData({ bodyData: newBody });
  }, [bodyData, returnData]);

  /**
   * Add a new row group to the table body
   */
  const addRowGroup = useCallback((rgi: number, templateName?: string) => {
    // Check ok to proceed
    if (bodyData === undefined) return;
    // Create new body, take template if it can be found
    let newRowGroupTemplate: AitRowGroupData = templateName && groupTemplates && groupTemplates.find(g => g.name === templateName)
      ? groupTemplates.find(g => g.name === templateName)!
      : { rows: [{ cells: [] }] }
      ;
    // Ensure new template meets requirements
    let newrg = newRowGroup(bodyData[0].rows[0].cells.length, newRowGroupTemplate);
    // Copy existing body and splice in new data
    let newBody: AitRowGroupData[] = [...(bodyData ?? [])];
    newBody.splice(rgi + 1, 0, newrg);
    // Update table body
    returnData({ bodyData: newBody });
  }, [bodyData, groupTemplates, returnData]);

  // Remove a row group from the table body
  const removeRowGroup = useCallback((rgi: number) => {
    // Check ok to proceed
    if (bodyData === undefined) return;
    // Update bodyData
    let newRowGroups: AitRowGroupData[] = [...bodyData];
    newRowGroups.splice(rgi, 1);
    returnData({ bodyData: newRowGroups });
  }, [bodyData, returnData]);

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
      noRepeatProcessing: noRepeatProcessing ?? false,
      rowHeaderColumns: rowHeaderColumns ?? 1,
      externalLists: externalLists ?? [],
      groupTemplateNames: groupTemplateNames,
      commentStyles: commentStyles,
      cellStyles: cellStyles,
    };
  }, [cellStyles, commentStyles, externalLists, groupTemplates, noRepeatProcessing, rowHeaderColumns, showCellBorders]) as AitOptionList;

  // Add column 
  const addCol = useCallback((ci: number) => {
    // Check ok to proceed
    if (rowHeaderColumns === undefined || headerData === undefined || bodyData === undefined) return;
    // Update body data
    let newBody: AitRowGroupData[] = [...bodyData];
    newBody = newBody.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(ci + 1, 0, newCell());
        return r;
      });
      return rg;
    });
    // Update header group
    let newHeader: AitRowGroupData = { ...headerData };
    headerData.rows = newHeader.rows.map(r => {
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
      rowHeaderColumns: (ci < rowHeaderColumns - 1 ? rowHeaderColumns + 1 : rowHeaderColumns)
    });
  }, [bodyData, headerData, returnData, rowHeaderColumns]);

  // Remove column 
  const remCol = useCallback((ci: number) => {
    // Check ok to proceed
    if (rowHeaderColumns === undefined || headerData === undefined || bodyData === undefined) return;
    // Update body data
    let newBody: AitRowGroupData[] = [...bodyData];
    newBody = newBody.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(ci, 1);
        return r;
      });
      return rg;
    });
    // Update header group
    let newHeader: AitRowGroupData = { ...headerData };
    headerData.rows = newHeader.rows.map(r => {
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
    returnData({ headerData: newHeader, bodyData: newBody, rowHeaderColumns: ci < rowHeaderColumns ? rowHeaderColumns - 1 : rowHeaderColumns });
  }, [bodyData, headerData, returnData, rowHeaderColumns]);

  // Add rowHeader columns
  const addRowHeaderColumn = useCallback(() => {
    // Check ok to proceed
    if (rowHeaderColumns === undefined || headerData === undefined || bodyData === undefined) return;
    // Check new column has not colspan
    if (rowHeaderColumns === bodyData[0].rows[0].cells.length - 1) return;
    if (headerData.rows.some(r => (r.cells[rowHeaderColumns + 1].colSpan ?? 1) !== 1)) return;
    returnData({ rowHeaderColumns: rowHeaderColumns + 1 });
  }, [bodyData, headerData, returnData, rowHeaderColumns]);

  // Remove rowHeader columns
  const removeRowHeaderColumn = useCallback(() => {
    // Check ok to proceed
    if (rowHeaderColumns === 0 || rowHeaderColumns === undefined || headerData === undefined || bodyData === undefined) return;
    if (headerData.rows.some(r => (r.cells[rowHeaderColumns - 1].colSpan ?? 1) !== 1)) return;
    // Check bodyData for cells with rowSpan
    if (bodyData.some(rg => rg.rows.some(r => (r.cells[rowHeaderColumns - 1].rowSpan ?? 1) !== 1))) return;
    returnData({ rowHeaderColumns: rowHeaderColumns - 1 });
  }, [bodyData, headerData, returnData, rowHeaderColumns]);

  // Add header if is is not there
  const addNewHeader = useCallback(() => {
    // Check ok to proceed
    if ((headerData?.rows.length ?? 0) > 0 || bodyData === undefined) return;
    // Create new row 
    let newHeader: AitRowGroupData = { ...headerData, rows: [newRow(bodyData[0].rows[0].cells.length, AitRowType.header)] };
    returnData({ headerData: newHeader });
  }, [bodyData, headerData, returnData]);

  // Show loading if there is nothing to see
  if (bodyData === undefined
    || bodyData.length < 1
    || headerData === undefined
    // || processedHeader === null
    || rowHeaderColumns === undefined
    || noRepeatProcessing === undefined
    || columnRepeats === undefined
  ) {
    return <div>Loading...</div>
  }

  // Print the table
  return (
    <div className="ait-holder" style={style}>
      <div style={{ position: "absolute", top: 0 }}>
        <AioIconButton
          style={{ zIndex: 2 }}
          tipText="Table settings"
          onClick={() => {
            console.log("click");
            setShowOptions(!showOptions)
          }}
          iconName={"aio-button-settings"}
        />
        {showOptions &&
          <AsupInternalWindow Title={"Table options"} Visible={showOptions} onClose={() => { setShowOptions(false); }}>
            <div className="aiw-body-row">
              <AioComment label={"Notes"} value={comments ?? ""} setValue={setComments} commentStyles={higherOptions.commentStyles} />
            </div>
            {headerData.rows.length === 0 ?
              <div className="aiw-body-row">
                <div className={"aio-label"}>Add header section: </div>
                <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                  <div className="aiox-button aiox-plus" onClick={() => addNewHeader()} />
                </div>
              </div>
              : <></>
            }
            <div className="aiw-body-row">
              <AioBoolean label="Suppress repeats" value={noRepeatProcessing ?? false} setValue={setNoRepeatProcessing} />
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Row headers: </div>
              <div className={"aio-ro-value"}>{rowHeaderColumns ?? 1}</div>
              <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                {(rowHeaderColumns ?? 1) < bodyData[0].rows[0].cells.length - 1
                  ? <div className="aiox-button aiox-plus" onClick={() => addRowHeaderColumn()} />
                  : <div className="aiox-button" />
                }
                {(rowHeaderColumns ?? 1) > 0
                  ? <div className="aiox-button aiox-minus" onClick={() => removeRowHeaderColumn()} />
                  : <div className="aiox-button" />
                }
              </div>
            </div>
          </AsupInternalWindow>
        }
      </div>
      <table className="ait-table">
        <thead>
          <AitBorderRow
            rowLength={columnRepeats?.length ?? bodyData[0].rows[0].cells.length}
            spaceAfter={true}
            changeColumns={{
              addColumn: addCol,
              removeColumn: remCol,
              showButtons: true,
            }}
            rowHeaderColumns={rowHeaderColumns}
            columnRepeats={!columnRepeats
              ? Array.from(bodyData[0].rows[0].cells.keys()).map(n => { return { columnIndex: n } })
              : columnRepeats
            }
          />
          <AitHeader
            aitid={headerData.aitid!}
            rows={headerData.rows}
            comments={headerData.comments ?? ""}
            replacements={headerData.replacements ?? []}
            setHeaderData={(ret) => {
              console.group("Header data returned");
              console.log(`${ret.rows.map(r => r.cells.map(c => c.text).join("||")).join("\n")}`);
              console.groupEnd();
              setHeaderData(ret);
            }}
            higherOptions={{
              ...higherOptions,
              tableSection: AitRowType.header,
              rowGroup: 0,
            }}
            columnRepeats={columnRepeats}
            setColumnRepeats={setColumnRepeats}
          />
        </thead>

        <tbody>
          {
            bodyData.map((rowGroup: AitRowGroupData, rgi: number) => {
              return (
                <AitRowGroup
                  key={rowGroup.aitid}
                  aitid={rowGroup.aitid!}
                  rows={rowGroup.rows}
                  comments={rowGroup.comments}
                  replacements={rowGroup.replacements ?? []}
                  spaceAfter={rowGroup.spaceAfter}
                  setRowGroupData={(ret) => { updateRowGroup(ret, rgi) }}
                  higherOptions={{
                    ...higherOptions,
                    tableSection: AitRowType.body,
                    rowGroup: rgi,
                  }}
                  addRowGroup={groupTemplates !== false ? (rgi, templateName) => { addRowGroup(rgi, templateName) } : undefined}
                  removeRowGroup={(groupTemplates !== false && bodyData.length > 1) ? (rgi) => { removeRowGroup(rgi) } : undefined}
                  columnRepeats={!columnRepeats
                    ? Array.from(bodyData[0].rows[0].cells.keys()).map(n => { return { columnIndex: n } })
                    : columnRepeats
                  }
                />
              );
            })
          }
          <AitBorderRow rowLength={columnRepeats?.length ?? bodyData[0].rows[0].cells.length} />
        </tbody>
      </table>
    </div>
  );
};