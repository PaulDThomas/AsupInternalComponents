import { ContextWindow } from "@asup/context-menu";
import { useCallback, useContext, useMemo, useState } from "react";
import { AioBoolean, AioComment, AioIconButton, AioReplacement, AioReplacementList } from "../aio";
import { AitBorderRow } from "./AitBorderRow";
import { AitHeaderCell } from "./AitHeaderCell";
import { TableSettingsContext } from "./TableSettingsContext";
import {
  AitColumnRepeat,
  AitHeaderCellData,
  AitHeaderRowData,
  AitLocation,
  AitRowData,
  AitRowType,
} from "./interface";

interface AitHeaderRowProps<T extends string | object> {
  id: string;
  aitid: string;
  cells: AitHeaderCellData<T>[];
  setRowData?: (ret: AitHeaderRowData<T>) => void;
  setColWidth?: (colNo: number, colWidth: number) => void;
  location: AitLocation;
  replacements?: AioReplacement[];
  setReplacements?: (ret: AioReplacement[], location: AitLocation) => void;
  rowGroupWindowTitle?: string;
  addRowGroup?: (rgi: number, templateName?: string) => void;
  removeRowGroup?: (rgi: number) => void;
  rowGroupComments: string;
  updateRowGroupComments?: (ret: string) => void;
  addRow?: (ri: number) => void;
  removeRow?: (ri: number) => void;
  spaceAfter?: boolean;
  addColSpan?: (loc: AitLocation) => void;
  removeColSpan?: (loc: AitLocation) => void;
  addRowSpan?: (loc: AitLocation) => void;
  removeRowSpan?: (loc: AitLocation) => void;
  rowGroupSpace?: boolean;
  setRowGroupSpace?: (ret: boolean) => void;
}

