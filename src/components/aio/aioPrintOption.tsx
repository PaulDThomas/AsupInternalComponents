import * as React from "react";
import { AioOptionType } from "./interface";
import { RenderLineItem } from "./RenderLineItem";

interface AioPrintOptionProps {
  id: string;
  value: unknown;
  label?: string;
  type?: AioOptionType | string;
  availablValues?: Array<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: (value: any) => void;
  canAddItems?: boolean;
  canMoveItems?: boolean;
  canRemoveItems?: boolean;
  moveUp?: () => void;
  moveDown?: () => void;
  addItem?: () => void;
  removeItem?: () => void;
  children?: React.ReactChild | React.ReactChild[];
}

export const AioPrintOption = (props: AioPrintOptionProps): JSX.Element => {
  return (
    <>
      <RenderLineItem
        id={props.id}
        value={props.value}
        label={props.label}
        setValue={props.setValue}
        type={props.type}
        availableValues={props.availablValues}
        canAddItems={props.canAddItems}
        canMoveItems={props.canMoveItems}
        canRemoveItems={props.canRemoveItems}
      />
      <div className="aiox-button-holder">
        {typeof props.moveUp === "function" ? (
          <div
            id={`${props.id}-up`}
            className="aiox-button aiox-up"
            onClick={props.moveUp}
          />
        ) : typeof props.moveDown === "function" ? (
          <div
            className="aiox-button"
            style={{ margin: 0 }}
          />
        ) : (
          <></>
        )}
        {typeof props.addItem === "function" ? (
          <div
            id={`${props.id}-add`}
            className="aiox-button aiox-plus"
            onClick={props.addItem}
          >
            {props.children}
          </div>
        ) : (
          <></>
        )}
        {typeof props.removeItem === "function" ? (
          <div
            id={`${props.id}-remove`}
            className="aiox-button aiox-minus"
            onClick={props.removeItem}
          />
        ) : (
          <></>
        )}
        {typeof props.moveDown === "function" ? (
          <div
            id={`${props.id}-down`}
            className="aiox-button aiox-down"
            onClick={props.moveDown}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

AioPrintOption.displayName = "AioPrintOption";
