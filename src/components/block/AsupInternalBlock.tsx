import React, { useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { AieStyleMap, AsupInternalEditor } from "../aie";
import { AioExternalSingle } from "../aio";
import styles from "./aib.module.css";
import { AifBlockLine, AifLineType } from "./aibInterface";
import { AifLineDisplay } from "./AibLineDisplay";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";

interface AsupInternalBlockProps<T extends string | object> {
  id: string;
  lines: AifBlockLine<T>[];
  setLines?: (ret: AifBlockLine<T>[]) => void;
  minLines?: number;
  maxLines?: number;
  externalSingles?: AioExternalSingle[];
  styleMap?: AieStyleMap;
  defaultType?: AifLineType;
  canChangeType?: boolean;
  style?: React.CSSProperties;
  Editor?: (props: AsupInternalEditorProps<T>) => JSX.Element;
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
}: AsupInternalBlockProps<T>): JSX.Element => {
  // General function to return complied object
  const returnData = useCallback(
    (linesUpdate: { lines: AifBlockLine<T>[] }) => {
      if (typeof setLines !== "function") return;
      const r: AifBlockLine<T>[] = [...linesUpdate.lines];
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
        const newLine: AifBlockLine<T> = {
          aifid: uuidv4(),
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
  }, [lines, maxLines, minLines, returnData]);

  // Update row
  const updateLine = useCallback(
    (ret: AifBlockLine<T>, li: number) => {
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
      const newLine: AifBlockLine<T> = {
        aifid: uuidv4(),
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
          case AifLineType.leftOnly:
            newLine.right = null;
            newLine.center = null;
            break;
          case AifLineType.leftAndRight:
            newLine.center = null;
            break;
          case AifLineType.centerOnly:
            newLine.left = null;
            newLine.right = null;
            break;
          case AifLineType.leftCenterAndRight:
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
      {lines.map((l: AifBlockLine<T>, li: number) => {
        return (
          <AifLineDisplay
            id={`${id}-line-${li}`}
            key={`${li}-${l.aifid}`}
            aifid={l.aifid}
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
          />
        );
      })}
    </div>
  );
};
