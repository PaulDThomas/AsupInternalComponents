import React, { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AieStyleMap } from '../aie';
import { AioExternalSingle } from '../aio';
import './aif.css';
import { AifBlockLine, AifLineType } from './aifInterface';
import { AifLineDisplay } from './aifLineDisplay';

interface AsupInternalBlockProps {
  lines: AifBlockLine[];
  setLines?: (ret: AifBlockLine[]) => void;
  minLines?: number;
  maxLines?: number;
  externalSingles?: AioExternalSingle[];
  styleMap?: AieStyleMap;
  defaultType?: AifLineType;
  style?: React.CSSProperties;
}
export const AsupInternalBlock = ({
  lines,
  setLines,
  minLines,
  maxLines,
  externalSingles,
  styleMap,
  defaultType,
  style,
}: AsupInternalBlockProps): JSX.Element => {
  /** Check lines object min/max rule */
  useEffect(() => {
    if (typeof setLines !== 'function') return;
    let newLines = [...lines];
    if (newLines.length < Math.min(minLines ?? 1, maxLines ?? 1)) {
      const reqlines = (minLines ?? 1) - lines.length;
      for (let i = 0; i < reqlines; i++) {
        const newLine: AifBlockLine = {
          aifid: uuidv4(),
          left: '',
          center: '',
          right: '',
          canEdit: true,
          canMove: true,
          canRemove: true,
        };
        newLines.push(newLine);
      }
    } else if (newLines.length > Math.max(minLines ?? 10, maxLines ?? 10)) {
      newLines = newLines.slice(0, maxLines ?? 10);
    }
    setLines(
      newLines.map((l) => {
        if (l.aifid === undefined) l.aifid = uuidv4();
        return l;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minLines, maxLines]);

  // General function to return complied object
  const returnData = useCallback(
    (linesUpdate: { lines: AifBlockLine[] }) => {
      if (typeof setLines !== 'function') return;
      const r: AifBlockLine[] = [...linesUpdate.lines];
      setLines(r);
    },
    [setLines],
  );

  // Update row
  const updateLine = useCallback(
    (ret: AifBlockLine, li: number) => {
      // Do nothing if readonly
      if (typeof setLines !== 'function') return;

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
      const newLine: AifBlockLine = {
        aifid: uuidv4(),
        left: '',
        center: '',
        right: '',
        canEdit: true,
        canMove: true,
        canRemove: true,
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
    [defaultType, lines, returnData],
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
    <div className='aif-block'>
      {lines.map((l: AifBlockLine, li: number) => {
        return (
          <AifLineDisplay
            key={l.aifid ?? li}
            aifid={l.aifid}
            left={l.left}
            center={l.center}
            right={l.right}
            addBelow={l.addBelow}
            canEdit={l.canEdit}
            canMove={l.canMove}
            canRemove={l.canRemove}
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
          />
        );
      })}
    </div>
  );
};
