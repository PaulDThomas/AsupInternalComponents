import { AieStyleMap } from "components/aie/AsupInternalEditor";
import { AioSelect } from "components/aio/aioSelect";
import React, { useCallback, useState } from "react";
import { AsupInternalEditor } from "../aie";
import { AioIconButton } from "../aio";
import { AsupInternalWindow } from "../aiw";
import "./aif.css";
import { AifBlockLine } from "./aifInterface";

interface AifLineDisplayProps {
  aifid?: string,
  left?: string | false,
  centre?: string | false,
  right?: string | false,
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
      canEdit: canEdit,
      canRemove: canRemove,
      canMove: canMove,
    }
    setLine(newLine);
  }, [aifid, canEdit, canMove, canRemove, centre, left, right, setLine]);

  return (
    <div className="aif-line" style={{ ...style }}>
      <div className="aif-line-item-holder">

        <AsupInternalWindow
          Title="Line options"
          Visible={showOptions}
          onClose={() => setShowOptions(false)}
        >
          <div className="aiw-body-row">
            <AioSelect
              label="Line type"
              availableValues={["Left only", "Centre only", "Left and Right", "Left, Centre and Right"]}
              value={
                typeof left === "string" && typeof centre == "string" && typeof right === "string"
                  ? "Left, Centre and Right"
                  : typeof left === "string" && typeof right === "string"
                    ? "Left and Right"
                    : typeof left === "string"
                      ? "Left only"
                      : "Centre only"
              }
              setValue={(ret) => {
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
              }}
            />
          </div>
        </AsupInternalWindow>
        {typeof left === "string" &&
          <AsupInternalEditor
            value={left}
            setValue={(ret) => returnData({ left: ret })}
            style={{ flexGrow: 1, fontFamily: "courier" }}
            showStyleButtons={true}
            styleMap={styleMap}
          />
        }
        {typeof centre === "string" &&
          <AsupInternalEditor
            value={centre}
            setValue={(ret) => returnData({ centre: ret })}
            textAlignment={"center"}
            style={{ flexGrow: 1, fontFamily: "courier" }}
            showStyleButtons={true}
            styleMap={styleMap}
          />
        }
        {typeof right === "string" &&
          <AsupInternalEditor
            value={right}
            setValue={(ret) => returnData({ right: ret })}
            textAlignment={"right"}
            style={{ flexGrow: 1, fontFamily: "courier" }}
            showStyleButtons={true}
            styleMap={styleMap}
          />
        }
        <div className="aif-line-buttons aio-button-holder">
          <AioIconButton onClick={() => setShowOptions(true)} iconName={"aio-button-row-options"} tipText="Options" />
          {typeof addLine === "function" && <AioIconButton onClick={addLine} iconName={"aiox-plus"} tipText="Add line" />}
          {typeof removeLine === "function" && <AioIconButton onClick={removeLine} iconName={"aiox-minus"} tipText="Remove line" />}
        </div>
      </div>
    </div >
  );
}