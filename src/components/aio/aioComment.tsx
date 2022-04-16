import * as React from "react";
import { AioLabel } from "./aioLabel";

interface AioCommentProps {
  label?: string,
  value?: string,
  setValue?: (value: string) => void,
}

export const AioComment = (props: AioCommentProps): JSX.Element => {
  return (
    <>
      <AioLabel label={props.label} />
      <div className={"aio-input-holder"}>
        {(typeof (props.setValue) !== "function")
          ?
          <span>{props.value}</span>
          :
          <textarea
            className={"aio-comment"}
            value={props.value ?? ""}
            rows={4}
            onChange={typeof (props.setValue) === "function"
              ?
              (e: React.ChangeEvent<HTMLTextAreaElement>) => { if (props.setValue) props.setValue(e.currentTarget.value); }
              :
              undefined
            }
          />
        }
      </div>
    </>
  );
}