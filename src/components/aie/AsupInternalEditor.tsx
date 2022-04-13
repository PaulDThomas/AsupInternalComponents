import { ContentState, convertFromHTML, convertToRaw, DraftStyleMap, Editor, EditorState, Modifier, RawDraftContentBlock, RawDraftContentState } from "draft-js";
import 'draft-js/dist/Draft.css';
import React, { useCallback, useEffect, useRef, useState } from "react";
import './aie.css';
import { AieStyleButtonRow } from "./AieStyleButtonRow";

export interface AieStyleMap { [styleName: string]: { css: React.CSSProperties, aieExclude: string[] } };
interface AieStyleExcludeMap { [styleName: string]: string[] };

/**
 * Change AieStyle map into Draft-js version
 * @param styleMap Editor style map
 * @returns Draft-js style map
 */
const styleMapToDraft = (styleMap?: AieStyleMap): DraftStyleMap => {
  let d: DraftStyleMap = {};
  if (styleMap !== undefined)
    for (let s of Object.keys(styleMap!)) {
      d[s] = styleMap![s].css;
    }
  return d;
}

/**
 * Returns style maps that are excluded from the given map
 * @param styleMap Current style map
 * @returns list of excluded maps
 */
const styleMapToExclude = (styleMap?: AieStyleMap): AieStyleExcludeMap => {
  let e: AieStyleExcludeMap = {};
  if (styleMap !== undefined) for (let s of Object.keys(styleMap!)) e[s] = styleMap![s].aieExclude;
  return e;
}

/**
 * Safely change a draft block into HTML
 * @param b Raw Draft-js block
 * @param dsm Style map that has been applied
 * @returns HTML string of the content
 */
const htmlBlock = (b: RawDraftContentBlock, dsm: DraftStyleMap): string => {
  // Explode string
  var chars = b.text.split("");
  // Swap out HTML characters for safety
  chars = chars.map(c => c.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"));
  // Add inline style starts and ends
  for (const s of b.inlineStyleRanges) {
    chars[s.offset] = `<span className='${s.style}' style='${Object.entries(dsm[s.style]).map(([k, v]) => `${k.replace(/[A-Z]/g, "-$&").toLowerCase()}:${v}`).join(';')}'>${chars[s.offset]}`;
    chars[s.offset + s.length - 1] = `${chars[s.offset + s.length - 1]}</span>`;
  }
  return `${chars.join("")}`;
}
/**
 * Aggregate function to change editor contents into HTML string with line breaks
 * @param d Raw Draft-js block
 * @param dsm Style map that has been applied
 * @returns URI encoded HTML string of the content 
 */
const convertToHTML = (d: RawDraftContentState, dsm: DraftStyleMap): string => {
  return d.blocks.map(b => htmlBlock(b, dsm)).join("<br/>");
}

/** Interface for the AsupInternalEditor component */
interface AsupInternalEditorProps {
  value: string,
  setValue?: (ret: string) => void,
  style?: React.CSSProperties,
  styleMap?: AieStyleMap,
  highlightChanges?: boolean,
  textAlignment?: Draft.DraftComponent.Base.DraftTextAlignment,
  showStyleButtons?: boolean,
  editable?: boolean,
};

export const AsupInternalEditor = (props: AsupInternalEditorProps) => {
  /** Current editor state */
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  /** Current button state */
  const [buttonState, setButtonState] = useState("hidden");

  // Add default style map
  const currentStyleMap = useRef<DraftStyleMap>(styleMapToDraft(props.styleMap));
  const styleMapExclude = useRef<AieStyleExcludeMap>(styleMapToExclude(props.styleMap));

  // Show or hide style buttons
  const aieShowButtons = useCallback(() => { if (props.showStyleButtons) { setButtonState(""); } }, [props.showStyleButtons]);
  const aieHideButtons = useCallback(() => { setButtonState("hidden"); }, []);

  // Update editorState, and feed back to holder
  const onChange = useCallback((e: EditorState) => {
    setEditorState(e);
    // Update value externally
    if (typeof (props.setValue) === "function") props.setValue(convertToHTML(convertToRaw(e.getCurrentContent()), currentStyleMap.current));
  }, [props]);

  // Initial Text loading/update
  useEffect(() => {
    // Stop if the content is the same
    if (props.value === convertToHTML(convertToRaw(editorState.getCurrentContent()), currentStyleMap.current)) return;
    // Update the content
    const initialBlocks = convertFromHTML(props.value);
    const state = ContentState.createFromBlockArray(
      initialBlocks.contentBlocks,
      initialBlocks.entityMap,
    )
    onChange(EditorState.createWithContent(state));
  }, [editorState, onChange, props.value]);

  /**
   * Apply style to current selection on button press
   * @param style Name of the style to apply
   */
  const aieApplyStyle = (style: string) => {
    // Get current selection
    let selection = editorState.getSelection();
    // Get current content
    let nextContentState = editorState.getCurrentContent();
    let currentStyles = editorState.getCurrentInlineStyle();
    // Remove all excluded styles from selection
    for (let s of styleMapExclude.current[style]) {
      nextContentState = Modifier.removeInlineStyle(nextContentState, selection, s);
    }
    // Add or remove target style
    if (currentStyles.has(style)) {
      nextContentState = Modifier.removeInlineStyle(nextContentState, selection, style);
    }
    else {
      nextContentState = Modifier.applyInlineStyle(nextContentState, selection, style);
    }
    let nextEditorState = EditorState.createWithContent(nextContentState);
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
      style={{
        ...props.style,
        alignItems: props.textAlignment === "left" 
        ? "flex-start"
        : props.textAlignment === "right" 
        ? "flex-end"
        : props.textAlignment
      }}
    >
      <div className={[
        "aie-button-holder",
        "aie-style-button-holder",
        buttonState === "hidden" ? "hidden" : "",
      ].join(" ")}
      >
        <AieStyleButtonRow
          styleList={Object.keys(currentStyleMap.current)}
          currentStyle={editorState.getCurrentInlineStyle()}
          applyStyleFunction={aieApplyStyle}
          disabled={editorState.getSelection().isCollapsed()}
        />
      </div>
      <Editor
        customStyleMap={currentStyleMap.current}
        editorState={editorState}
        onChange={onChange}
        textAlignment={props.textAlignment}
        readOnly={props.editable === false}
      />
    </div>
  );
}