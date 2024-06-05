import React, { useCallback, useEffect } from "react";
import { AieStyleMap, AsupInternalEditor } from "../aie";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";
import { AioExternalSingle } from "../aio";
import { AibLineDisplay } from "./AibLineDisplay";
import styles from "./aib.module.css";
import { AibBlockLine, AibLineType } from "./aibInterface";
import { newReplacedText } from "../aie/functions/newReplacedText";

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
  defaultType,
  canChangeType = false,
  style,
  Editor = AsupInternalEditor,
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

  /** Check lines object min/max rule */
  useEffect(() => {
    let newLines = [...lines];
    if (newLines.length < Math.min(minLines ?? 1, maxLines ?? 1)) {
      const reqlines = (minLines ?? 1) - lines.length;
      for (let i = 0; i < reqlines; i++) {
        const newLine: AibBlockLine<T> = {
          aifid: crypto.randomUUID(),
          lineType: defaultType ?? AibLineType.leftOnly,
          left: "" as T,
          center: "" as T,
          right: "" as T,
          canEdit: true,
          canMove: true,
          canRemove: true,
        };
        newLines.push(newLine);
        returnData({ lines: newLines });
      }
    } else if (newLines.length > Math.max(minLines ?? 10, maxLines ?? 10)) {
      newLines = newLines.slice(0, maxLines ?? 10);
      returnData({ lines: newLines });
    }
  }, [defaultType, lines, maxLines, minLines, returnData]);

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
        lineType: defaultType ?? AibLineType.leftOnly,
        left: "" as T,
        center: "" as T,
        right: "" as T,
        canEdit: true,
        canMove: true,
        canRemove: true,
        canChangeType: canChangeType,
      };
      if (defaultType !== undefined) {
        switch (defaultType) {
          case AibLineType.leftOnly:
            newLine.right = null;
            newLine.center = null;
            break;
          case AibLineType.leftAndRight:
            newLine.center = null;
            break;
          case AibLineType.centerOnly:
            newLine.left = null;
            newLine.right = null;
            break;
          case AibLineType.leftCenterAndRight:
          default:
            break;
        }
      }
      newLines.splice(li + 1, 0, newLine);
      returnData({ lines: newLines });
    },
    [canChangeType, defaultType, lines, returnData],
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
            replaceTextInT={replaceTextInT}
          />
        );
      })}
    </div>
  );
};

AsupInternalBlock.displayName = "AsupInternalBlock";
