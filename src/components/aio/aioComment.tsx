import * as React from "react";
import { AieStyleMap, AsupInternalEditor } from "../aie";
import { AioLabel } from "./aioLabel";

interface AioCommentProps {
  id: string;
  label?: string;
  value: string;
  setValue?: (value: string) => void;
  commentStyles?: AieStyleMap;
}

export const AioComment = ({
  id,
  label,
  value,
  setValue,
  commentStyles,
}: AioCommentProps): JSX.Element => {
  return (
    <>
      <AioLabel
        id={`${id}-label`}
        label={label}
      />
      <div className={"aio-input-holder"}>
        <AsupInternalEditor
          id={`${id}-editor`}
          showStyleButtons={typeof commentStyles === "object"}
          value={value}
          editable={typeof setValue === "function"}
          setValue={typeof setValue === "function" ? (ret) => setValue(ret) : undefined}
          styleMap={commentStyles}
        />
      </div>
    </>
  );
};
