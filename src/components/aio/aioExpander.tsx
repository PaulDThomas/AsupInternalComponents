import React, { useState } from "react"
import { AioPrintOption } from "./aioPrintOption";
import { AioLabel } from "./aioLabel";
import { AioArraySortable } from "./aioArraySortable";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
import { AioNewItem, AioOptionGroup, AioOptionType } from "./aioInterface";
import { AioOptionDisplay } from "./aioOptionDisplay";

interface AioExpanderProps {
  inputObject: { [key: string]: any },
  label?: string,
  showBorders?: boolean,
  updateObject?: (value: any) => void,
  canAddItems?: boolean,
  canMoveItems?: boolean,
  canRemoveItems?: boolean,
};

export const AioExpander = (props: AioExpanderProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewItemWindow, setShowNewItemWindow] = useState(false);

  const onClickAdd = (ret: AioOptionGroup) => {
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
      console.log("Close window");
      setShowNewItemWindow(false);
    }
  }


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
            <div className={`aiox-table ${props.showBorders && "show-borders"}`}>
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
                  {(Object.keys(props.inputObject).length === 0) && <div className="aio-body-row"><div className="aio-label"><em>Empty object</em></div></div>}
                  {Object.keys(props.inputObject).map((k: string, i: number) => {
                    return (
                      <div className="aio-body-row" key={i}>
                        <AioPrintOption
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
                  {(props.canAddItems && props.updateObject)
                    ?
                    <div className="aio-body-row" key={"n"}>
                      <div className="aio-label" />
                      <div className="aio-input-holder" style={{ borderLeft: "0" }} />
                      <div className="aiox-button-holder">
                        <div className="aiox-button aiox-plus" onClick={() => { setShowNewItemWindow(true) }} />
                        {showNewItemWindow &&
                          <AsupInternalWindow
                            Title={"Add item"}
                            Visible={showNewItemWindow}
                            onClose={() => setShowNewItemWindow(false)}
                            style={{ minHeight: "120px" }}
                          >
                            <AioOptionDisplay
                              options={[
                                { type: AioOptionType.string, optionName: AioNewItem.newKey, value: "", label: "New key" },
                                { type: AioOptionType.select, optionName: AioNewItem.newType, value: "", label: "New type", availableValues: ["string", "number", "array", "object"] },
                              ] as AioOptionGroup}
                              setOptions={onClickAdd}
                              buttonText="Add" />
                          </AsupInternalWindow>
                        }
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