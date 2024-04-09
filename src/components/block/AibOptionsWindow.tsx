import { ContextWindow } from "@asup/context-menu";
import { AieStyleMap } from "../aie";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";
import { AioSelect } from "../aio/aioSelect";
import { OriginalText } from "./AibOriginalText";

interface AifOptionsWindowProps<T extends string | object> {
  id: string;
  onClose: () => void;
  left?: T | null;
  center?: T | null;
  right?: T | null;
  returnData?: (ret: { left?: T | null; center?: T | null; right?: T | null }) => void;
  canChangeType: boolean;
  styleMap?: AieStyleMap;
  Editor: (props: AsupInternalEditorProps<T>) => JSX.Element;
}

export const AifOptionsWindow = <T extends string | object>({
  id,
  onClose,
  left,
  center,
  right,
  canChangeType = false,
  returnData,
  styleMap,
  Editor,
}: AifOptionsWindowProps<T>): JSX.Element => {
  return (
    <ContextWindow
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
                  let newLeft: T | null = null;
                  let newCenter: T | null = null;
                  let newRight: T | null = null;
                  switch (ret) {
                    case "Left only":
                      newLeft = left ?? null;
                      break;
                    case "Center only":
                      newCenter = center ?? null;
                      break;
                    case "Left and Right":
                      newLeft = left ?? null;
                      newRight = right ?? null;
                      break;
                    case "Left, Center and Right":
                    default:
                      newLeft = left ?? null;
                      newCenter = center ?? null;
                      newRight = right ?? null;
                      break;
                  }
                  returnData({ left: newLeft, center: newCenter, right: newRight });
                }
              : undefined
          }
        />
      </div>
      {left && (
        <OriginalText
          id={`${id}-unprocessed-left-text`}
          label="Left text"
          text={left}
          setText={returnData ? (ret) => returnData({ left: ret }) : undefined}
          styleMap={styleMap}
          Editor={Editor}
        />
      )}
      {center && (
        <OriginalText
          id={`${id}-unprocessed-center-text`}
          label="Center text"
          text={center}
          setText={returnData ? (ret) => returnData({ center: ret }) : undefined}
          styleMap={styleMap}
          Editor={Editor}
        />
      )}
      {right && (
        <OriginalText
          id={`${id}-unprocessed-right-text`}
          label="Right text"
          text={right}
          setText={returnData ? (ret) => returnData({ right: ret }) : undefined}
          styleMap={styleMap}
          Editor={Editor}
        />
      )}
    </ContextWindow>
  );
};
