import * as React from "react";
import { useState } from "react"
import { AioPrintItem } from "./aioPrintItem";
import { AioLabel } from "./aioLabel";
import { AioArraySortable } from "./aioArraySortable";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AioString } from "./aioString";
import { AioNewItem, OptionGroup, OptionType } from "./aioInterface";
import { AioOptionGroup } from "./aioOptionGroup";

interface AioExpanderProps {
  inputObject: { [key: string]: any },
  label?: string,
  updateObject?: (value: any) => void,
  canAddItems?: boolean,
  canMoveItems?: boolean,
  canRemoveItems?: boolean,
};

export const AioExpander = (props: AioExpanderProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [showNewItemWindow, setShowNewItemWindow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newItem, setNewItem] = useState<OptionGroup>([
    { type: OptionType.string, optionName: AioNewItem.newKey, value: "", label: "New key" },
    { type: OptionType.select, optionName: AioNewItem.newType, value: "", label: "New type", availableValues: ["string", "number", "array", "object"] },
  ]);

  // Show nothing
  if (!props.inputObject) { return (<></>); }

  // Small view
  if (!isExpanded) {
    return (
      <>
        <AioLabel label={props.label} />
        <div className="aio-input-holder">
          <span className="aiox closed">
            <div className="aiox-button" onClick={(e) => setIsExpanded(true)} />
            <span className="aiox-value">{
              Array.isArray(props.inputObject)
                ? Object.values(props.inputObject).filter(el => typeof (el) === "object").length > 0
                  ? `${props.inputObject.length} item${props.inputObject.length !== 1 ? "s" : ""}`
                  : Object.values(props.inputObject).join(", ")
                : Object.keys(props.inputObject)
                  .map((a: string) => { return typeof (props.inputObject[a]) === "object" ? a : props.inputObject[a]; })
                  .join(", ")
            }</span>
          </span>
        </div>
      </>
    );
  }

  // Expanded view
  else {
    return (
      <>
        <AioLabel label={props.label} />
        <div className="aio-input-holder">
          <span className="aiox open">
            <div className="aiox-button" onClick={(e) => setIsExpanded(false)} />
            <div className="aiox-table">
              {Array.isArray(props.inputObject)
                ?
                <AioArraySortable
                  inputArray={props.inputObject}
                  updateArray={props.updateObject}
                  canRemoveItems={props.canRemoveItems}
                  canAddItems={props.canAddItems}
                  canMoveItems={props.canMoveItems}
                />
                :
                <>
                  {Object.keys(props.inputObject).map((k: string, i: number) => {
                    return (
                      <div className="aio-body-row" key={i}>
                        <AioPrintItem
                          id={k}
                          label={k}
                          value={props.inputObject[k]}
                          setValue={
                            (props.updateObject) ? (ret) => {
                              const newObject = { ...props.inputObject };
                              newObject[k] = ret;
                              if (props.updateObject) props.updateObject(newObject);
                            } : undefined
                          }
                          removeItem={
                            (props.canRemoveItems && props.updateObject)
                              ?
                              () => {
                                const newObject = { ...props.inputObject };
                                delete newObject[k];
                                if (props.updateObject) props.updateObject(newObject);
                              }
                              :
                              undefined
                          }
                          canAddItems={props.canAddItems}
                          canMoveItems={props.canMoveItems}
                          canRemoveItems={props.canRemoveItems}
                        />
                      </div>
                    );
                  })}
                  {(Object.keys(props.inputObject).length === 0) && <div className="aio-body-row"><div className="aio-label"><em>Empty</em></div></div>}
                  {(props.canAddItems && props.updateObject)
                    ?
                    <div className="aio-body-row" key={"n"}>
                      <div className="aio-label" />
                      <div className="aio-input-holder" style={{borderLeft:"0"}} />
                      <div className="aiox-button-holder">
                        <div className="aiox-button aiox-plus" onClick={() => { setShowNewItemWindow(true) }}>
                          <AsupInternalWindow
                            Title={"Add item"}
                            Visible={showNewItemWindow}
                            onClose={() => setShowNewItemWindow(false)}
                            style={{ minHeight: "120px" }}
                          >
                            <AioOptionGroup
                              initialData={newItem}
                              returnData={
                                (ret) => {
                                  // Check value is ok
                                  if (ret[0].value !== "" && Object.keys(props.inputObject).indexOf(ret[0].value) === -1 && props.updateObject) {
                                    console.log(`Adding new key: ${ret[0].value}`);
                                    let newItem;
                                    switch (ret[1].value) {
                                      case ("number"):
                                        newItem = 0;
                                        break;
                                      case ("array"):
                                        newItem = [];
                                        break;
                                      case ("object"):
                                        newItem = {};
                                        break;
                                      case ("string"):
                                      default:
                                        newItem = "";
                                    }
                                    const newObject = { ...props.inputObject };
                                    newObject[ret[0].value] = newItem;
                                    props.updateObject(newObject);
                                    setShowNewItemWindow(false);
                                  }
                                }
                              }
                              buttonText="Add" />
                          </AsupInternalWindow>
                        </div>
                      </div>
                    </div>
                    :
                    undefined
                  }
                </>
              }
            </div>
          </span>
        </div >
      </>
    );
  }
}