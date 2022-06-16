import React, { useCallback, useEffect, useRef, useState } from "react";
import { drawInnerHtml, getCaretPosition } from ".";

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
  allowNewLine = false,
  textAlignment = "decimal",
  decimalAlignPercent = 60,
}: iEditorV2): JSX.Element => {

  // Set up reference to inner div
  const divRef = useRef<HTMLDivElement | null>(null);
  const [currentText, setCurrentText] = useState<string>("");
  useEffect(() => {
    setCurrentText(text);
    drawInnerHtml(
      divRef,
      setCurrentText,
      getCaretPosition,
      textAlignment,
      decimalAlignPercent,
      text,
    );
  }, [decimalAlignPercent, text, textAlignment]);

  const returnData = useCallback((ret: { text?: string }) => {
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

  const handleFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    setInFocus(true);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && !allowNewLine) {
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
        drawInnerHtml(
          divRef,
          setCurrentText,
          getCaretPosition,
          textAlignment,
          decimalAlignPercent,
          undefined,
          e,
          range);
      }
    }
  }, [decimalAlignPercent, textAlignment]);

  function handleSelect(e: React.SyntheticEvent<HTMLDivElement>) {
    // console.log("Key select");
    // if (divRef.current) console.log(getCaretPosition(divRef.current));
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    setInFocus(false);
    if (typeof setText === "function") {
      returnData({ text: currentText });
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
        spellCheck={false}
        ref={divRef}
        style={{
          outline: 0,
          display: 'flex',
          alignContent: 'start',
          verticalAlign: 'top',
          margin: "-1px",
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