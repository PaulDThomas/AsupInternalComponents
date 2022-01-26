import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "./aiw.css";

export const AsupInternalWindow = ({
  Title,
  Visible = true,
  onClose,
  children,
}) => {

  const [showWindow, setShowWindow] = useState(Visible);
  
  // Update visibility
  useEffect(() => { setShowWindow(Visible); }, [Visible]);

  return (
    <>
      <Rnd
        style={{
          visibility: (showWindow ? "visible" : "hidden"),
          zIndex: 1001
        }}
        bounds="window"
        minWidth={"400px"}
        minHeight={"150px"}
        className={"aiw-holder"}
        dragHandleClassName="aiw-title"
      >
        <div style={{
          overflow:"auto",
          cursor:"default"
        }}
        >
          <div className={"aiw-title"}>
            <span>{Title}</span>
            <span style={{float:"right"}} onClick={(e) => { 
              setShowWindow(false); 
              if (typeof(onClose) === "function") { onClose(); 
              }
            }}>x</span>
          </div>
          <div className={"aiw-body"}>{children}</div>
        </div>
      </Rnd>
    </>
  );
}
