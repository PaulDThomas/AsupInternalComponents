import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from "react";
import { EditorState, Editor, ContentState, convertToRaw, convertFromRaw, Modifier, convertFromHTML, DraftStyleMap, RawDraftContentBlock, RawDraftContentState, ContentBlock } from "draft-js";
import { AieStyleButtonRow } from "./AieStyleButtonRow";
import 'draft-js/dist/Draft.css';
import './aie.css';

interface RawContentBlocks { contentBlocks: Array<ContentBlock>, entityMap: any };
export interface AieStyleMap { [styleName: string]: { css: React.CSSProperties, aieExclude: string[] } };
interface AieStyleExcludeMap { [styleName: string]: string[] };

const styleMapToDraft = (styleMap?: AieStyleMap): DraftStyleMap => {
  let d: DraftStyleMap = {};
  if (styleMap !== undefined)
    for (let s of Object.keys(styleMap!)) {
      d[s] = styleMap![s].css;
    }
  return d;
}
const styleMapToExclude = (styleMap?: AieStyleMap): AieStyleExcludeMap => {
  let e: AieStyleExcludeMap = {};
  if (styleMap !== undefined) for (let s of Object.keys(styleMap!)) e[s] = styleMap![s].aieExclude;
  return e;
}

interface AsupInternalEditorProps {
  initialText: string | RawDraftContentState | RawContentBlocks,
  returnRaw?: (ret: RawDraftContentState) => void,
  returnText: (ret: string) => void,
  returnHtml?: (ret: string) => void,
  addStyle: React.CSSProperties,
  styleMap?: AieStyleMap,
  highlightChanges: boolean,
  textAlignment: Draft.DraftComponent.Base.DraftTextAlignment,
  showStyleButtons: boolean,
  editable?: boolean,
};

const isRawDraftContentState = (initialText: string | RawDraftContentState | { contentBlocks: Array<ContentBlock>, entityMap: any }): initialText is RawDraftContentState => { return (initialText as RawDraftContentState).blocks !== undefined; };
const isRawContentBlocks = (initialText: string | RawDraftContentState | { contentBlocks: Array<ContentBlock>, entityMap: any }): initialText is RawContentBlocks => { return (initialText as RawContentBlocks).contentBlocks !== undefined; };

export const AsupInternalEditor = (props: AsupInternalEditorProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [buttonState, setButtonState] = useState("hidden");
  const [currentStyle, setCurrentStyle] = useState(props.addStyle);
  const [changesMade, setChangesMade] = useState(false);
  const editor = useRef(null);

  // Add default style map
  const currentStyleMap = useRef<DraftStyleMap>(styleMapToDraft(props.styleMap));
  const styleMapExclude = useRef<AieStyleExcludeMap>(styleMapToExclude(props.styleMap));

  // Show or hide style buttons
  const aieShowButtons = () => { if (props.showStyleButtons) { setButtonState(""); } };
  const aieHideButtons = () => { setButtonState("hidden"); };

  // Update editorState, and feed back to holder
  const onChange = useCallback((e: EditorState) => {
    setEditorState(e);

    // Update outputs
    const raw = convertToRaw(e.getCurrentContent());
    if (typeof (props.returnRaw) === "function") props.returnRaw(raw);

    // Get text by joining
    if (typeof (props.returnText) === "function") props.returnText(
      raw.blocks
        .map(b => b.text.split("")
          // Swap out HTML characters for safety
          .map(c => c.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"))
          .join("")
        )
        .join("\n")
    );

    // Get HTML by exploding
    const htmlBlock = (b: RawDraftContentBlock): string => {
      // Explode string
      var chars = b.text.split("");
      // Swap out HTML characters for safety
      chars = chars.map(c => c.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"));
      // Add inline style starts and ends
      for (const s of b.inlineStyleRanges) {
        chars[s.offset] = `<span className='${s.style}' style='${Object.entries(currentStyleMap.current[s.style]).map(([k, v]) => `${k}:${v}`).join(';')}'>${chars[s.offset]}`;
        chars[s.offset + s.length - 1] = `${chars[s.offset + s.length - 1]}</span>`;
      }
      return `<p>${chars.join("")}</p>`;
    }
    if (typeof (props.returnHtml) === "function") props.returnHtml(raw.blocks.map(b => htmlBlock(b)).join(""));

    // Update div holder to indicate if changes have been made
    if (props.highlightChanges) {
      setChangesMade(typeof (props.initialText) === "string" && props.initialText !== raw.blocks.map(b => b.text).join("\n"));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialText, props.returnRaw, props.returnText, props.returnHtml, props.highlightChanges, currentStyleMap]);

  // Update change highlight
  useEffect(() => {
    var newStyle = { ...props.addStyle };
    if (changesMade) {
      newStyle.margin = "-3px";
      newStyle.border = "3px dashed burlywood";
    }
    setCurrentStyle(newStyle);
  }, [props.addStyle, changesMade, props.initialText]);

  // Initial Text loading/update
  useEffect(() => {

    if (props.initialText) {
      // Loading raw form 
      if (isRawDraftContentState(props.initialText)) {
        onChange(EditorState.createWithContent(convertFromRaw(props.initialText)));
      }
      // Loading content blocks, converted from HTML
      else if (isRawContentBlocks(props.initialText)) {
        const state = ContentState.createFromBlockArray(
          props.initialText.contentBlocks,
          props.initialText.entityMap,
        )
        onChange(EditorState.createWithContent(state));
      }
      // Load HTML fragrment (crude check)
      else {
        const initialBlocks = convertFromHTML(props.initialText.replace(/\n/g, "<br/>"));
        const state = ContentState.createFromBlockArray(
          initialBlocks.contentBlocks,
          initialBlocks.entityMap,
        )
        onChange(EditorState.createWithContent(state));
      }
    }
  }, [onChange, props.initialText]);

  // Apply style to current selection
  const aieApplyStyle = (style: string) => {
    // Get current selection
    var selection = editorState.getSelection();
    // Get current content
    var nextContentState = editorState.getCurrentContent();
    var currentStyles = editorState.getCurrentInlineStyle();
    // Remove all excluded styles from selection
    for (let s of styleMapExclude.current[style]) nextContentState = Modifier.removeInlineStyle(nextContentState, selection, s);
    // Add or remove target style
    if (currentStyles.has(style)) {
      nextContentState = Modifier.removeInlineStyle(nextContentState, selection, style);
    }
    else {
      nextContentState = Modifier.applyInlineStyle(nextContentState, selection, style);
    }
    var nextEditorState = EditorState.createWithContent(nextContentState);
    // Put selection back
    nextEditorState = EditorState.acceptSelection(nextEditorState, selection);
    // Update editor
    onChange(nextEditorState);
  }

  // Render the component
  return (
    <div
      className="aie-holder"
      onMouseOver={aieShowButtons}
      onMouseLeave={aieHideButtons}
      style={currentStyle}
    >
      <div className={`aie-button-holder aie-style-button-holder ${buttonState === "hidden" ? "hidden" : ""}`}>
        <AieStyleButtonRow
          styleList={Object.keys(currentStyleMap.current)}
          currentStyle={editorState.getCurrentInlineStyle()}
          applyStyleFunction={aieApplyStyle}
          disabled={editorState.getSelection().isCollapsed()}
        />
      </div>
      <Editor
        ref={editor}
        customStyleMap={currentStyleMap.current}
        editorState={editorState}
        onChange={onChange}
        textAlignment={props.textAlignment}
        readOnly={props.editable === false}
      />
    </div>
  );
}