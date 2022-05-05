import { convertToRaw, DraftHandleValue, DraftStyleMap, Editor, EditorState, Modifier } from "draft-js";
import 'draft-js/dist/Draft.css';
import React, { useCallback, useEffect, useRef, useState } from "react";
import './aie.css';
import { AieStyleButtonRow } from "./AieStyleButtonRow";
import { loadFromHTML } from "./loadFromHTML";
import { saveToHTML } from "./saveToHTML";
import { styleMapToDraft } from "./styleMapToDraft";
import { styleMapToExclude } from "./styleMapToExclude";

export interface AieStyleMap { [styleName: string]: { css: React.CSSProperties, aieExclude: string[] } };
export interface AieStyleExcludeMap { [styleName: string]: string[] };

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
  const onFocus = useCallback(() => {
    if (showStyleButtons) { setButtonState(""); }
  }, [showStyleButtons]);

  // Only send data base onBlur of editor
  const onBlur = useCallback(() => {
    setButtonState("hidden");
    if (typeof (setValue) === "function") {
      setValue(
        saveToHTML(convertToRaw(editorState.getCurrentContent()), currentStyleMap.current)
      );
    }

  }, [editorState, setValue]);

  // Initial Text loading/update
  useEffect(() => {
    // Update the content
    setEditorState(EditorState.createWithContent(loadFromHTML(value, editable)));
  }, [editable, value]);

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

  const handlePastedText = useCallback((text: string, html: string): DraftHandleValue => {
    let sel = editorState.getSelection();
    let newContent: Draft.DraftModel.ImmutableData.ContentState;
    if (sel.getAnchorOffset() === sel.getFocusOffset() && sel.getAnchorKey === sel.getFocusKey) {
      newContent = Modifier.insertText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        text.trim()
      );
    }
    else {
      newContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        text.trim()
      )
    }
    setEditorState(EditorState.push(editorState, newContent, 'insert-characters'));
    return "handled";
  }, [editorState]);

  // Render the component
  return (
    <div className="aie-outer"
      style={{
        ...style,
      }}
    >
      <div
        className="aie-holder"
        onBlur={onBlur}
        onFocus={onFocus}
      >
        <Editor
          customStyleMap={currentStyleMap.current}
          editorState={editorState}
          onChange={setEditorState}
          textAlignment={textAlignment}
          readOnly={editable === false || typeof setValue !== "function"}
          handlePastedText={handlePastedText}
        />
      </div>

      {!(editable === false || typeof setValue !== "function") && buttonState !== "hidden" &&
        <div className={`aie-button-position ${textAlignment !== undefined ? textAlignment : "left"}`}>
          <div className="aie-button-holder">
            <AieStyleButtonRow
              styleList={Object.keys(currentStyleMap.current)}
              currentStyle={editorState.getCurrentInlineStyle()}
              applyStyleFunction={aieApplyStyle}
              disabled={editorState.getSelection().isCollapsed()}
            />
          </div>
        </div>
      }
    </div>
  );
}