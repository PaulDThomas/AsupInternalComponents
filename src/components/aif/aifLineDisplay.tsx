import React, { useCallback, useState } from "react";
import { AieStyleMap, AsupInternalEditor } from "../aie";
import { AioExternalSingle, AioIconButton, AioSelect } from "../aio";
import { AsupInternalWindow } from "../aiw";
import "./aif.css";
import { AifBlockLine } from "./aifInterface";

interface AifLineDisplayProps {
  aifid?: string,
  left?: string | false,
  centre?: string | false,
  right?: string | false,
  externalSingles?: AioExternalSingle[],
  addBelow?: boolean,
  canEdit?: boolean,
  canRemove?: boolean,
  canMove?: boolean,
  setLine?: (ret: AifBlockLine) => void,
  addLine?: () => void,
  removeLine?: () => void,
  style?: React.CSSProperties,
  styleMap?: AieStyleMap
}

export const AifLineDisplay = ({
  aifid,
  left,
  centre,
  right,
  addBelow,
  canEdit,
  canRemove,
  canMove,
  setLine,
  addLine,
  removeLine,
  style,
  styleMap,
}: AifLineDisplayProps): JSX.Element => {

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const returnData = useCallback((lineUpdate: { left?: string | false, centre?: string | false, right?: string | false }) => {
    if (typeof setLine !== "function") return;
    let newLine = {
      aifid: aifid,
      left: lineUpdate.left ?? left,
      centre: lineUpdate.centre ?? centre,
      right: lineUpdate.right ?? right,
      addBelow: addBelow,
      canEdit: canEdit,
      canRemove: canRemove,
      canMove: canMove,
    }
    setLine(newLine);
  }, [addBelow, aifid, canEdit, canMove, canRemove, centre, left, right, setLine]);

  return (
    <div className={`aif-line ${(canEdit === false || typeof setLine !== "function") ? 'aif-readonly' : ''}`} style={{ ...style }}>
      {showOptions &&
        <AsupInternalWindow
          Title="Line options"
          Visible={showOptions}
          onClose={() => setShowOptions(false)}
        >
          <div className="aiw-body-row">
            <AioSelect
              label="Line type"
              availableValues={["Left only", "Centre only", "Left, Centre and Right", "Left and Right"]}
              value={
                typeof left === "string" && typeof centre == "string" && typeof right === "string"
                  ? "Left, Centre and Right"
                  : typeof left === "string" && typeof right === "string"
                    ? "Left and Right"
                    : typeof left === "string"
                      ? "Left only"
                      : "Centre only"
              }
              setValue={typeof setLine === "function" ? (ret) => {
                switch (ret) {
                  case ("Left only"):
                    left = left || "";
                    centre = false;
                    right = false;
                    break;
                  case ("Centre only"):
                    left = false;
                    centre = centre || "";
                    right = false;
                    break;
                  case ("Left and Right"):
                    left = left || "";
                    centre = false;
                    right = right || "";
                    break;
                  case ("Left, Centre and Right"):
                  default:
                    left = left || "";
                    centre = centre || "";
                    right = right || "";
                    break;
                }
                returnData({ left: left, centre: centre, right: right });
              } : undefined}
            />
          </div>
        </AsupInternalWindow>
      }

      <div className="aif-line-buttons" />
      <div className="aif-line-item-holder">
        {typeof left === "string" &&
          <div
            style={{ width: typeof centre !== "string" && typeof right !== "string" ? "100%" : typeof centre !== "string" ? "50%" : "33%" }}
          >
            <AsupInternalEditor
              value={left}
              setValue={typeof setLine === "function" ? (ret) => returnData({ left: ret }) : undefined}
              showStyleButtons={true}
              styleMap={styleMap}
            />
          </div>
        }
        {typeof centre === "string" &&
          <div
            style={{ flexGrow: 1 }}
          >
            <AsupInternalEditor
              value={centre}
              setValue={typeof setLine === "function" ? (ret) => returnData({ centre: ret }) : undefined}
              textAlignment={"center"}
              showStyleButtons={true}
              styleMap={styleMap}
            />
          </div>
        }
        {typeof right === "string" &&
          <div
            style={{ width: typeof centre !== "string" && typeof left !== "string" ? "100%" : typeof centre !== "string" ? "50%" : "33%" }}
          >
            <AsupInternalEditor
              value={right}
              setValue={typeof setLine === "function" ? (ret) => returnData({ right: ret }) : undefined}
              textAlignment={"right"}
              showStyleButtons={styleMap !== undefined}
              styleMap={styleMap}
            />
          </div>
        }
      </div>

      <div className="aif-line-buttons">
        <AioIconButton onClick={() => setShowOptions(!showOptions)} iconName={"aio-button-row-options"} tipText="Options" />
        {typeof addLine === "function" ? <AioIconButton onClick={addLine} iconName={"aiox-plus"} tipText="Add line" /> : <div style={{ width: "18px" }} />}
        {typeof removeLine === "function" && <AioIconButton onClick={removeLine} iconName={"aiox-minus"} tipText="Remove line" />}
      </div>
    </div>
  );
}