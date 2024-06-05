import React, { useCallback } from "react";
import { AieStyleMap, AsupInternalEditor } from "../aie";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";
import { newReplacedText } from "../aie/functions/newReplacedText";
import { AioExternalSingle } from "../aio";
import { AibLineDisplay } from "./AibLineDisplay";
import styles from "./aib.module.css";
import { AibBlockLine, AibLineType } from "./interface";

interface AsupInternalBlockProps<T extends string | object> {
  id: string;
  lines: AibBlockLine<T>[];
  setLines?: (ret: AibBlockLine<T>[]) => void;
  minLines?: number;
  maxLines?: number;
  externalSingles?: AioExternalSingle<T>[];
  styleMap?: AieStyleMap;
  defaultType?: AibLineType;
  canChangeType?: boolean;
  style?: React.CSSProperties;
  Editor?: (props: AsupInternalEditorProps<T>) => JSX.Element;
  blankT?: T;
  replaceTextInT?: (s: T, oldPhrase: string, newPhrase: T) => T;
}
export const AsupInternalBlock = <T extends string | object>({
  id,
  lines,
  setLines,
  minLines,
  maxLines,
  externalSingles,
  styleMap,
  defaultType = AibLineType.centerOnly,
  canChangeType = false,
  style,
  Editor = AsupInternalEditor,
  blankT = "" as T,
  replaceTextInT = newReplacedText,
}: AsupInternalBlockProps<T>): JSX.Element => {
  // General function to return complied object
  const returnData = useCallback(
    (linesUpdate: { lines: AibBlockLine<T>[] }) => {
      if (typeof setLines !== "function") return;
      const r: AibBlockLine<T>[] = [...linesUpdate.lines];
      setLines(r);
    },
    [setLines],
  );

  // Update row
  const updateLine = useCallback(
    (ret: AibBlockLine<T>, li: number) => {
      // Do nothing if readonly
      if (typeof setLines !== "function") return;

      // Create new object to send back
      const newLines = [...lines];
      newLines[li] = ret;
      returnData({ lines: newLines });
    },
    [setLines, lines, returnData],
  );

  const addLine = useCallback(
    (li: number) => {
      const newLines = [...lines];
      const newLine: AibBlockLine<T> = {
        aifid: crypto.randomUUID(),
        lineType: defaultType,
        left: [
          AibLineType.leftOnly,
          AibLineType.leftAndRight,
          AibLineType.leftCenterAndRight,
        ].includes(defaultType)
          ? blankT
          : null,
        center: [AibLineType.centerOnly, AibLineType.leftCenterAndRight].includes(defaultType)
          ? blankT
          : null,
        right: [AibLineType.leftAndRight, AibLineType.leftCenterAndRight].includes(defaultType)
          ? blankT
          : null,
        canEdit: true,
        canMove: true,
        canRemove: true,
        canChangeType: canChangeType,
      };
      newLines.splice(li + 1, 0, newLine);
      returnData({ lines: newLines });
    },
    [blankT, canChangeType, defaultType, lines, returnData],
  );

  const removeLine = useCallback(
    (li: number) => {
      const newLines = [...lines];
      newLines.splice(li, 1);
      returnData({ lines: newLines });
    },
    [lines, returnData],
  );

  return (
    <div
      id={id}
      className={styles.aibBlock}
    >
      {lines.map((l: AibBlockLine<T>, li: number) => {
        return (
          <AibLineDisplay
            id={`${id}-line-${li}`}
            key={`${li}-${l.aifid}`}
            aifid={l.aifid}
            displayType={l.lineType}
            left={l.left}
            center={l.center}
            right={l.right}
            addBelow={l.addBelow}
            canEdit={l.canEdit}
            canMove={l.canMove}
            canRemove={l.canRemove}
            canChangeType={l.canChangeType}
            externalSingles={externalSingles}
            setLine={l.canEdit !== false ? (ret) => updateLine(ret, li) : undefined}
            addLine={
              l.addBelow !== false && lines.length < (maxLines ?? 10)
                ? () => addLine(li)
                : undefined
            }
            removeLine={
              lines.length > (minLines ?? 1) && l.canEdit !== false && l.canRemove !== false
                ? () => removeLine(li)
                : undefined
            }
            styleMap={styleMap}
            style={style}
            Editor={Editor}
            blankT={blankT}
            replaceTextInT={replaceTextInT}
          />
        );
      })}
    </div>
  );
};

AsupInternalBlock.displayName = "AsupInternalBlock";
