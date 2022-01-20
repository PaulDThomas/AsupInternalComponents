import { Rnd } from "react-rnd";
import "./aiw.css";

export const AsupInternalWindow = ({
  Title,
  Visible = true,
  children,
}) => {

  return (
    <>
      <Rnd
        style={{
          visibility: (Visible ? "visible" : "hidden"),
          zIndex: 1001
        }}
        bounds="window"
        minWidth={"300px"}
        minHeight={"150px"}
        className={"aiw-holder"}
        default={{ x: window.innerHeight - 100, y: 100 }}
      >
        <div
        >
          <div className={"aiw-title"}>{Title}</div>
          <div className={"aiw-body"}>{children}</div>
        </div>
      </Rnd>
    </>
  );
}
