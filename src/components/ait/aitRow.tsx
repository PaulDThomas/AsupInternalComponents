import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from "uuid";
import { AioReplacement } from "components/aio/aioInterface";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
import { AioReplacementDisplay } from "components/aio/aioReplacementDisplay";
import { AitRowData, AitCellData, AitOptionList, AitLocation, AitColumnRepeat, AitRowType } from "./aitInterface";
import { AitCell } from "./aitCell";
import { objEqual } from "./processes";
import { AitBorderRow } from "./aitBorderRow";

interface AitRowProps {
  aitid: string,
  cells: AitCellData[],
  setRowData?: (ret: AitRowData) => void,
  higherOptions: AitOptionList,
  replacements: AioReplacement[],
  setReplacements?: (ret: AioReplacement[], location: AitLocation) => void,
  rowGroupWindowTitle?: string
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
  addRow?: (ri: number) => void,
  removeRow?: (ri: number) => void,
  spaceAfter: boolean,
  addColSpan?: (loc: AitLocation) => void,
  removeColSpan?: (loc: AitLocation) => void,
  addRowSpan?: (loc: AitLocation) => void,
  removeRowSpan?: (loc: AitLocation) => void,
  columnRepeats?: AitColumnRepeat[],
}

export const AitRow = ({
  aitid,
  cells,
  setRowData,
  higherOptions,
  replacements,
  setReplacements,
  rowGroupWindowTitle,
  addRowGroup,
  removeRowGroup,
  addRow,
  removeRow,
  spaceAfter,
  addColSpan,
  removeColSpan,
  addRowSpan,
  removeRowSpan,
  columnRepeats,
}: AitRowProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowData>(structuredClone({ aitid: aitid, cells: cells }));
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection,
      rowGroup: higherOptions.rowGroup,
      row: higherOptions.row,
      column: -1,
      repeat: (higherOptions.repeatNumber ?? []).join(",")
    }
  }, [higherOptions]);

  // General function to return complied object
  const returnData = useCallback((rowUpdate: { cells?: AitCellData[] }) => {
    if (typeof (setRowData) !== "function") return;
    let r: AitRowData = {
      aitid: aitid,
      cells: rowUpdate.cells ?? cells,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `ROWCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      // console.log(`ROWRETURN: ${diffs}`);
      setRowData!(r);
      setLastSend(structuredClone(r));
    }
  }, [setRowData, aitid, cells, lastSend, location]);

  const updateCell = useCallback((ret, ci) => {
    // Create new object to send back
    let newCells = [...cells];
    newCells[ci] = ret;
    returnData({ cells: newCells });
  }, [cells, returnData]);

  return (
    <>
      <tr>

        {/* Row group options */}
        <td className="ait-cell">
          <div className="ait-aie-holder">
            {higherOptions.row === 0
              ?
              (<>
                {replacements !== undefined &&
                  <div className="ait-tip">
                    <div
                      className={`ait-options-button ait-options-button-row-group`}
                      onClick={(e) => { setShowRowGroupOptions(true) }}
                    >
                      <span className="ait-tiptext ait-tip-top">Row&nbsp;group&nbsp;options</span>
                    </div>
                  </div>
                }
                {typeof (addRowGroup) === "function" &&
                  <div className="ait-tip" style={{ display: "flex", alignContent: "flex-start" }}>
                    <div
                      className={`ait-options-button ait-options-button-add-row-group`}
                      onClick={(e) => { addRowGroup(location.rowGroup) }}
                    >
                      <span className="ait-tiptext ait-tip-top">Add&nbsp;row&nbsp;group</span>
                    </div>
                  </div>
                }
                {typeof (removeRowGroup) === "function" &&
                  <div className="ait-tip" style={{ display: "flex", alignContent: "flex-start" }}>
                    <div
                      className={`ait-options-button ait-options-button-remove-row-group`}
                      onClick={(e) => { removeRowGroup(location.rowGroup) }}
                    >
                      <span className="ait-tiptext ait-tip-top">Remove&nbsp;row&nbsp;group</span>
                    </div>
                  </div>
                }
                {/* Row group options window */}
                {showRowGroupOptions && replacements !== undefined &&
                  <AsupInternalWindow key="RowGroup" Title={(rowGroupWindowTitle ?? "Row group options")} Visible={showRowGroupOptions} onClose={() => { setShowRowGroupOptions(false); }}>
                    <div className="aiw-body-row">
                      <AioReplacementDisplay
                        replacements={replacements!}
                        setReplacements={typeof setReplacements === "function" ? ret => { setReplacements(ret, location) } : undefined}
                        dontAskSpace={location.tableSection === AitRowType.header}
                      />
                    </div>
                  </AsupInternalWindow>
                }
              </>)
              :
              null
            }
          </div>
        </td>

        {/* All cells from row */}
        {columnRepeats?.map((cr: AitColumnRepeat, ci: number, crs): JSX.Element => {

          // Get cell from column repeat
          let isColumnRepeat = cr.repeatNumbers && cr.repeatNumbers.reduce((r, a) => r + a, 0) > 0;
          if (isColumnRepeat && !cells[cr.columnIndex]) return (<td key={ci}>Cell {ci} not found!</td>);
          // Take the cell from the processed array in headers, unprocessed in body
          let cell: AitCellData = location.tableSection === AitRowType.header
            ? cells[ci]
            : !isColumnRepeat
              ? cells[cr.columnIndex]
              : {
                ...cells[cr.columnIndex],
                aitid: `${cells[cr.columnIndex].aitid}-${JSON.stringify(cr.repeatNumbers)}`,
              } as AitCellData
            ;
          if (isColumnRepeat && location.tableSection === AitRowType.header) {
            cell.aitid = `${cells[cr.columnIndex].aitid}-${JSON.stringify(cr.repeatNumbers)}`;
          }
          if (!cell) return (<td key={ci}>Cell {location.tableSection === AitRowType.header ? ci : cr.columnIndex} not defined</td>);

          // Sort out static options
          let cellHigherOptions: AitOptionList = {
            ...higherOptions,
          } as AitOptionList;
          // Add defaults - can happen on loaded information
          if (cell.aitid === undefined) cell.aitid = uuidv4();
          if (cell.rowSpan === undefined) cell.rowSpan = 1;
          if (cell.colSpan === undefined) cell.colSpan = 1;
          if (cell.textIndents === undefined) cell.textIndents = 0;

          // Render object
          return (
            <AitCell
              key={cell.aitid}
              aitid={cell.aitid}
              text={cell.text}
              colSpan={cell.colSpan}
              rowSpan={cell.rowSpan}
              colWidth={cell.colWidth}
              textIndents={cell.textIndents}
              replacedText={cell.replacedText}
              repeatColSpan={cell.repeatColSpan}
              repeatRowSpan={cell.repeatRowSpan}
              higherOptions={cellHigherOptions}
              columnIndex={(location.tableSection === AitRowType.body ? cr.columnIndex : ci)}
              setCellData={(ret) => updateCell(ret, (location.tableSection === AitRowType.body ? cr.columnIndex : ci))}
              readOnly={(
                (cellHigherOptions.repeatNumber && cellHigherOptions.repeatNumber?.reduce((r, a) => r + a, 0) > 0)
                || isColumnRepeat
              ) ?? false}
              addColSpan={(location.tableSection === AitRowType.body ? cr.columnIndex : ci) + cell.colSpan < cells.length ? addColSpan : undefined}
              removeColSpan={cell.colSpan > 1 ? removeColSpan : undefined}
              addRowSpan={cellHigherOptions.row + cell.rowSpan < cellHigherOptions.headerRows ? addRowSpan : undefined}
              removeRowSpan={cell.rowSpan > 1 ? removeRowSpan : undefined}
            />
          );
        })}
        {/* Row buttons */}
        <td className="ait-cell">
          <div className="ait-aie-holder">
            {typeof addRow === "function" && ((higherOptions.repeatNumber?.reduce((r, a) => r + a, 0) ?? 0) === 0) &&
              <div className="ait-tip ait-tip-rhs">
                <div
                  className={`ait-options-button ait-options-button-add-row`}
                  onClick={() => { addRow(location.row) }}
                >
                  <span className="ait-tiptext ait-tip-top">Add&nbsp;row</span>
                </div>
              </div>
            }
            {typeof removeRow === "function" && ((higherOptions.repeatNumber?.reduce((r, a) => r + a, 0) ?? 0) === 0) &&
              <div className="ait-tip ait-tip-rhs">
                <div
                  className={`ait-options-button ait-options-button-remove-row`}
                  onClick={() => { removeRow(location.row) }}
                >
                  <span className="ait-tiptext ait-tip-top">Remove&nbsp;row</span>
                </div>
              </div>
            }
          </div>
        </td>
      </tr>
      {/* Additional row if required */}
      {spaceAfter && <AitBorderRow rowLength={cells.length} spaceAfter={true} noBorder={true} />}
    </>
  );
}