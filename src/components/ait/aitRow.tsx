import React, { useCallback, useMemo, useState } from "react";
import { AioBoolean, AioComment, AioIconButton, AioReplacement, AioReplacementList } from '../aio';
import { AsupInternalWindow } from "../aiw";
import { AitBorderRow } from "./aitBorderRow";
import { AitCell } from "./aitCell";
import { AitCellData, AitColumnRepeat, AitLocation, AitOptionList, AitRowData, AitRowType } from "./aitInterface";

interface AitRowProps {
  aitid: string,
  cells: AitCellData[],
  setRowData?: (ret: AitRowData) => void,
  higherOptions: AitOptionList,
  replacements?: AioReplacement[],
  setReplacements?: (ret: AioReplacement[], location: AitLocation) => void,
  rowGroupWindowTitle?: string
  addRowGroup?: (rgi: number, templateName?: string) => void,
  removeRowGroup?: (rgi: number) => void,
  rowGroupComments: string,
  updateRowGroupComments: (ret: string) => void,
  addRow?: (ri: number) => void,
  removeRow?: (ri: number) => void,
  spaceAfter?: boolean,
  addColSpan?: (loc: AitLocation) => void,
  removeColSpan?: (loc: AitLocation) => void,
  addRowSpan?: (loc: AitLocation) => void,
  removeRowSpan?: (loc: AitLocation) => void,
  columnRepeats?: AitColumnRepeat[] | null,
  rowGroupSpace?: boolean,
  setRowGroupSpace?: (ret: boolean) => void,
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
  rowGroupComments,
  updateRowGroupComments,
  addRow,
  removeRow,
  spaceAfter,
  addColSpan,
  removeColSpan,
  addRowSpan,
  removeRowSpan,
  columnRepeats,
  rowGroupSpace,
  setRowGroupSpace,
}: AitRowProps): JSX.Element => {
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection ?? AitRowType.body,
      rowGroup: higherOptions.rowGroup ?? 0,
      row: higherOptions.row ?? 0,
      column: -1,
      repeat: higherOptions.repeatNumber
    }
  }, [higherOptions]);

  // General function to return complied object
  const returnData = useCallback((rowUpdate: { cells?: AitCellData[] }) => {
    if (typeof (setRowData) !== "function") return;
    let r: AitRowData = {
      aitid: aitid,
      cells: rowUpdate.cells ?? cells,
    };
    setRowData!(r);
  }, [setRowData, aitid, cells]);

  const updateCell = useCallback((ret: AitCellData, ci: number) => {
    // Create new object to send back
    let newCells = [...cells];
    newCells[ci] = ret;
    returnData({ cells: newCells });
  }, [cells, returnData]);

  return (
    <>
      <tr>

        {/* Row group options */}
        <td className="ait-cell" width="50px">
          <div className="ait-aie-holder" style={{ display: 'flex', justifyContent: "flex-end", flexDirection: "row" }}>
            {higherOptions.row === 0 && !higherOptions.repeatNumber
              ?
              (<>
                {typeof (removeRowGroup) === "function" &&
                  <AioIconButton
                    tipText={"Remove row group"}
                    iconName={"aiox-minus"}
                    onClick={() => removeRowGroup(location.rowGroup)}
                  />
                }
                {typeof (addRowGroup) === "function" &&
                  <AioIconButton
                    tipText={"Add row group"}
                    iconName={"aiox-plus"}
                    onClick={(ret) => { addRowGroup(location.rowGroup, ret) }}
                    menuItems={higherOptions.groupTemplateNames}
                  />
                }
                {replacements !== undefined &&
                  <AioIconButton
                    tipText='Row group options'
                    iconName='aio-button-row-group'
                    onClick={() => { setShowRowGroupOptions(!showRowGroupOptions) }}
                  />
                }
                {/* Row group options window */}
                {showRowGroupOptions && replacements !== undefined &&
                  <AsupInternalWindow
                    key="RowGroup"
                    Title={(rowGroupWindowTitle ?? "Row group options")}
                    Visible={showRowGroupOptions}
                    onClose={() => { setShowRowGroupOptions(false); }}
                    style={{ maxHeight: "75vh" }}
                  >
                    <div className="aiw-body-row">
                      <AioComment
                        label={"Notes"}
                        value={rowGroupComments}
                        setValue={updateRowGroupComments}
                        commentStyles={higherOptions.commentStyles}
                      />
                    </div>
                    <>
                      {location.tableSection === AitRowType.body && <>
                        <div className="aiw-body-row">
                          <AioBoolean label="Space after group" value={rowGroupSpace ?? true} setValue={setRowGroupSpace} />
                        </div>
                      </>}
                    </>
                    <div className="aiw-body-row">
                      <AioReplacementList
                        label={"Replacements"}
                        replacements={replacements!}
                        setReplacements={typeof setReplacements === "function" ? ret => { setReplacements(ret, location) } : undefined}
                        externalLists={higherOptions.externalLists}
                        dontAskOptions={location.tableSection === AitRowType.header}
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
        {columnRepeats?.map((cr: AitColumnRepeat, ci: number): JSX.Element => {

          // Get cell from column repeat
          let isColumnRepeat = cr.repeatNumbers && cr.repeatNumbers.reduce((r, a) => r + a, 0) > 0;
          // Get cell depending on column repeats;
          let cell: AitCellData = location.tableSection === AitRowType.header
            ? cells[ci]
            : cells[cr.columnIndex]
            ;

          // Missing cell for some reason
          if (!cell && location.tableSection === AitRowType.body) return (
            <td key={`${ci}-b`}>Body cell {cr.columnIndex} not defined</td>
          );
          if (!cell && location.tableSection === AitRowType.header) return (
            <td key={`${ci}-h`}>Header cell {ci} not defined</td>
          );

          // Sort out static options
          let cellHigherOptions: AitOptionList = {
            ...higherOptions,
          } as AitOptionList;

          // Render object
          return (
            <AitCell
              key={isColumnRepeat ? `${cell.aitid!}-${JSON.stringify(cr.repeatNumbers)}` : cell.aitid!}
              aitid={cell.aitid!}
              text={cell.text ?? ""}
              comments={cell.comments ?? ""}
              colSpan={cell.colSpan ?? 1}
              rowSpan={cell.rowSpan ?? 1}
              colWidth={cell.colWidth}
              textIndents={cell.textIndents ?? 0}
              replacedText={cell.replacedText}
              repeatColSpan={cell.repeatColSpan}
              repeatRowSpan={cell.repeatRowSpan}
              higherOptions={cellHigherOptions}
              columnIndex={(location.tableSection === AitRowType.body ? cr.columnIndex : ci)}
              setCellData={(ret) => updateCell(ret, (location.tableSection === AitRowType.body ? cr.columnIndex : ci))}
              readOnly={(cellHigherOptions.repeatNumber !== undefined || isColumnRepeat) ?? false}
              addColSpan={(location.tableSection === AitRowType.body ? cr.columnIndex : ci) + (cell.colSpan ?? 1) < cells.length ? addColSpan : undefined}
              removeColSpan={(cell.colSpan ?? 1) > 1 ? removeColSpan : undefined}
              addRowSpan={
                (cellHigherOptions.row! + (cell.rowSpan ?? 1) < (cellHigherOptions.headerRows ?? 0))
                  || (ci < (higherOptions.rowHeaderColumns ?? 0))
                  ? addRowSpan
                  :
                  undefined}
              removeRowSpan={(cell.rowSpan ?? 1) > 1 ? removeRowSpan : undefined}
            />
          );
        })}
        {/* Row buttons */}
        <td className="ait-cell" width="50px">
          <div className="ait-aie-holder" style={{ display: 'flex', justifyContent: "flex-start", flexDirection: "row" }}>
            {typeof addRow === "function" &&
              <AioIconButton
                tipText="Add row"
                iconName={"aiox-plus"}
                onClick={() => { addRow(location.row) }}
              />
            }
            {typeof removeRow === "function" &&
              <AioIconButton
                tipText="Remove row"
                iconName={"aiox-minus"}
                onClick={() => { removeRow(location.row) }}
              />
            }
          </div>
        </td>
      </tr>
      {/* Additional row if required */}
      {spaceAfter !== false &&
        <AitBorderRow rowLength={cells.length} spaceAfter={true} noBorder={true} />
      }
    </>
  );
}