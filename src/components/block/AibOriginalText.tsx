import { AieStyleMap } from "../aie";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";

export const OriginalText = <T extends string | object>({
  id,
  text,
  setText,
  styleMap,
  Editor,
}: {
  id: string;
  label: string;
  text: T;
  setText?: (ret: T) => void;
  styleMap?: AieStyleMap;
  Editor: (props: AsupInternalEditorProps<T>) => JSX.Element;
}): JSX.Element => {
  if (typeof text !== "string") return <></>;
  else
    return (
      <div className="aiw-body-row">
        <div className={"aio-label"}>Unprocessed text:</div>
        <Editor
          id={id}
          value={text}
          setValue={setText}
          showStyleButtons={styleMap !== undefined}
          styleMap={styleMap}
        />
      </div>
    );
};
