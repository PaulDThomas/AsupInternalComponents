import React from "react";
import { AieStyleMap } from "../aie";
import { AioSelect } from "../aio/aioSelect";
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import { OriginalText } from "./OriginalText";

interface AifOptionsWindowProps {
  id: string;
  onClose: () => void;
  left?: string | null;
  center?: string | null;
  right?: string | null;
  returnData?: (ret: {
    left?: string | null;
    center?: string | null;
    right?: string | null;
  }) => void;
  canChangeType: boolean;
  styleMap?: AieStyleMap;
}

export const AifOptionsWindow = ({
  id,
  onClose,
  left,
  center,
  right,
  canChangeType = false,
  returnData,
  styleMap,
}: AifOptionsWindowProps): JSX.Element => {
  return (
    <AsupInternalWindow
      id={id}
      title="Line options"
      visible={true}
      onClose={onClose}
    >
      <div className="aiw-body-row">
        <AioSelect
          id={`${id}-linetype`}
          label="Line type"
          availableValues={["Left only", "Center only", "Left, Center and Right", "Left and Right"]}
          value={
            typeof left === "string" && typeof center === "string" && typeof right === "string"
              ? "Left, Center and Right"
              : typeof left === "string" && typeof right === "string"
              ? "Left and Right"
              : typeof left === "string"
              ? "Left only"
              : "Center only"
          }
          setValue={
            returnData && canChangeType
              ? (ret) => {
                  let newLeft = null;
                  let newCenter = null;
                  let newRight = null;
                  switch (ret) {
                    case "Left only":
                      newLeft = left || "";
                      break;
                    case "Center only":
                      newCenter = center || "";
                      break;
                    case "Left and Right":
                      newLeft = left || "";
                      newRight = right || "";
                      break;
                    case "Left, Center and Right":
                    default:
                      newLeft = left || "";
                      newCenter = center || "";
                      newRight = right || "";
                      break;
                  }
                  returnData({ left: newLeft, center: newCenter, right: newRight });
                }
              : undefined
          }
        />
      </div>
      <OriginalText
        id={`${id}-unprocessed-left-text`}
        label="Left text"
        text={left}
        setText={returnData ? (ret) => returnData({ left: ret }) : undefined}
        styleMap={styleMap}
      />
      <OriginalText
        id={`${id}-unprocessed-center-text`}
        label="Center text"
        text={center}
        setText={returnData ? (ret) => returnData({ center: ret }) : undefined}
        styleMap={styleMap}
      />
      <OriginalText
        id={`${id}-unprocessed-right-text`}
        label="Right text"
        text={right}
        setText={returnData ? (ret) => returnData({ right: ret }) : undefined}
        styleMap={styleMap}
      />
    </AsupInternalWindow>
  );
};
