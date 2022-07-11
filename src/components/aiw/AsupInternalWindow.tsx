import * as React from "react";
import { Rnd } from "react-rnd";
import "./aiw.css";
import { AsupInternalWindowProps } from "./aiwContext";

export const AsupInternalWindow = (props: AsupInternalWindowProps) => {

  return (
    <>
      <Rnd
        style={{
          display:"flex",
          ...props.style,
        }}
        bounds="window"
        minHeight={(props.style && props.style.minHeight) ?? "150px"}
        minWidth={(props.style && props.style.minWidth) ?? "400px"}
        maxHeight={(props.style && props.style?.maxHeight) ?? "1000px"}
        maxWidth={(props.style && props.style?.maxWidth) ?? "1000px"}
        className={"aiw-holder"}
        dragHandleClassName="aiw-title"
      >
        <div className="aiw-inner">
          <div className={"aiw-title"}>
            <div className={"aiw-title-text"}>{props.title}</div>
            <div className={"aiw-title-close"} onClick={(e) => { 
              if (typeof(props.onClose) === "function") { props.onClose(); }
            }}>x</div>
          </div>
          <div className={"aiw-body"}>
            {props.elements}
            </div>
        </div>
      </Rnd>
    </>
  );
}
