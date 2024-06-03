import { ContextWindow } from "@asup/context-menu";
import { DraftComponent } from "draft-js";
import { useContext, useMemo } from "react";
import { AsupInternalEditor } from "../aie/AsupInternalEditor";
import { AioExpander } from "../aio";
import { AioComment } from "../aio/aioComment";
import { AioNumber } from "../aio/aioNumber";
import { AitSelectAlign } from "./AitSelectAlign";
import { TableSettingsContext } from "./TableSettingsContext";
import { AitCellData, AitCellType, AitLocation } from "./interface";
import "./aiw.css";

interface AitCellWindowProps<T extends string | object> {
  id: string;
  text: T;
  justifyText?: DraftComponent.Base.DraftTextAlignment | "decimal" | "default";
  comments: T;
  displayColWidth?: number;
  textIndents?: number;
  setCellData?: (ret: AitCellData<T>) => void;
  setColWidth?: (ret: number) => void;
  readOnly: boolean;
  location: AitLocation;
  showCellOptions: boolean;
  setShowCellOptions: (ret: boolean) => void;
  returnData: (cellUpdate: {
    text?: T;
    justifyText?: DraftComponent.Base.DraftTextAlignment | "decimal" | null;
    comments?: T;
    textIndents?: number;
  }) => void;
  cellType: AitCellType;
  rowSpan?: number;
  repeatRowSpan?: number;
  colSpan?: number;
  repeatColSpan?: number;
  addColSpan?: (loc: AitLocation) => void;
  removeColSpan?: (loc: AitLocation) => void;
  addRowSpan?: (loc: AitLocation) => void;
  removeRowSpan?: (loc: AitLocation) => void;
}

export const AitCellWindow = <T extends string | object>({
  id,
  text,
  justifyText,
  comments,
  displayColWidth,
  textIndents,
  setCellData,
  setColWidth,
  readOnly,
  location,
  showCellOptions,
  setShowCellOptions,
  returnData,
  cellType,
  rowSpan,
  repeatColSpan,
  addRowSpan,
  removeRowSpan,
  colSpan,
  repeatRowSpan,
  addColSpan,
  removeColSpan,
}: AitCellWindowProps<T>): JSX.Element => {
  // Context
  const tableSettings = useContext(TableSettingsContext);
  const Editor = tableSettings.Editor ?? AsupInternalEditor;

  const isNotRepeat = useMemo<boolean>(
    () =>
      (location.colRepeat === undefined || location.colRepeat.match(/^[[\]0,]+$/) !== null) &&
      (location.rowRepeat === undefined || location.rowRepeat.match(/^[[\]0,]+$/) !== null),
    [location],
  );

  return (
    <ContextWindow
      id={`${id}-window`}
      key="Cell"
      title={"Cell options"}
      visible={showCellOptions}
      onClose={() => {
        setShowCellOptions(false);
      }}
    >
      <div className="aiw-body-row">
        <AioComment
          id={`${id}-notes`}
          label={"Notes"}
          value={comments}
          setValue={!readOnly && isNotRepeat ? (ret) => returnData({ comments: ret }) : undefined}
          commentStyles={tableSettings.commentStyles}
        />
      </div>
      <div className="aiw-body-row">
        <div className={"aio-label"}>Cell location: </div>
        <div className={"aio-value"}>
          <AioExpander
            id={`${id}-location`}
            inputObject={location}
          />
        </div>
      </div>
      <div className="aiw-body-row">
        <div className={"aio-label"}>Unprocessed text: </div>
        <div className={"aio-input-holder"}>
          <Editor
            id={`${id}-unprocessed`}
            value={text}
            setValue={
              !readOnly && setCellData && isNotRepeat && tableSettings.editable
                ? (ret) => returnData({ text: ret as T })
                : undefined
            }
            editable={!readOnly && setCellData && isNotRepeat && tableSettings.editable}
            className={
              !readOnly && setCellData && isNotRepeat && tableSettings.editable
                ? "can-edit"
                : "readonly"
            }
            showStyleButtons={tableSettings.cellStyles !== undefined}
            styleMap={tableSettings.cellStyles}
            textAlignment={justifyText}
            decimalAlignPercent={tableSettings.decimalAlignPercent}
          />
        </div>
      </div>
      <div className="aiw-body-row">
        <AitSelectAlign
          id={`${id}-justify`}
          align={justifyText}
          setAlign={
            !readOnly && isNotRepeat ? (ret) => returnData({ justifyText: ret }) : undefined
          }
        />
      </div>
      <div className="aiw-body-row">
        <AioNumber
          id={`${id}-width`}
          label="Width (mm)"
          value={displayColWidth ?? tableSettings.defaultCellWidth}
          setValue={!readOnly && setColWidth ? (ret) => setColWidth(ret) : undefined}
        />
      </div>
      {cellType === AitCellType.header && (
        <>
          <div className="aiw-body-row">
            <div className={"aio-label"}>Row span: </div>
            <div className={"aio-ro-value"}>{repeatRowSpan ?? rowSpan ?? 1}</div>
            <div
              className={"aiox-button-holder"}
              style={{ padding: "2px" }}
            >
              {repeatRowSpan === undefined &&
              !readOnly &&
              isNotRepeat &&
              addRowSpan &&
              colSpan === 1 ? (
                <div
                  id={`${id}-add-rowspan`}
                  className="aiox-button aiox-plus"
                  onClick={() => addRowSpan(location)}
                />
              ) : (
                <div className="aiox-button" />
              )}
              {repeatRowSpan === undefined && !readOnly && isNotRepeat && removeRowSpan && (
                <div
                  id={`${id}-remove-rowspan`}
                  className="aiox-button aiox-minus"
                  onClick={() => removeRowSpan(location)}
                />
              )}
            </div>
          </div>
          <div className="aiw-body-row">
            <div className={"aio-label"}>Column span: </div>
            <div className={"aio-ro-value"}>{repeatColSpan ?? colSpan ?? 1}</div>
            <div
              className={"aiox-button-holder"}
              style={{ padding: "2px" }}
            >
              {repeatColSpan === undefined &&
              !readOnly &&
              isNotRepeat &&
              addColSpan &&
              rowSpan === 1 ? (
                <div
                  id={`${id}-add-colspan`}
                  className="aiox-button aiox-plus"
                  onClick={() => addColSpan(location)}
                />
              ) : (
                <div className="aiox-button" />
              )}
              {repeatColSpan === undefined && !readOnly && isNotRepeat && removeColSpan && (
                <div
                  id={`${id}-remove-colspan`}
                  className="aiox-button aiox-minus"
                  onClick={() => removeColSpan(location)}
                />
              )}
            </div>
          </div>
          <div className="aiw-body-row">
            <AioNumber
              id={`${id}-width`}
              label="Width (mm)"
              value={displayColWidth ?? tableSettings.defaultCellWidth}
              setValue={
                !readOnly && isNotRepeat && setColWidth ? (ret) => setColWidth(ret) : undefined
              }
            />
          </div>
        </>
      )}
      {cellType === AitCellType.rowHeader && (
        <>
          <div className="aiw-body-row">
            <AioNumber
              id={`${id}-indents`}
              label="Text indents"
              value={textIndents ?? 0}
              setValue={
                !readOnly && isNotRepeat
                  ? (ret) => {
                      returnData({ textIndents: ret });
                    }
                  : undefined
              }
            />
          </div>
        </>
      )}
    </ContextWindow>
  );
};
