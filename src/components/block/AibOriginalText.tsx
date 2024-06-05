import { AieStyleMap } from "../aie";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";

export const AibOriginalText = <T extends string | object>({
  id,
  label,
  text,
  setText,
  styleMap,
  canEdit = false,
  Editor,
}: {
  id: string;
  label: string;
  text: T;
  setText?: (ret: T) => void;
  styleMap?: AieStyleMap;
  canEdit?: boolean;
  Editor: (props: AsupInternalEditorProps<T>) => JSX.Element;
}): JSX.Element => {
  return (
    <div className="aiw-body-row">
      <label
        className={"aio-label"}
        htmlFor={id}
      >
        {label}
      </label>
      <div className={"aio-input-holder"}>
        <Editor
          id={id}
          value={text}
          setValue={setText}
          showStyleButtons={styleMap !== undefined}
          styleMap={styleMap}
          style={{
            border: "1px solid black",
            borderRadius: "4px",
          }}
          editable={canEdit}
        />
      </div>
    </div>
  );
};

AibOriginalText.DisplayName = "AibOriginalText";
