import React, { useCallback, useContext, useState } from "react";
import { AioBoolean, AioComment, AioIconButton, AioReplacement, AioReplacementList } from '../aio';
import { AsupInternalWindow } from "../aiw";
import { AitBorderRow } from "./aitBorderRow";
import { AitCell } from "./aitCell";
import { TableSettingsContext } from "./aitContext";
import { AitCellData, AitColumnRepeat, AitLocation, AitRowData, AitRowType } from "./aitInterface";

interface AitRowProps {
  aitid: string,
  cells: AitCellData[],
  setRowData?: (ret: AitRowData) => void,
  location: AitLocation,
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
  rowGroupSpace?: boolean,
  setRowGroupSpace?: (ret: boolean) => void,
}

export const AitRow = ({
  aitid,
  cells,
  setRowData,
  location,
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
  rowGroupSpace,
  setRowGroupSpace,
}: AitRowProps): JSX.Element => {

  const tableSettings = useContext(TableSettingsContext);
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);

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
            {location.row === 0 && !location.rowRepeat
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
                    menuItems={tableSettings.groupTemplateNames}
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
                        commentStyles={tableSettings.commentStyles}
                      />
                    </div>
                    <>
                      {location.tableSection === AitRowType.body && <>
                        <div className="aiw-body-row">
                          <AioBoolean label="Space after group" value={rowGroupSpace ?? false} setValue={setRowGroupSpace} />
                        </div>
                      </>}
                    </>
                    <div className="aiw-body-row">
                      <AioReplacementList
                        label={"Replacements"}
                        replacements={replacements!}
                        setReplacements={typeof setReplacements === "function" ? ret => { setReplacements(ret, location) } : undefined}
                        externalLists={tableSettings.externalLists}
                        dontAskSpace={location.tableSection === AitRowType.header}
                        dontAskTrail={location.tableSection === AitRowType.header}
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
        {cells.map((cell: AitCellData, ci: number): JSX.Element => {

          // Get cell from column repeat
          let cr: AitColumnRepeat | undefined = Array.isArray(tableSettings.columnRepeats) && tableSettings.columnRepeats.length > ci ? tableSettings.columnRepeats[ci] : undefined;
          let isColumnRepeat = (cr !== undefined && cr.colRepeat !== undefined) ? cr.colRepeat.match(/^[[\]0,]+$/) === null : false;

          // Render object
          return (
            <AitCell
              key={isColumnRepeat ? `${cell.aitid!}-${JSON.stringify(cr!.colRepeat!)}` : cell.aitid!}
              aitid={cell.aitid!}
              text={cell.text ?? ""}
              justifyText={cell.justifyText}
              comments={cell.comments ?? ""}
              colSpan={cell.colSpan ?? 1}
              rowSpan={cell.rowSpan ?? 1}
              colWidth={cell.colWidth}
              textIndents={cell.textIndents ?? 0}
              replacedText={cell.replacedText}
              repeatColSpan={cell.repeatColSpan}
              repeatRowSpan={cell.repeatRowSpan}
              spaceAfterSpan={cell.spaceAfterSpan}
              location={{...location, column: cr?.columnIndex ?? -1, colRepeat: cr?.colRepeat}}
              setCellData={!isColumnRepeat && typeof addRow === "function" ? (ret) => updateCell(ret, ci) : undefined}
              readOnly={isColumnRepeat || typeof addRow !== "function"}
              addColSpan={!isColumnRepeat && typeof addRow === "function" && ci + (cell.colSpan ?? 1) < cells.length ? addColSpan : undefined}
              removeColSpan={(cell.colSpan ?? 1) > 1 ? removeColSpan : undefined}
              addRowSpan={
                (location.row! + (cell.rowSpan ?? 1) < (tableSettings.headerRows ?? 0)) || (ci < (tableSettings.rowHeaderColumns ?? 0))
                  ? addRowSpan
                  : undefined}
              removeRowSpan={(cell.rowSpan ?? 1) > 1 ? removeRowSpan : undefined}
              spaceAfterRepeat={cell.spaceAfterRepeat}
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
        <AitBorderRow spaceAfter={true} noBorder={true} />
      }
    </>
  );
}