import { ContextWindow } from "@asup/context-menu";
import { AieStyleMap } from "../aie";
import { AsupInternalEditorProps } from "../aie/AsupInternalEditor";
import { AioSelect } from "../aio/aioSelect";
import { AibOriginalText } from "./AibOriginalText";
import { AibLineType } from "./interface";

interface AibOptionsWindowProps<T extends string | object> {
  id: string;
  onClose: () => void;
  displayType: string;
  left?: T | null;
  center?: T | null;
  right?: T | null;
  returnData?: (ret: {
    left?: T | null;
    center?: T | null;
    right?: T | null;
    displayType?: AibLineType;
  }) => void;
  canChangeType: boolean;
  styleMap?: AieStyleMap;
  canEdit?: boolean;
  Editor: (props: AsupInternalEditorProps<T>) => JSX.Element;
}

export const AibOptionsWindow = <T extends string | object>({
  id,
  onClose,
  displayType,
  left,
  center,
  right,
  canChangeType = false,
  returnData,
  styleMap,
  canEdit = false,
  Editor,
}: AibOptionsWindowProps<T>): JSX.Element => {
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
          value={displayType}
          setValue={
            returnData && canChangeType
              ? (ret) => returnData({ displayType: ret as AibLineType })
              : undefined
          }
        />
      </div>
      {left !== undefined && left !== null && (
        <AibOriginalText
          id={`${id}-unprocessed-left-text`}
          label="Left text"
          text={left}
          setText={returnData ? (ret) => returnData({ left: ret }) : undefined}
          styleMap={styleMap}
          canEdit={canEdit}
          Editor={Editor}
        />
      )}
      {center !== undefined && center !== null && (
        <AibOriginalText
          id={`${id}-unprocessed-center-text`}
          label="Center text"
          text={center}
          setText={returnData ? (ret) => returnData({ center: ret }) : undefined}
          styleMap={styleMap}
          canEdit={canEdit}
          Editor={Editor}
        />
      )}
      {right !== undefined && right !== null && (
        <AibOriginalText
          id={`${id}-unprocessed-right-text`}
          label="Right text"
          text={right}
          setText={returnData ? (ret) => returnData({ right: ret }) : undefined}
          styleMap={styleMap}
          canEdit={canEdit}
          Editor={Editor}
        />
      )}
    </ContextWindow>
  );
};

AibOptionsWindow.DisplayName = "AibOptionsWindow";
