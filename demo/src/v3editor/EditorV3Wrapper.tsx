import { IEditorV3, EditorV3Styles, EditorV3, EditorV3Align } from "@asup/editor-v3";
import { AieStyleMap, AsupInternalEditorProps } from "../../../src/main";
import { stringToV3 } from "./stringToV3";
import { rest } from "lodash";

interface EditorV3WrapperProps extends AsupInternalEditorProps<IEditorV3> {
  customStyleMap?: EditorV3Styles;
  debounceMilliseconds?: number;
  spellCheck?: boolean;
  allowNewLine?: boolean;
  noBorder?: boolean;
  allowWindowView?: boolean;
  allowMarkdown?: boolean;
  resize?: boolean;
}

export const EditorV3Wrapper = (props: EditorV3WrapperProps) => {
  const customStyleMap: EditorV3Styles = props.customStyleMap ?? {};
  !props.customStyleMap &&
    props.styleMap &&
    Object.keys(props.styleMap).forEach((key) => {
      customStyleMap[key] = (props.styleMap as AieStyleMap)[key].css;
    });

  const adjustedValue = (typeof props.value === "string"
    ? stringToV3(props.value)
    : props.value) ?? {
    lines: [{ textBlocks: [{ text: "" }] }],
  };

  return (
    <EditorV3
      {...rest}
      id={props.id}
      className={props.className}
      input={adjustedValue}
      setObject={(ret) => props.setValue && props.setValue(ret)}
      editable={props.editable === true}
      customStyleMap={customStyleMap}
      textAlignment={props.textAlignment as EditorV3Align}
      style={{ ...props.style }}
      spellCheck={props.spellCheck ?? false}
      debounceMilliseconds={props.debounceMilliseconds ?? null}
      allowNewLine={props.allowNewLine ?? true}
      noBorder={props.noBorder ?? true}
      allowWindowView={props.allowWindowView ?? true}
      allowMarkdown={props.allowMarkdown ?? true}
      resize={props.resize}
    />
  );
};

EditorV3Wrapper.displayName = "EditorV3Wrapper";
