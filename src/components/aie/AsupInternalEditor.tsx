import * as React from 'react';
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { EditorState, RichUtils, Editor, ContentState, convertToRaw, convertFromRaw, Modifier, convertFromHTML, DraftStyleMap, RawDraftContentBlock, RawDraftContentState, ContentBlock } from "draft-js";
import { AieStyleButtonRow } from "./AieStyleButtonRow";
import 'draft-js/dist/Draft.css';
import './aie.css';

export interface AieStyleMap extends DraftStyleMap { [styleName: string]: { color: string, aieExclude: string[] } };
interface RawContentBlocks { contentBlocks: Array<ContentBlock>, entityMap: any };

interface AsupInternalEditorProps {
  initialText: string | RawDraftContentState | RawContentBlocks,
  returnRaw?: (ret: RawDraftContentState) => void,
  returnText: (ret: string) => void,
  returnHtml?: (ret: string) => void,
  styleMap?: AieStyleMap,
  addStyle: React.CSSProperties,
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
  const [currentStyleMap, setCurrentStyleMap] = useState<AieStyleMap>({
    Editable: { color: "red", aieExclude: ["Optional", "Notes"] },
    Optional: { color: "green", aieExclude: ["Editable", "Notes"] },
    Notes: { color: "blue", aieExclude: ["Editable", "Optional"] },
  });

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
        chars[s.offset] = `<span className='${s.style}' style='${Object.entries(currentStyleMap[s.style]).map(([k, v]) => `${k}:${v}`).join(';')}'>${chars[s.offset]}`;
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

  // Set stylemap or use default
  useEffect(() => { if (props.styleMap) { setCurrentStyleMap(props.styleMap); } }, [props.styleMap]);

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
    // Toggle current style
    var nextEditorState: EditorState = RichUtils.toggleInlineStyle(editorState, style);
    // Get new content
    var nextContentState = nextEditorState.getCurrentContent();
    // Remove any excluded styles
    for (let s of currentStyleMap[style].aieExclude) nextContentState = Modifier.removeInlineStyle(nextContentState, selection, s);
    // Update editor
    onChange(EditorState.createWithContent(nextContentState));
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
          styleList={Object.keys(currentStyleMap)}
          currentStyle={editorState.getCurrentInlineStyle()}
          applyStyleFunction={aieApplyStyle}
        />
      </div>
      <Editor
        ref={editor}
        customStyleMap={currentStyleMap}
        editorState={editorState}
        onChange={onChange}
        textAlignment={props.textAlignment}
        readOnly={props.editable === false}
      />
    </div>
  );
}