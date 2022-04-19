import { ContentState, convertFromHTML, convertFromRaw, convertToRaw, DraftStyleMap, Editor, EditorState, Modifier, RawDraftContentBlock, RawDraftContentState } from "draft-js";
import 'draft-js/dist/Draft.css';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toHtml } from "../functions";
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
  chars = chars.map(c => toHtml(c));
  // Add inline style starts and ends
  for (const s of b.inlineStyleRanges) {
    chars[s.offset] = `<span className='${s.style}' style='${Object.entries(dsm[s.style]).map(([k, v]) => `${k.replace(/[A-Z]/g, "-$&").toLowerCase()}:${v}`).join(';')}'>${chars[s.offset]}`;
    chars[s.offset + s.length - 1] = `${chars[s.offset + s.length - 1]}</span>`;
  }
  return `<div className='aie-text' data-key='${b.key}' data-type='${b.type}' data-inline-style-ranges='${JSON.stringify(b.inlineStyleRanges)}'>${chars.join('')}</div>`;
}
/**
 * Aggregate function to change editor contents into HTML string with line breaks
 * @param d Raw Draft-js block
 * @param dsm Style map that has been applied
 * @returns URI encoded HTML string of the content 
 */
const saveToHTML = (d: RawDraftContentState, dsm: DraftStyleMap): string => {
  return d.blocks.map(b => htmlBlock(b, dsm)).join(``);
}

const loadFromHTML = (s: string): ContentState => {
  // There are no spans to apply
  let initialBlocks = convertFromHTML(s);
  if (!s.startsWith("<div className='aie-text'")) {
    let state = ContentState.createFromBlockArray(initialBlocks.contentBlocks, initialBlocks.entityMap,);
    return state;
  }
  // 
  else {
    let htmlIn = document.createElement('template');
    htmlIn.innerHTML = s.trim();
    let rawBlocks: RawDraftContentBlock[] = [];
    for (let i = 0; i < htmlIn.content.children.length; i++) {
      let child = htmlIn.content.children[i] as HTMLDivElement;
      let rawBlock: RawDraftContentBlock = {
        key: child.dataset.key ?? "",
        type: child.dataset.type ?? "unstyled",
        text: child.innerText,
        depth: 0,
        inlineStyleRanges: JSON.parse(child.dataset.inlineStyleRanges ?? "[]"),
        entityRanges: [],
      }
      rawBlocks.push(rawBlock);
    }
    let state = convertFromRaw({ blocks: rawBlocks, entityMap: initialBlocks.entityMap });
    return state;
  }
}

/** Interface for the AsupInternalEditor component */
interface AsupInternalEditorProps {
  value: string,
  setValue?: (ret: string) => void,
  style?: React.CSSProperties,
  styleMap?: AieStyleMap,
  textAlignment?: Draft.DraftComponent.Base.DraftTextAlignment,
  showStyleButtons?: boolean,
  editable?: boolean,
};

export const AsupInternalEditor = ({
  value,
  setValue,
  style,
  styleMap,
  textAlignment,
  showStyleButtons,
  editable,
}: AsupInternalEditorProps) => {
  /** Current editor state */
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  /** Current button state */
  const [buttonState, setButtonState] = useState("hidden");

  // Add default style map
  const currentStyleMap = useRef<DraftStyleMap>(styleMapToDraft(styleMap));
  const styleMapExclude = useRef<AieStyleExcludeMap>(styleMapToExclude(styleMap));

  // Show or hide style buttons
  const aieShowButtons = useCallback(() => { if (showStyleButtons) { setButtonState(""); } }, [showStyleButtons]);
  const aieHideButtons = useCallback(() => { setButtonState("hidden"); }, []);

  // Only send data base onBlur of editor
  const onBlur = useCallback(() => {
    if (typeof (setValue) === "function") {
      setValue(
        saveToHTML(convertToRaw(editorState.getCurrentContent()), currentStyleMap.current)
      );
    }

  }, [editorState, setValue]);

  // Initial Text loading/update
  useEffect(() => {
    // Update the content
    setEditorState(EditorState.createWithContent(loadFromHTML(value)));
  }, [value]);

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
    setEditorState(nextEditorState);
  }

  // Render the component
  return (
    <div className="aie-outer"
      onMouseOver={!(editable === false || typeof setValue !== "function") ? aieShowButtons : undefined}
      onMouseLeave={aieHideButtons}
    >
      <div
        className="aie-holder"
        style={{
          ...style,
          alignItems: textAlignment === "left"
            ? "flex-start"
            : textAlignment === "right"
              ? "flex-end"
              : textAlignment
        }}
      >
        <Editor
          customStyleMap={currentStyleMap.current}
          editorState={editorState}
          onChange={setEditorState}
          onBlur={onBlur}
          textAlignment={textAlignment}
          readOnly={editable === false || typeof setValue !== "function"}
        />
      </div>
      {!(editable === false || typeof setValue !== "function") && buttonState !== "hidden" &&
        <div className="aie-button-holder aie-style-button-holder">
          <AieStyleButtonRow
            styleList={Object.keys(currentStyleMap.current)}
            currentStyle={editorState.getCurrentInlineStyle()}
            applyStyleFunction={aieApplyStyle}
            disabled={editorState.getSelection().isCollapsed()}
          />
        </div>
      }
    </div>
  );
}