import { cloneDeep } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { AieStyleMap } from "../aie";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";
import { AioExternalSingle, AioIconButton } from "../aio";
import { AifOptionsWindow } from "./AibOptionsWindow";
import styles from "./aib.module.css";
import { AifBlockLine, AifLineType } from "./aibInterface";

interface AibLineDisplayProps<T extends string | object> {
  id: string;
  aifid?: string;
  displayType: AifLineType;
  left?: T | null;
  center?: T | null;
  right?: T | null;
  externalSingles?: AioExternalSingle[];
  addBelow?: boolean;
  canEdit?: boolean;
  canRemove?: boolean;
  canMove?: boolean;
  canChangeType?: boolean;
  setLine?: (ret: AifBlockLine<T>) => void;
  addLine?: () => void;
  removeLine?: () => void;
  style?: React.CSSProperties;
  styleMap?: AieStyleMap;
  Editor: (props: AsupInternalEditorProps<T>) => JSX.Element;
  replaceTextInT: (s: T, oldPhrase: string, newPhrase: string) => T;
}

export const AibLineDisplay = <T extends string | object>({
  id,
  aifid,
  displayType,
  left,
  center,
  right,
  externalSingles,
  addBelow,
  canEdit,
  canRemove,
  canMove,
  canChangeType = false,
  setLine,
  addLine,
  removeLine,
  style,
  styleMap,
  Editor,
  replaceTextInT,
}: AibLineDisplayProps<T>): JSX.Element => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const returnData = useCallback(
    (lineUpdate: { left?: T | null; center?: T | null; right?: T | null }) => {
      if (setLine) {
        const newLine: AifBlockLine<T> = {
          aifid: aifid,
          lineType: displayType,
          left: lineUpdate.left ? lineUpdate.left : left ?? null,
          center: lineUpdate.center ? lineUpdate.center : center ?? null,
          right: lineUpdate.right ? lineUpdate.right : right ?? null,
          addBelow: addBelow,
          canEdit: canEdit,
          canRemove: canRemove,
          canMove: canMove,
          canChangeType: canChangeType,
        };
        setLine(newLine);
      }
    },
    [
      addBelow,
      aifid,
      canChangeType,
      canEdit,
      canMove,
      canRemove,
      center,
      displayType,
      left,
      right,
      setLine,
    ],
  );

  // Update for replacements
  const processReplacement = useCallback(
    (input?: T | null): T | null | undefined => {
      if (input === undefined || input === null) return input;
      // Process external replacements
      let ret = cloneDeep(input);
      externalSingles?.forEach((repl) => {
        if (repl.oldText !== undefined && repl.oldText !== "" && repl.newText !== undefined)
          ret = replaceTextInT(ret, repl.oldText, repl.newText);
      });
      return ret;
    },
    [externalSingles, replaceTextInT],
  );

  // Set up post replacement view
  const displayLeft = useMemo(() => processReplacement(left), [left, processReplacement]);
  const displayCenter = useMemo(
    () => (typeof center === "string" ? (processReplacement(center) as T) : center),
    [center, processReplacement],
  );
  const displayRight = useMemo(
    () => (typeof right === "string" ? (processReplacement(right) as T) : right),
    [right, processReplacement],
  );

  return (
    <div
      className={[
        styles.aibLine,
        canEdit === false || typeof setLine !== "function" ? styles.aibReadOnly : "",
      ]
        .filter((c) => c !== "")
        .join(" ")}
    >
      {showOptions && (
        <AifOptionsWindow
          id={`${id}-options-window`}
          onClose={() => setShowOptions(false)}
          left={left}
          center={center}
          right={right}
          returnData={typeof setLine === "function" ? returnData : undefined}
          canChangeType={canChangeType}
          styleMap={styleMap}
          Editor={Editor}
        />
      )}

      <div className={styles.aibLineButtons} />
      <div
        className={styles.aibLineItemHolder}
        style={{ ...style }}
      >
        {[AifLineType.leftOnly, AifLineType.leftAndRight, AifLineType.leftCenterAndRight].includes(
          displayType,
        ) && (
          <div
            className={[styles.aibLineItem, displayLeft !== left ? styles.aibReadOnly : ""]
              .filter((c) => c !== "")
              .join(" ")}
            style={{
              width:
                displayType === AifLineType.leftOnly
                  ? "100%"
                  : displayType === AifLineType.leftAndRight
                    ? "50%"
                    : "33%",
            }}
          >
            <Editor
              id={`${id}-left-text`}
              value={displayLeft ?? ("" as T)}
              setValue={
                typeof setLine === "function" && displayLeft === left
                  ? (ret) => returnData({ left: ret })
                  : undefined
              }
              showStyleButtons={true}
              styleMap={styleMap}
            />
          </div>
        )}
        {[AifLineType.centerOnly, AifLineType.leftCenterAndRight].includes(displayType) && (
          <div
            className={[styles.aibLineItem, displayCenter !== center ? styles.aibReadOnly : ""]
              .filter((c) => c !== "")
              .join(" ")}
            style={{ flexGrow: 1 }}
          >
            <Editor
              id={`${id}-center-text`}
              value={displayCenter ?? ("" as T)}
              setValue={
                typeof setLine === "function" && displayCenter === center
                  ? (ret) => returnData({ center: ret })
                  : undefined
              }
              textAlignment={"center"}
              showStyleButtons={true}
              styleMap={styleMap}
            />
          </div>
        )}
        {[AifLineType.leftAndRight, AifLineType.leftCenterAndRight].includes(displayType) && (
          <div
            className={[styles.aibLineItem, displayRight !== right ? styles.aibReadOnly : ""]
              .filter((c) => c !== "")
              .join(" ")}
            style={{
              width: displayType === AifLineType.leftAndRight ? "50%" : "33%",
            }}
          >
            <Editor
              id={`${id}-right-text`}
              value={displayRight ?? ("" as T)}
              setValue={
                typeof setLine === "function" && displayRight === right
                  ? (ret) => returnData({ right: ret })
                  : undefined
              }
              textAlignment={"right"}
              showStyleButtons={styleMap !== undefined}
              styleMap={styleMap}
            />
          </div>
        )}
      </div>

      <div className={styles.aibLineButtons}>
        <AioIconButton
          id={`${id}-show-options`}
          onClick={() => setShowOptions(!showOptions)}
          iconName={"aio-button-row-options"}
          tipText="Options"
        />
        {typeof addLine === "function" ? (
          <AioIconButton
            id={`${id}-add-line`}
            onClick={addLine}
            iconName={"aiox-plus"}
            tipText="Add line"
          />
        ) : (
          <div style={{ width: "18px" }} />
        )}
        {typeof removeLine === "function" && (
          <AioIconButton
            id={`${id}-remove-line`}
            onClick={removeLine}
            iconName={"aiox-minus"}
            tipText="Remove line"
          />
        )}
      </div>
    </div>
  );
};
