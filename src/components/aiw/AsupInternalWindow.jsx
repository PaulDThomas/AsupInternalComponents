import React, { useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import "./aiw.css";

export const AsupInternalWindow = ({
  Title,
  Visible = true,
  children,
}) => {

  return (
    <Rnd
      style={{
        visibility: (Visible ? "visible" : "hidden"),
      }}
      bounds="window"
      minWidth={"300px"}
      minHeight={"150px"}
      className={"aiw-holder"}
      default={{x: 200, y:200}}
    >
      <div
      >
        <div className={"aiw-title"}>{Title}</div>
        <div className={"aiw-body"}>{children}</div>
      </div>
    </Rnd>
  );
}
