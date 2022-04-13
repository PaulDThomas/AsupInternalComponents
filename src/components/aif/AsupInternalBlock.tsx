import React, { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from "uuid";
import { AieStyleMap } from '../aie';
import "./aif.css";
import { AifLineDisplay } from './aifBlockLine';
import { AifBlockLine } from './aifInterface';

interface AsupInternalBlockProps {
  lines: AifBlockLine[]
  setLines?: (ret: AifBlockLine[]) => void
  maxLines?: number,
  styleMap?: AieStyleMap
}
export const AsupInternalBlock = ({
  lines,
  setLines,
  maxLines,
  styleMap,
}: AsupInternalBlockProps): JSX.Element => {

  // General function to return complied object
  const returnData = useCallback((linesUpdate: { lines: AifBlockLine[] }) => {
    if (typeof setLines !== "function") return;
    let r: AifBlockLine[] = [...linesUpdate.lines];
    setLines!(r);
  }, [setLines]);

  // Update row
  const updateLine = useCallback((ret: AifBlockLine, li: number) => {
    // Do nothing if readonly
    if (typeof (setLines) !== "function") return;

    // Create new object to send back
    let newLines = [...lines];
    newLines[li] = ret;
    returnData({ lines: newLines });
  }, [setLines, lines, returnData]);

  const addLine = useCallback((li: number) => {
    let newLines = [...lines];
    let newRow: AifBlockLine = {
      aifid: uuidv4(),
      left: "",
      centre: "",
      right: "",
      canEdit: true,
      canMove: true,
      canRemove: true,
    };
    newLines.splice(li + 1, 0, newRow);
    returnData({ lines: newLines });
  }, [lines, returnData])

  const removeLine = useCallback((li: number) => {
    let newLines = [...lines];
    newLines.splice(li, 1);
    returnData({ lines: newLines });
  }, [lines, returnData])

  /** lines, ensuring all aifids are assigend */
  const processed = useMemo((): AifBlockLine[] => {
    return lines.map((l, li) => {
      if (l.aifid === undefined) l.aifid = uuidv4();
      return l;
    });
  }, [lines]);

  return (
    <div className="aif-block" >
      {processed.map((l: AifBlockLine, li: number) => (
        <AifLineDisplay
          key={l.aifid}
          aifid={l.aifid}
          left={l.left}
          centre={l.centre}
          right={l.right}
          canEdit={l.canEdit}
          canMove={l.canMove}
          canRemove={l.canRemove}
          setLine={(ret) => updateLine(ret, li)}
          addLine={lines.length < (maxLines ?? 10) ? () => addLine(li) : undefined}
          removeLine={(lines.length > 1 && l.canRemove !== false) ? () => removeLine(li) : undefined}
          styleMap={styleMap}
        />
      ))}
    </div>
  );
}