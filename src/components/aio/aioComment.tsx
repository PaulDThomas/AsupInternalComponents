import * as React from "react";
import { AsupInternalEditor } from "../aie";
import { AioLabel } from "./aioLabel";

interface AioCommentProps {
  label?: string,
  value: string,
  setValue?: (value: string) => void,
}

export const AioComment = (props: AioCommentProps): JSX.Element => {
  return (
    <>
      <AioLabel label={props.label} />
      <div className={"aio-input-holder"}>
        {typeof props.setValue === "function"
          ?
          <AsupInternalEditor
            style={{resize:"both", overflow:"auto"}}
            showStyleButtons={false}
            value={props.value}
            setValue={(ret) => props.setValue!(ret)}
            editable={true}
          />
          :
          <span>{props.value}</span>
        }
      </div>
    </>
  );
}