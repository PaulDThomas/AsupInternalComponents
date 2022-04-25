import * as React from "react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import "./aiw.css";

interface AsupInternalWindowProps {
  Title: string,
  Visible: boolean,
  onClose: () => void,
  style?: React.CSSProperties,
  children?: | React.ReactChild | React.ReactChild[],
}

export const AsupInternalWindow = (props: AsupInternalWindowProps) => {

  const [showWindow, setShowWindow] = useState(props.Visible);
  
  // Update visibility
  useEffect(() => { setShowWindow(props.Visible); }, [props.Visible]);

  return (
    <>
      <Rnd
        style={{
          visibility: (showWindow ? "visible" : "hidden"),
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
            <div className={"aiw-title-text"}>{props.Title}</div>
            <div className={"aiw-title-close"} onClick={(e) => { 
              setShowWindow(false); 
              if (typeof(props.onClose) === "function") { props.onClose(); }
            }}>x</div>
          </div>
          <div className={"aiw-body"}>
            {props.children}
            </div>
        </div>
      </Rnd>
    </>
  );
}
