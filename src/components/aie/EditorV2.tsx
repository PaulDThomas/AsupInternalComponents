import React, { useCallback, useEffect, useRef, useState } from "react";

interface iEditorV2 {
  text: string,
  setText?: (ret: string) => void,
  allowNewLine?: boolean,
  textAlignment?: "left" | "center" | "decimal" | "right",
  decimalAlignPercent?: number,
}

export const EditorV2 = ({
  text,
  setText,
  allowNewLine = true,
  textAlignment = "decimal",
  decimalAlignPercent = 60,
}: iEditorV2): JSX.Element => {

  // Set up reference to inner div
  const divRef = useRef<HTMLDivElement | null>(null);
  const [currentText, setCurrentText] = useState<string>("");
  useEffect(() => {
    setCurrentText(text);
    if (divRef.current) divRef.current.textContent = text;
  }, [text]);

  const returnData = useCallback((ret:{text?: string}) => {
    // Do nothing if there is nothing to do
    if (typeof setText !== "function") return;
    // Update via parent function
    setText(ret.text ?? text ?? "");
  }, [setText, text]);

  // Work out backgroup colour and border
  const [inFocus, setInFocus] = useState<boolean>(false);
  const [backBorder, setBackBorder] = useState<React.CSSProperties>({});
  useEffect(() => {
    setBackBorder({
      background: inFocus ? "white" : "inherit",
      border: inFocus ? "1px solid grey" : "1px solid transparent",
    })
  }, [inFocus]);

  // Work out justification
  const [just, setJust] = useState<React.CSSProperties>({});
  useEffect(() => {
    switch (textAlignment) {
      case ("right"):
        setJust({
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        });
        break;
      case ("center"):
        setJust({
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        });
        break;
      case ("decimal"):
        setJust({
          display: "block",
        });
        break;
      case ("left"):
      default:
        setJust({
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        });
    }
  }, [textAlignment, currentText]);

  const getCaretPosition = useCallback((element: HTMLDivElement): { start: number, end: number } => {
    let end: number = 0;
    let start: number = 0;
    let sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      end = preCaretRange.toString().length;
      if (element.contains(range.startContainer)) {
        preCaretRange.setStart(range.startContainer, range.startOffset);
        start = end - preCaretRange.toString().length;
      }
    }
    return { start, end };
  }, []);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    setInFocus(true);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    let sel: Selection | null = window.getSelection();
    if (sel && divRef.current) {
      let range: Range = sel.getRangeAt(0);

      if (range.collapsed) {

        // Update fullText property
        let fullText = divRef.current.textContent?.replace(/[\u202F|\u00A0]/g, ' ') ?? "";
        setCurrentText(fullText);
        // Get cursor position
        let caretPosn = getCaretPosition(divRef.current);
        let decimal = fullText.match(/\./)?.index;
        // Modification because of the key pressed
        console.log(`fullText (${fullText?.length}): ${fullText}, zeroWidthPosn: ${fullText?.match(/[\u200B]/)?.index}, position: ${caretPosn.end}, decimal: ${decimal}`);
        if (e.key === "ArrowRight") caretPosn.end++;
        else if (e.key === "Home") caretPosn.end = 0;
        else if (e.key === "End") caretPosn.end = fullText.length;
        else if (e.key === "Delete" && caretPosn.end === decimal) {
          decimal = undefined;
          fullText = fullText.replace(/\./, '');
        }
        // The non-space has been deleted
        else if (e.key === "Delete" && fullText?.match(/[\u200B]/) === null) {
          fullText = fullText.substring(0, caretPosn.end) + fullText.substring(caretPosn.end + 1);
        }
        // The non-space has been deleted
        else if (e.key === "Backspace" && fullText?.match(/[\u200B]/) === null) {
          fullText = fullText.substring(0, caretPosn.end - 2) + fullText.substring(caretPosn.end);
        }

        // Set up new fragment
        let emptyNode = document.createTextNode('\u200B');
        let fragment = new DocumentFragment();

        // Get all boundaries in fullText
        let boundaries: { type: string, start: number, end?: number, span?: HTMLSpanElement | Node }[] = [
          { type: "start", start: 0, end: caretPosn.end },
          { type: "caret", start: caretPosn.end, end: caretPosn.end },
          { type: "afterCaret", start: caretPosn.end, end: fullText.length },
        ];
        if (decimal !== null && decimal !== undefined && textAlignment === "decimal") boundaries.push(
          { type: "decimal", start: decimal! },
        );
        // Fix ends for any inserted boundaries
        let fixedBoundaries = boundaries.sort((a, b) => a.start - b.start)
          .map((b, i, all) => {
            let newB = { ...b };
            if (i === all.length - 1) newB.end = fullText.length;
            else newB.end = all[i + 1].start;
            return newB;
          });

        // Split fulltext into spans at boundaries
        fixedBoundaries.forEach(b => {
          // Add cursor if position is reached
          if (b.type === "caret") {
            b.span = emptyNode;
          } else if (b.end && b.end > b.start) {
            b.span = document.createElement('span');
            b.span.textContent = fullText
              .substring(b.start, b.end)
              .replace(/[\u200B-\u200F\uFEFF]/g, '') // Remove bad characters
              .replace(/[ ]/g, "\u00A0") // Change space to nbsp
              ;
          }
        });
        console.log(`Boundaries: ${fixedBoundaries.map(b => `${b.type}:${b.start}-${b.end}:${b.span?.textContent}`).join('|')}`);

        // Create preceeding text if decimal aligned
        if (textAlignment === "decimal") {

          // Set up space before decimal
          let prePoint = document.createElement('span');
          prePoint.style.display = "inline-block";
          prePoint.style.textAlign = "right";
          prePoint.style.width = `${decimalAlignPercent ?? 60}%`;
          fragment.append(prePoint);

          // Set up space after (and including) decimal
          let postPoint = document.createElement('span');
          postPoint.style.display = "inline-block";
          postPoint.style.textAlign = "left";
          postPoint.style.width = `${100 - (decimalAlignPercent ?? 60)}%`;
          fragment.append(postPoint);

          // Add spans is there is no decimal
          if (decimal === null || decimal === undefined) {
            prePoint.append(...fixedBoundaries.filter(b => b.span !== undefined).map(b => b.span!));
          }
          else {
            let cut = fixedBoundaries.findIndex(b => b.type === "decimal");
            prePoint.append(
              ...fixedBoundaries.slice(0, cut)
                .filter(b => b.span !== undefined)
                .map(b => b.span!)
            );
            postPoint.append(
              ...fixedBoundaries.slice(cut)
                .filter(b => b.span !== undefined)
                .map(b => b.span!)
            );
          }
        } else {
          // Create single span with text
          let innerSpan = document.createElement('span');
          innerSpan.style.display = "inline-block";
          innerSpan.style.textAlign = textAlignment ?? "left";
          innerSpan.append(...fixedBoundaries.filter(b => b.span !== undefined).map(b => b.span!));
          fragment.append(innerSpan);
        }

        divRef.current.innerHTML = "";
        divRef.current.appendChild(fragment);

        // Update cursor position and live happily ever after
        range.setEnd(emptyNode, 0);
        range.collapse();
        console.log(`Final text (${divRef.current.textContent?.length}): ${divRef.current.textContent} `);
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }, [getCaretPosition, decimalAlignPercent, textAlignment]);

  function handleSelect(e: React.SyntheticEvent<HTMLDivElement>) {
    // console.log("Key select");
    // if (divRef.current) console.log(getCaretPosition(divRef.current));
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    setInFocus(false);
    if (typeof setText === "function") {
      returnData({text:currentText});
    }
  }

  return (
    <div className='aie-line'
      style={{
        ...backBorder,
        ...just,
      }}
      onFocusCapture={handleFocus}
      onBlur={handleBlur}
    >
      <div className='aie-editing'
        contentEditable={typeof setText === "function" || true}
        suppressContentEditableWarning
        ref={divRef}
        style={{
          outline: 0,
          display: 'flex',
          alignContent: 'start',
          verticalAlign: 'top',
        }}
        onKeyUpCapture={handleKeyUp}
        onSelectCapture={handleSelect}
        onKeyDownCapture={handleKeyDown}
        onBlurCapture={handleBlur}
        onFocus={handleFocus}
      >
      </div >
    </div >
  )
}
