import React, { useCallback, useMemo, useState } from "react";
import { AieStyleMap, AsupInternalEditor } from "../aie";
import { AioExternalSingle, AioIconButton } from "../aio";
import { AifOptionsWindow } from "./AibOptionsWindow";
import { AifBlockLine } from "./aibInterface";
import styles from "./aib.module.css";
import { replaceBlockText } from "./replaceBlockText";

interface AifLineDisplayProps {
  id: string;
  aifid?: string;
  left?: string | null;
  center?: string | null;
  right?: string | null;
  externalSingles?: AioExternalSingle[];
  addBelow?: boolean;
  canEdit?: boolean;
  canRemove?: boolean;
  canMove?: boolean;
  canChangeType?: boolean;
  setLine?: (ret: AifBlockLine) => void;
  addLine?: () => void;
  removeLine?: () => void;
  style?: React.CSSProperties;
  styleMap?: AieStyleMap;
}

export const AifLineDisplay = ({
  id,
  aifid,
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
}: AifLineDisplayProps): JSX.Element => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const returnData = useCallback(
    (lineUpdate: { left?: string | null; center?: string | null; right?: string | null }) => {
      if (typeof setLine !== "function") return;
      const newLine = {
        aifid: aifid,
        left: lineUpdate.left !== undefined ? lineUpdate.left : left,
        center: lineUpdate.center !== undefined ? lineUpdate.center : center,
        right: lineUpdate.right !== undefined ? lineUpdate.right : right,
        addBelow: addBelow,
        canEdit: canEdit,
        canRemove: canRemove,
        canMove: canMove,
        canChangeType: canChangeType,
      };
      setLine(newLine);
    },
    [addBelow, aifid, canChangeType, canEdit, canMove, canRemove, center, left, right, setLine],
  );

  // Update for replacements
  const processReplacement = useCallback(
    (text: string | null | undefined): string | null => {
      if (typeof text !== "string") return null;
      // Process external replacements
      if (externalSingles !== undefined && externalSingles.length > 0) {
        externalSingles.forEach((repl) => {
          if (repl.oldText !== undefined && repl.oldText !== "" && repl.newText !== undefined) {
            const { newText, updated } = replaceBlockText(text, repl);
            if (updated) text = newText;
          }
        });
      }
      return text;
    },
    [externalSingles],
  );

  // Set up post replacement view
  const displayLeft = useMemo(() => processReplacement(left), [left, processReplacement]);
  const displayCenter = useMemo(() => processReplacement(center), [center, processReplacement]);
  const displayRight = useMemo(() => processReplacement(right), [right, processReplacement]);

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
        />
      )}

      <div className={styles.aibLineButtons} />
      <div
        className={styles.aibLineItemHolder}
        style={{ ...style }}
      >
        {typeof displayLeft === "string" && (
          <div
            className={[styles.aibLineItem, displayLeft !== left ? styles.aibReadOnly : ""]
              .filter((c) => c !== "")
              .join(" ")}
            style={{
              width:
                typeof center !== "string" && typeof right !== "string"
                  ? "100%"
                  : typeof center !== "string"
                    ? "50%"
                    : "33%",
            }}
          >
            <AsupInternalEditor
              id={`${id}-left-text`}
              value={displayLeft}
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
        {typeof displayCenter === "string" && (
          <div
            className={[styles.aibLineItem, displayCenter !== center ? styles.aibReadOnly : ""]
              .filter((c) => c !== "")
              .join(" ")}
            style={{ flexGrow: 1 }}
          >
            <AsupInternalEditor
              id={`${id}-center-text`}
              value={displayCenter}
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
        {typeof displayRight === "string" && (
          <div
            className={[styles.aibLineItem, displayRight !== right ? styles.aibReadOnly : ""]
              .filter((c) => c !== "")
              .join(" ")}
            style={{
              width:
                typeof center !== "string" && typeof left !== "string"
                  ? "100%"
                  : typeof center !== "string"
                    ? "50%"
                    : "33%",
            }}
          >
            <AsupInternalEditor
              id={`${id}-right-text`}
              value={displayRight}
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
