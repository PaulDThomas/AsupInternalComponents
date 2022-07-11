import * as React from "react";
import { useState } from "react";
import { Rnd } from "react-rnd";
import "./aiw.css";
import { AsupInternalWindowProps } from "./aiwContext";

export const AsupInternalWindow = (props: AsupInternalWindowProps) => {

  // Position
  const [x, setX] = useState<number>(
    (props.x ?? 0) + 400 < window.innerHeight
      ? (props.x ?? 0)
      : Math.max(0, (props.x ?? 0) - 400)
  );
  const [y, setY] = useState<number>(props.y ?? 0);

  return (
    <>
      <Rnd
        style={{
          display: "flex",
          ...props.style,
        }}
        bounds="window"
        position={{ x, y }}
        onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
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
              if (typeof (props.onClose) === "function") { props.onClose(); }
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
