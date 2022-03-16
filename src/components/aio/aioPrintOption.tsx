import * as React from "react";
import { AioExpander } from "./aioExpander";
import { AioNumber } from "./aioNumber";
import { AioString } from "./aioString";
import { AioSelect } from "./aioSelect";
import { AioReplacementDisplay } from "./aioReplacementDisplay";
import { AioReplacement, AioOptionType } from "./aioInterface";
import { AioLabel } from "./aioLabel";

interface AioPrintOptionProps {
  id: string,
  value: any,
  label?: string,
  type?: AioOptionType | string,
  availablValues?: Array<string>,
  setValue?: (value: any) => void,
  canAddItems?: boolean,
  canMoveItems?: boolean,
  canRemoveItems?: boolean,
  moveUp?: () => void,
  moveDown?: () => void,
  addItem?: () => void,
  removeItem?: () => void,
  children?: | React.ReactChild | React.ReactChild[],
};

interface RenderLineItemProps {
  value: any,
  label?: string,
  availableValues?: Array<string>,
  setValue?: (value: any) => void,
  type?: string,
  canAddItems?: boolean,
  canMoveItems?: boolean,
  canRemoveItems?: boolean,
}

const RenderLineItem = (props: RenderLineItemProps): JSX.Element => {

  // Take given type, or treat null as a string, or work out what we have
  switch (props.type ?? (props.value === null ? "string" : typeof (props.value))) {

    // Processing - do nothing, this should not be hit here
    // case (AioOptionType.processing): return (<></>);

    // Object, need another expander
    case ("object"):
    case (AioOptionType.object):
      return (
        <AioExpander
          label={props.label}
          inputObject={props.value}
          updateObject={(typeof (props.setValue) === "function")
            ?
            (ret: object) => { props.setValue!(ret); }
            :
            undefined
          }
          canAddItems={props.canAddItems}
          canMoveItems={props.canMoveItems}
          canRemoveItems={props.canRemoveItems}
        />
      );

    // Replacements
    case (AioOptionType.replacements):
      return (
        <AioReplacementDisplay
          value={props.value}
          setValue={(typeof (props.setValue) === "function")
            ?
            (ret: AioReplacement[]) => { props.setValue!(ret); }
            :
            undefined
          }
        />
      );

    // Select
    case (AioOptionType.select):
      return (
        <AioSelect
          label={props.label}
          value={props.value}
          availableValues={props.availableValues}
          setValue={(typeof (props.setValue) === "function")
            ?
            (ret: string) => { props.setValue!(ret); }
            :
            undefined
          }
        />
      );

    // Number
    case (AioOptionType.number):
    case ("number"):
      return (
        <AioNumber
          label={props.label}
          value={props.value}
          setValue={(typeof (props.setValue) === "function")
            ?
            (ret: number) => { props.setValue!(ret); }
            :
            undefined
          }
        />
      );

    // String or default
    case (AioOptionType.string):
    case ("string"):
      return (
        <AioString
          label={props.label}
          value={props.value}
          setValue={(typeof (props.setValue) === "function")
            ?
            (ret: string) => { props.setValue!(ret); }
            :
            undefined
          }
        />
      );
    default:
      return (<AioLabel label={"Missing type"} noColon={true} />);
  }
}

export const AioPrintOption = (props: AioPrintOptionProps): JSX.Element => {
  return (
    <>
      <RenderLineItem
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
        {typeof (props.moveUp) === "function"
          ? <div className="aiox-button aiox-up" onClick={props.moveUp} />
          : typeof (props.moveDown) === "function"
            ? <div className="aiox-button" style={{ margin: 0 }} />
            : <></>
        }
        {typeof (props.addItem) === "function" ? <div className="aiox-button aiox-plus" onClick={props.addItem}>{props.children}</div> : <></>}
        {typeof (props.removeItem) === "function" ? <div className="aiox-button aiox-minus" onClick={props.removeItem} /> : <></>}
        {typeof (props.moveDown) === "function" ? <div className="aiox-button aiox-down" onClick={props.moveDown} /> : ""}
      </div>
    </>
  );
}
