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
          zIndex: 1001,
          display:"flex"
        }}
        bounds="window"
        minWidth={"400px"}
        minHeight={"150px"}
        className={"aiw-holder"}
        dragHandleClassName="aiw-title"
      >
        <div className="aiw-inner">
          <div className={"aiw-title"}>
            <div className={"aiw-title-text"}>{Title}</div>
            <div className={"aiw-title-close"} onClick={(e) => { 
              setShowWindow(false); 
              if (typeof(onClose) === "function") { onClose(); 
              }
            }}>x</div>
          </div>
          <div className={"aiw-body"}>{children}</div>
        </div>
      </Rnd>
    </>
  );
}
