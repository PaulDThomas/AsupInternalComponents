import { EditorV3, EditorV3Align, EditorV3Styles, IEditorV3 } from "@asup/editor-v3";
import { AieStyleMap, AsupInternalEditorProps } from "../../../src/main";

interface EditorV3WrapperProps extends AsupInternalEditorProps<IEditorV3> {
  customSytleMap?: EditorV3Styles;
  debounceMilliseconds?: number;
  spellCheck?: boolean;
}

export const EditorV3Wrapper = (props: EditorV3WrapperProps) => {
  const customStyleMap: EditorV3Styles = props.customSytleMap ?? {};
  !props.customSytleMap &&
    props.styleMap &&
    Object.keys(props.styleMap).forEach((key) => {
      customStyleMap[key] = (props.styleMap as AieStyleMap)[key].css;
    });
  return (
    <EditorV3
      id={props.id}
      input={props.value}
      setObject={props.setValue}
      editable={props.editable}
      customStyleMap={customStyleMap}
      textAlignment={props.textAlignment as EditorV3Align}
      style={{ ...props.style }}
      spellCheck={props.spellCheck ?? false}
      debounceMilliseconds={props.debounceMilliseconds ?? null}
    />
  );
};
