import { useState, useRef, useEffect, useCallback } from "react";
import { EditorState, RichUtils, Editor, ContentState, convertToRaw, convertFromRaw, Modifier, convertFromHTML } from "draft-js";
import { AieStyleButtonRow } from "./AieStyleButtonRow";
import 'draft-js/dist/Draft.css';
import './aie.css';

export const AsupInternalEditor = ({
  initialText,
  returnRaw,
  returnText,
  returnHtml,
  styleMap,
  addStyle = {},
  highlightChanges = false,
  textAlignment = "left",
  showStyleButtons = true,
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [buttonState, setButtonState] = useState("hidden");
  const [currentStyle, setCurrentStyle] = useState(addStyle);
  const [changesMade, setChangesMade] = useState(false);
  const editor = useRef(null);

  // Add default style map
  const [currentStyleMap, setCurrentStyleMap] = useState({
    Editable: { color: "red", aieExclude: ["Optional", "Notes"] },
    Optional: { color: "green", aieExclude: ["Editable", "Notes"] },
    Notes: { color: "blue", aieExclude: ["Editable", "Optional"] },
  });

  // Show or hide style buttons
  const aieShowButtons = () => { if (showStyleButtons) { setButtonState(""); } };
  const aieHideButtons = () => { setButtonState("hidden"); };

  // Update editorState, and feed back to holder
  const onChange = useCallback((e) => {
    setEditorState(e);

    // Update outputs
    const raw = convertToRaw(e.getCurrentContent());
    if (typeof (returnRaw) === "function") returnRaw(raw);

    // Get text by joining
    if (typeof (returnText) === "function") returnText(
      raw.blocks
        .map(b => [...b.text]
          // Swap out HTML characters for safety
          .map(c => c.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"))
          .join("")
        )
        .join("\n")
    );

    // Get HTML by exploding
    const htmlBlock = (b) => {
      // Explode string
      var chars = [...b.text];
      // Swap out HTML characters for safety
      chars = chars.map(c => c.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"));
      // Add inline style starts and ends
      for (const s of b.inlineStyleRanges) {
        chars[s.offset] = `<span class='${s.style}' style='${Object.entries(currentStyleMap[s.style]).map(([k, v]) => `${k}:${v}`).join(';')}'>${chars[s.offset]}`;
        chars[s.offset + s.length - 1] = `${chars[s.offset + s.length - 1]}</span>`;
      }
      return `<p>${chars.join("")}</p>`;
    }
    if (typeof (returnHtml) === "function") returnHtml(raw.blocks.map(b => htmlBlock(b)).join(""));

    // Update div holder to indicate if changes have been made
    if (highlightChanges) {
      setChangesMade(typeof (initialText) === "string" && initialText !== raw.blocks.map(b => b.text).join("\n"));
    }

  }, [returnRaw, returnText, returnHtml, highlightChanges, currentStyleMap, initialText]);

  // Set stylemap or use default
  useEffect(() => { if (styleMap) { setCurrentStyleMap(styleMap); } }, [styleMap]);

  // Update change highlight
  useEffect(() => {
    var newStyle = { ...addStyle };
    if (changesMade) {
      newStyle.margin = "-3px";
      newStyle.border = "3px dashed burlywood";
    }
    setCurrentStyle(newStyle);
  }, [addStyle, changesMade, initialText]);

  // Initial Text loading/update
  useEffect(() => {
    if (initialText) {
      // Loading raw form 
      if (initialText.blocks !== undefined) {
        onChange(EditorState.createWithContent(convertFromRaw(initialText)));
      }
      // Loading content blocks, converted from HTML
      else if (initialText.contentBlocks !== undefined) {
        const state = ContentState.createFromBlockArray(
          initialText.contentBlocks,
          initialText.entityMap,
        )
        onChange(EditorState.createWithContent(state));
      }
      // Load HTML fragrment (crude check)
      else if (typeof (initialText) === "string") {
        const initialBlocks = convertFromHTML(initialText);
        const state = ContentState.createFromBlockArray(
          initialBlocks.contentBlocks,
          initialBlocks.entityMap,
        )
        onChange(EditorState.createWithContent(state));
      }
    }
  }, [initialText, onChange]);

  // Apply style to current selection
  const aieApplyStyle = (style) => {
    // Toggle current style
    var nextEditorState = RichUtils.toggleInlineStyle(editorState, style);
    // Remove any excluded styles
    var nextContentState = [
      nextEditorState.getCurrentContent(),
      ...currentStyleMap[style].aieExclude
    ].reduce((content, style) => {
      return Modifier.removeInlineStyle(
        content,
        nextEditorState.getSelection(),
        style
      );
    });
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
        textAlignment={textAlignment}
      />
    </div>
  );
}