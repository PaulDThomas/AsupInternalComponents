import React, { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import { AieStyleMap } from '../aie';
import "./aif.css";
import { AifLineDisplay } from './aifBlockLine';
import { AifBlockLine } from './aifInterface';

interface AsupInternalBlockProps {
  lines: AifBlockLine[]
  setLines?: (ret: AifBlockLine[]) => void
  minLines?: number,
  maxLines?: number,
  styleMap?: AieStyleMap
}
export const AsupInternalBlock = ({
  lines,
  setLines,
  minLines,
  maxLines,
  styleMap,
}: AsupInternalBlockProps): JSX.Element => {

  /** Check lines object min/max rule */
  useEffect(() => {
    if (typeof setLines !== "function") return;
    let newLines = [...lines];
    if (newLines.length < Math.min(minLines ?? 1, maxLines ?? 1)) {
      let reqlines = (minLines ?? 1) - lines.length;
      for (let i = 0; i < reqlines; i++) {
        let newLine: AifBlockLine = {
          aifid: uuidv4(),
          left: "",
          centre: "",
          right: "",
          canEdit: true,
          canMove: true,
          canRemove: true,
        };
        newLines.push(newLine);
      }
    }
    else if (newLines.length > Math.max(minLines ?? 10, maxLines ?? 10)) {
      newLines = newLines.slice(0, maxLines ?? 10);
    }
    setLines(newLines.map((l, li) => {
      if (l.aifid === undefined) l.aifid = uuidv4();
      return l;
    }));
  }, [minLines, maxLines, setLines, lines])

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
    let newLine: AifBlockLine = {
      aifid: uuidv4(),
      left: "",
      centre: "",
      right: "",
      canEdit: true,
      canMove: true,
      canRemove: true,
    };
    newLines.splice(li + 1, 0, newLine);
    returnData({ lines: newLines });
  }, [lines, returnData])

  const removeLine = useCallback((li: number) => {
    let newLines = [...lines];
    newLines.splice(li, 1);
    returnData({ lines: newLines });
  }, [lines, returnData])

  return (
    <div className="aif-block" >
      {lines.map((l: AifBlockLine, li: number) => (
        <AifLineDisplay
          key={l.aifid}
          aifid={l.aifid}
          left={l.left}
          centre={l.centre}
          right={l.right}
          canEdit={l.canEdit}
          canMove={l.canMove}
          canRemove={l.canRemove}
          setLine={l.canEdit !== false ? (ret) => updateLine(ret, li) : undefined}
          addLine={lines.length < (maxLines ?? 10) ? () => addLine(li) : undefined}
          removeLine={(lines.length > (minLines ?? 1) && l.canEdit !== false && l.canRemove !== false) ? () => removeLine(li) : undefined}
          styleMap={styleMap}
        />
      ))}
    </div>
  );
}