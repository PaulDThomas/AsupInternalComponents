import { IEditorV3, EditorV3Styles, EditorV3, EditorV3Align } from "@asup/editor-v3";
import { AieStyleMap, AsupInternalEditorProps } from "../main";
import { readV2DivElement } from "./readV2DivElement";

interface EditorV3WrapperProps extends AsupInternalEditorProps<IEditorV3> {
  customSytleMap?: EditorV3Styles;
  debounceMilliseconds?: number;
  spellCheck?: boolean;
  allowNewLine?: boolean;
}

const convert = (value: string): IEditorV3 => {
  if (value.match(/^<div.*class/)) {
    const div = document.createElement("div");
    div.innerHTML = value;
    const blocks = readV2DivElement(div.childNodes[0] as HTMLDivElement);
    return {
      lines: [{ textBlocks: blocks.textBlocks }],
    };
  } else {
    return {
      lines: [{ textBlocks: [{ text: value }] }],
    };
  }
};

export const getTextFromEditorV3 = (input: IEditorV3 | string): string[] => {
  const ret: IEditorV3 = typeof input === "string" ? convert(input) : input;
  return ret.lines.flatMap((l) => l.textBlocks.map((tb) => tb.text));
};

export const replaceTextInEditorV3 = (
  input: IEditorV3 | string,
  oldPhrase: string,
  newPhrase: string,
): IEditorV3 => {
  const ret: IEditorV3 = typeof input === "string" ? convert(input) : input;
  ret.lines.forEach((l) => {
    l.textBlocks.forEach((tb) => {
      tb.text = tb.text.replaceAll(oldPhrase, newPhrase);
    });
  });
  return ret;
};

export const EditorV3Wrapper = (props: EditorV3WrapperProps) => {
  const customStyleMap: EditorV3Styles = props.customSytleMap ?? {};
  !props.customSytleMap &&
    props.styleMap &&
    Object.keys(props.styleMap).forEach((key) => {
      customStyleMap[key] = (props.styleMap as AieStyleMap)[key].css;
    });

  const adjustedValue = (typeof props.value === "string" ? convert(props.value) : props.value) ?? {
    lines: [{ textBlocks: [{ text: "" }] }],
  };

  return (
    <EditorV3
      id={props.id}
      input={adjustedValue}
      setObject={(ret) => {
        console.log(ret);
        props.setValue && props.setValue(ret);
      }}
      editable={props.editable}
      customStyleMap={customStyleMap}
      textAlignment={props.textAlignment as EditorV3Align}
      style={{ ...props.style }}
      spellCheck={props.spellCheck ?? false}
      debounceMilliseconds={props.debounceMilliseconds ?? null}
      allowNewLine={props.allowNewLine ?? false}
    />
  );
};
