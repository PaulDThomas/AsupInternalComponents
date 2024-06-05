import { useEffect, useState } from "react";
import { AsupInternalEditorProps } from "../src/components/aie/AsupInternalEditor";

export const TestEditor = <T extends string | object>(props: AsupInternalEditorProps<T>) => {
  const [text, setText] = useState<string>();
  useEffect(() => {
    if (typeof props.value === "string") setText(props.value);
  }, [props.value]);

  if (typeof props.value !== "string")
    throw new Error("If newText is not a string, a custom function is required");

  return (
    <input
      id={props.id}
      className={"aio-input"}
      disabled={!props.setValue}
      value={text ?? ""}
      onChange={(e) => setText(e.currentTarget.value)}
      onBlur={() => props.setValue && props.setValue(text as T)}
    />
  );
};

export const replaceTextInTestEditor = (text: string, oldPhrase: string, newPhrase: string) => {
  return text.replaceAll(oldPhrase, newPhrase);
};