export const AitHeaderRow = <T extends string | object>({
  id,
  aitid,
  cells,
  setRowData,
  setColWidth,
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
}: AitHeaderRowProps<T>): JSX.Element => {
  const tableSettings = useContext(TableSettingsContext);
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const editable = useMemo(() => {
    return tableSettings.editable && typeof setRowData === "function";
  }, [setRowData, tableSettings.editable]);

  // General function to return complied object
  const returnData = useCallback(
    (rowUpdate: { cells?: AitHeaderCellData<T>[] }) => {
      if (editable && setRowData) {
        const r: AitRowData<T> = {
          aitid: aitid,
          cells: rowUpdate.cells ?? cells,
        };
        setRowData(r);
      }
    },
    [editable, setRowData, aitid, cells],
  );

  const updateCell = useCallback(
    (ret: AitHeaderCellData<T>, ci: number) => {
      // Create new object to send back
      const newCells = [...cells];
      newCells[ci] = ret;
      returnData({ cells: newCells });
    },
    [cells, returnData],
  );

  return (
    <>
      <tr id={`${id}`}>
        {/* Row group options */}
        <td
          className="ait-cell"
          width="50px"
        >
          <div
            className="ait-aie-holder"
            style={{ display: "flex", justifyContent: "flex-end", flexDirection: "row" }}
          >
            {location.row === 0 && !location.rowRepeat ? (
              <>
                {editable && typeof removeRowGroup === "function" && (
                  <AioIconButton
                    id={`${id}-remove-rowgroup`}
                    tipText={"Remove row group"}
                    iconName={"aiox-minus"}
                    onClick={() => removeRowGroup(location.rowGroup)}
                  />
                )}
                {editable && typeof addRowGroup === "function" && (
                  <AioIconButton
                    id={`${id}-add-rowgroup`}
                    tipText={"Add row group"}
                    iconName={"aiox-plus"}
                    onClick={(ret) => {
                      addRowGroup(location.rowGroup, ret);
                    }}
                    menuItems={tableSettings.groupTemplateNames}
                  />
                )}
                <AioIconButton
                  id={`${id}-rowgroup-options`}
                  tipText="Row group options"
                  iconName="aio-button-row-group"
                  onClick={() => {
                    setShowRowGroupOptions(!showRowGroupOptions);
                  }}
                />
                {/* Row group options window */}
                {showRowGroupOptions && (
                  <ContextWindow
                    id={`${id}-rowgroup-options-window`}
                    key="RowGroup"
                    title={rowGroupWindowTitle ?? "Row group options"}
                    visible={showRowGroupOptions}
                    onClose={() => {
                      setShowRowGroupOptions(false);
                    }}
                    style={{ maxHeight: "75vh" }}
                  >
                    <div className="aiw-body-row">
                      <AioComment
                        id={`${id}-rowgroup-comment`}
                        label={"Notes"}
                        value={rowGroupComments}
                        setValue={editable ? updateRowGroupComments : undefined}
                        commentStyles={tableSettings.commentStyles}
                      />
                    </div>
                    <>
                      {location.tableSection === AitRowType.body && (
                        <>
                          <div className="aiw-body-row">
                            <AioBoolean
                              id={`${id}-spaceafter-group`}
                              label="Space after group"
                              value={rowGroupSpace ?? false}
                              setValue={editable ? setRowGroupSpace : undefined}
                            />
                          </div>
                        </>
                      )}
                    </>
                    <div className="aiw-body-row">
                      <AioReplacementList
                        id={`${id}-rowgroup-replacements`}
                        label={"Replacements"}
                        replacements={replacements}
                        setReplacements={
                          editable && typeof setReplacements === "function"
                            ? (ret) => {
                                setReplacements(ret, location);
                              }
                            : undefined
                        }
                        externalLists={tableSettings.externalLists}
                        dontAskSpace={location.tableSection === AitRowType.header}
                        dontAskTrail={location.tableSection === AitRowType.header}
                      />
                    </div>
                  </ContextWindow>
                )}
              </>
            ) : null}
          </div>
        </td>

        {/* All cells from row */}
        {cells.map((cell: AitHeaderCellData<T>, ci: number): JSX.Element => {
          // Get cell from column repeat
          const cr: AitColumnRepeat | undefined =
            Array.isArray(tableSettings.columnRepeats) && tableSettings.columnRepeats.length > ci
              ? tableSettings.columnRepeats[ci]
              : undefined;
          const isColumnRepeat =
            cr !== undefined && cr.colRepeat !== undefined
              ? cr.colRepeat.match(/^[[\]0,]+$/) === null
              : false;

          // Render object
          return (
            <AitHeaderCell
              id={`${id}-cell-${ci}`}
              key={
                isColumnRepeat && cr ? `${cell.aitid}-${JSON.stringify(cr.colRepeat)}` : cell.aitid
              }
              aitid={cell.aitid ?? `cell-${ci}`}
              text={cell.text}
              justifyText={cell.justifyText}
              comments={cell.comments ?? ""}
              colSpan={cell.colSpan ?? 1}
              rowSpan={cell.rowSpan ?? 1}
              colWidth={cell.colWidth}
              displayColWidth={
                cell.colSpan === 1
                  ? cell.colWidth
                  : cells
                      .slice(ci, ci + (cell.colSpan ?? 1))
                      .map((c) => c.colWidth ?? tableSettings.defaultCellWidth)
                      .reduce((a, b) => a + b, 0)
              }
              textIndents={cell.textIndents ?? 0}
              replacedText={cell.replacedText}
              repeatColSpan={cell.repeatColSpan}
              spaceAfterSpan={cell.spaceAfterSpan}
              location={{ ...location, column: cr?.columnIndex ?? -1, colRepeat: cr?.colRepeat }}
              setCellData={
                editable && !isColumnRepeat && typeof addRow === "function"
                  ? (ret) => updateCell(ret, ci)
                  : undefined
              }
              setColWidth={
                editable && setColWidth && cell.colSpan === 1
                  ? (ret) => setColWidth(ci, ret)
                  : undefined
              }
              readOnly={!editable || isColumnRepeat || typeof addRow !== "function"}
              addColSpan={
                editable &&
                !isColumnRepeat &&
                typeof addRow === "function" &&
                ci + (cell.colSpan ?? 1) < cells.length
                  ? addColSpan
                  : undefined
              }
              removeColSpan={editable && (cell.colSpan ?? 1) > 1 ? removeColSpan : undefined}
              addRowSpan={
                editable &&
                (location.row + (cell.rowSpan ?? 1) < (tableSettings.headerRows ?? 0) ||
                  ci < (tableSettings.rowHeaderColumns ?? 0))
                  ? addRowSpan
                  : undefined
              }
              removeRowSpan={editable && (cell.rowSpan ?? 1) > 1 ? removeRowSpan : undefined}
              spaceAfterRepeat={cell.spaceAfterRepeat}
            />
          );
        })}
        {/* Row buttons */}
        <td
          className="ait-cell"
          width="50px"
        >
          <div
            className="ait-aie-holder"
            style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row" }}
          >
            {editable && addRow && (
              <AioIconButton
                id={`${id}-add-row`}
                tipText="Add row"
                iconName={"aiox-plus"}
                onClick={() => {
                  addRow(location.row);
                }}
              />
            )}
            {editable && removeRow && (
              <AioIconButton
                id={`${id}-remove-row`}
                tipText="Remove row"
                iconName={"aiox-minus"}
                onClick={() => {
                  removeRow(location.row);
                }}
              />
            )}
          </div>
        </td>
      </tr>
      {/* Additional row if required */}
      {spaceAfter !== false && (
        <AitBorderRow
          id={`${id}-spaceafter-row`}
          spaceAfter={true}
          noBorder={true}
        />
      )}
    </>
  );
};
