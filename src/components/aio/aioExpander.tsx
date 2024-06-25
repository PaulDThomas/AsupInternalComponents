import { ContextWindow } from "@asup/context-menu";
import { useState } from "react";
import { AioArraySortable } from "./aioArraySortable";
import { AioNewItem, AioOption, AioOptionType } from "./interface";
import { AioLabel } from "./aioLabel";
import { AioOptionDisplay } from "./aioOptionDisplay";
import { AioPrintOption } from "./aioPrintOption";

interface AioExpanderProps {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputObject?: { [key: string]: any };
  label?: string;
  showBorders?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateObject?: (value: any) => void;
  canAddItems?: boolean;
  canMoveItems?: boolean;
  canRemoveItems?: boolean;
}

export const AioExpander = (props: AioExpanderProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewItemWindow, setShowNewItemWindow] = useState(false);

  const onClickAdd = (ret: AioOption[]) => {
    if (props.inputObject === undefined) return;
    // Check value is ok
    if (
      ret[0].value !== "" &&
      Object.keys(props.inputObject).indexOf(ret[0].value as string) === -1 &&
      props.updateObject
    ) {
      let newItem;
      switch (ret[1].value) {
        case "number":
          newItem = 0;
          break;
        case "array":
          newItem = [];
          break;
        case "object":
          newItem = {};
          break;
        case "string":
        default:
          newItem = "";
      }
      const newObject: { [key: string]: unknown } = { ...props.inputObject };
      newObject[ret[0].value as string] = newItem;
      props.updateObject(newObject);
      setShowNewItemWindow(false);
    }
  };

  // Show nothing
  if (!props.inputObject && (props.inputObject === undefined || props.inputObject === null)) {
    return <></>;
  }

  // Small view
  if (!isExpanded) {
    return (
      <>
        <AioLabel
          id={`${props.id}-label`}
          label={props.label}
        />
        <div
          id={props.id}
          className="aio-input-holder"
        >
          <span
            id={`${props.id}-expander`}
            className="aiox closed"
          >
            {typeof props.inputObject === "object" && (
              <div
                id={`${props.id}-expanderbutton`}
                className="aiox-button aiox-open-close"
                onClick={() => setIsExpanded(true)}
              />
            )}
            <span
              id={`${props.id}-valueholder`}
              className="aiox-value"
            >
              {Array.isArray(props.inputObject) ? (
                Object.values(props.inputObject).filter((el) => typeof el === "object").length >
                0 ? (
                  `${props.inputObject.length} item${props.inputObject.length !== 1 ? "s" : ""}`
                ) : (
                  Object.values(props.inputObject).join(", ")
                )
              ) : typeof props.inputObject === "object" &&
                props.inputObject !== undefined &&
                props.inputObject !== null ? (
                Object.keys(props.inputObject)
                  .map((a: string) => {
                    return props.inputObject && typeof props.inputObject[a] === "object"
                      ? a
                      : props.inputObject !== undefined
                        ? props.inputObject[a]
                        : a;
                  })
                  .join(", ")
              ) : props.inputObject !== undefined && props.inputObject !== null ? (
                <AioPrintOption
                  id={`${props.id}-one`}
                  value={props.inputObject}
                />
              ) : (
                "Input object is not defined"
              )}
            </span>
          </span>
        </div>
      </>
    );
  }

  // Expanded view
  else {
    return (
      <>
        <AioLabel
          id={`${props.id}-label`}
          label={props.label}
        />
        <div
          id={`${props.id}`}
          className="aio-input-holder"
        >
          <span
            id={`${props.id}-expander`}
            className="aiox open"
          >
            <div
              id={`${props.id}-expanderbutton`}
              className="aiox-button aiox-open-close"
              onClick={() => setIsExpanded(false)}
            />
            <div className={`aiox-table ${props.showBorders && "show-borders"}`}>
              {Array.isArray(props.inputObject) ? (
                <AioArraySortable
                  id={`${props.id}-arraysortable`}
                  inputArray={props.inputObject}
                  updateArray={props.updateObject}
                  canRemoveItems={props.canRemoveItems}
                  canAddItems={props.canAddItems}
                  canMoveItems={props.canMoveItems}
                />
              ) : (
                <>
                  {Object.keys(props.inputObject).length === 0 && (
                    <div
                      id={`${props.id}-empty`}
                      className="aio-body-row"
                    >
                      <div className="aio-label">
                        <em>Empty object</em>
                      </div>
                    </div>
                  )}
                  {Object.keys(props.inputObject).map((k: string, i: number) => {
                    if (!props.inputObject) return <></>;
                    return (
                      <div
                        className="aio-body-row"
                        key={i}
                      >
                        <AioPrintOption
                          id={`${props.id}-${k}`}
                          label={k}
                          value={props.inputObject[k]}
                          setValue={
                            props.updateObject
                              ? (ret) => {
                                  const newObject = { ...props.inputObject };
                                  newObject[k] = ret;
                                  if (props.updateObject) props.updateObject(newObject);
                                }
                              : undefined
                          }
                          removeItem={
                            props.canRemoveItems && props.updateObject
                              ? () => {
                                  const newObject = { ...props.inputObject };
                                  delete newObject[k];
                                  if (props.updateObject) props.updateObject(newObject);
                                }
                              : undefined
                          }
                          canAddItems={props.canAddItems}
                          canMoveItems={props.canMoveItems}
                          canRemoveItems={props.canRemoveItems}
                        />
                      </div>
                    );
                  })}
                  {props.canAddItems && props.updateObject ? (
                    <div
                      className="aio-body-row"
                      key={"n"}
                    >
                      <div className="aio-label" />
                      <div
                        className="aio-input-holder"
                        style={{ borderLeft: "0" }}
                      />
                      <div className="aiox-button-holder">
                        <div
                          className="aiox-button aiox-plus"
                          onClick={() => {
                            setShowNewItemWindow(!showNewItemWindow);
                          }}
                        />
                        {showNewItemWindow && (
                          <ContextWindow
                            id={`${props.id}-newitemwindow`}
                            title={"Add item"}
                            visible={showNewItemWindow}
                            onClose={() => setShowNewItemWindow(false)}
                            style={{ minHeight: "120px" }}
                          >
                            <AioOptionDisplay
                              id={`${props.id}-optiondisplay`}
                              options={[
                                {
                                  type: AioOptionType.string,
                                  optionName: AioNewItem.newKey,
                                  value: "",
                                  label: "New key",
                                },
                                {
                                  type: AioOptionType.select,
                                  optionName: AioNewItem.newType,
                                  value: "",
                                  label: "New type",
                                  availableValues: ["string", "number", "array", "object"],
                                },
                              ]}
                              setOptions={onClickAdd}
                            />
                          </ContextWindow>
                        )}
                      </div>
                    </div>
                  ) : undefined}
                </>
              )}
            </div>
          </span>
        </div>
      </>
    );
  }
};

AioExpander.displayName = "AioExpander";
