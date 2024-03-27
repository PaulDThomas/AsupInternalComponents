import { TableSettingsContext } from "../ait/aitContext";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import "./aiw.css";
import { chkPosition } from "./chkPosition";

interface AsupInternalWindowProps {
  id: string;
  title: string;
  visible: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
  children?: React.ReactChild | React.ReactChild[];
}

export const AsupInternalWindow = (props: AsupInternalWindowProps): JSX.Element => {
  const tableSettings = useContext(TableSettingsContext);
  const [zIndex, setZIndex] = useState<number | null>(null);
  const [showWindow, setShowWindow] = useState(props.visible);
  const rndRef = useRef<Rnd>(null);

  // Position
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();

  const chkTop = useCallback(
    (force: boolean) => {
      if (zIndex === null || (force && zIndex < tableSettings.windowZIndex)) {
        const nextIndex = tableSettings.windowZIndex + 1;
        setZIndex(nextIndex);
        if (typeof tableSettings.setWindowZIndex === "function")
          tableSettings.setWindowZIndex(nextIndex);
      }
    },
    [tableSettings, zIndex],
  );
  useEffect(() => chkTop(false), [chkTop]);

  // Update visibility
  useEffect(() => {
    setShowWindow(props.visible);
    if (props.visible && rndRef.current) {
      const { newX, newY } = chkPosition(rndRef);
      setX(newX);
      setY(newY);
    }
  }, [props.visible]);

  return (
    <>
      <Rnd
        id={props.id}
        style={{
          visibility: showWindow ? "visible" : "hidden",
          display: "flex",
          zIndex: zIndex ?? 1,
          ...props.style,
          position: "fixed",
        }}
        ref={rndRef}
        position={x !== undefined && y !== undefined ? { x, y } : undefined}
        onDragStop={(e, d) => {
          if (e instanceof MouseEvent) {
            let newX: number | undefined = d.x;
            let newY: number | undefined = d.y;
            ({ newX, newY } = chkPosition(rndRef, newX, newY));
            setX(newX);
            setY(newY);
          }
        }}
        minHeight={(props.style && props.style.minHeight) ?? "150px"}
        minWidth={(props.style && props.style.minWidth) ?? "400px"}
        maxHeight={(props.style && props.style?.maxHeight) ?? "1000px"}
        maxWidth={(props.style && props.style?.maxWidth) ?? "1000px"}
        className={"aiw-holder"}
        dragHandleClassName="aiw-title"
      >
        <div
          className="aiw-inner"
          onClick={() => chkTop(true)}
        >
          <div className={"aiw-title"}>
            <div
              id={`${props.id}-title`}
              className={"aiw-title-text"}
            >
              {props.title}
            </div>
            <div
              id={`${props.id}-close`}
              className={"aiw-title-close"}
              onClick={() => {
                setShowWindow(false);
                if (typeof props.onClose === "function") {
                  props.onClose();
                }
              }}
            >
              x
            </div>
          </div>
          <div
            id={`${props.id}-body`}
            className={"aiw-body"}
          >
            {props.children}
          </div>
        </div>
      </Rnd>
    </>
  );
};
