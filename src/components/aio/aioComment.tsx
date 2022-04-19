import * as React from "react";
import { AieStyleMap, AsupInternalEditor } from "../aie";
import { AioLabel } from "./aioLabel";

interface AioCommentProps {
  label?: string,
  value: string,
  setValue?: (value: string) => void,
  commentStyles?: AieStyleMap,
}

export const AioComment = ({
  label,
  value,
  setValue,
  commentStyles,
}: AioCommentProps): JSX.Element => {
  return (
    <>
      <AioLabel label={label} />
      <div className={"aio-input-holder"}>
        <AsupInternalEditor
          style={typeof setValue === "function"
            ? { resize: "both", overflow: "auto" }
            : { minWidth: "0", width: "auto", height: "auto", border: "0"}
          }
          showStyleButtons={typeof commentStyles === "object"}
          value={value}
          editable={typeof setValue === "function"}
          setValue={typeof setValue === "function" ? (ret) => setValue!(ret) : undefined}
          styleMap={commentStyles}
        />
      </div>
    </>
  );
}