import React, { useCallback, useState } from 'react';
import { AioReplacement, AioReplacementValue } from './aioInterface';

interface AioReplacementValueDisplayProps {
  values?: AioReplacementValue[],
  setValues?: (ret: AioReplacementValue[]) => void,
  externalLists?: AioReplacement[],
  externalName?: string,
  level: number,
}

export const AioReplacementValueDisplay = ({ values, setValues, level, externalLists, externalName }: AioReplacementValueDisplayProps): JSX.Element => {

  const [currentText, setCurrentText] = useState(values && values.length > 0 ? values.map(rv => rv.newText).join("\n") : "");

  // Return data from the component
  const returnData = useCallback((newValues: AioReplacementValue[]) => {
    if ((typeof setValues) !== "function") return;
    setValues!(newValues);
  }, [setValues]);

  // Update entry in an input
  const updateNewText = useCallback((ret: string, i: number) => {
    let newValues = [...(values ?? [])];
    newValues[i].newText = ret;
    returnData(newValues);
  }, [returnData, values]);

  // Update from a sublist
  const updateSubList = useCallback((ret: AioReplacementValue[], i: number) => {
    let newValues = [...(values ?? [])];
    newValues[i].subList = ret;
    returnData(newValues);
  }, [returnData, values]);

  // Add a new input
  const addEntry = useCallback((i: number) => {
    let newValues = [...(values ?? [])];
    newValues.splice(i + 1, 0, { newText: "", subList: [{ newText: "" }] })
    returnData(newValues);
  }, [returnData, values]);

  // Remove an input
  const removeEntry = useCallback((i: number) => {
    let newValues = [...(values ?? [])];
    newValues.splice(i, 1);
    returnData(newValues);
  }, [returnData, values]);

  // Show nothing if there is nothing to show
  if (values === undefined) return (<></>);

  // Create textarea if there are no sublists
  if (!values.some(rv => rv.subList !== undefined)) {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ minWidth: "180px", width: "180px" }}>
          {typeof setValues === "function"
            ?
            <textarea
              className={"aio-input"}
              rows={4}
              value={currentText}
              onChange={e => {
                setCurrentText(e.currentTarget.value)
                returnData(e.currentTarget.value.split("\n").map(t => { return { newText: t }; }));
              }}
              style={{ width: "168px", minWidth: "168px" }}
            />
            :
            <div style={{ border: "1px black solid", borderRadius: "2px", padding: "2px" }}>{values.map((rep, repi) =>
              <div key={repi} style={{ lineHeight: "1.1", fontSize: "75%", fontStyle: "italic" }}>{rep.newText}</div>
            )}</div>
          }
        </div>
      </div>
    );
  }

  // Create inputs with sublists if at least one sublist exists
  return (<>
    {values.map((rv, i) => {
      return (
        <div key={i} style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", width: "169px", minWidth: "169px" }}>
            {typeof setValues === "function"
              ?
              <>
                <input
                  key={`t${i}`}
                  className={"aio-input"}
                  value={rv.newText}
                  type="text"
                  onChange={(e) => updateNewText(e.currentTarget.value, i)}
                  style={{ width: "157px", minWidth: "157px" }}
                />
                {/* Buttons to add or remove inputs */}
                <div className="aiox-button-holder" style={{ minWidth: "155px", width: "155px", display: "flex", marginTop: "2px", justifyContent: "center" }}>
                  <div className={"aiox-button aiox-plus"} onClick={() => addEntry(i)} />
                  {values.length > 1 && <div className={"aiox-button aiox-minus"} onClick={() => removeEntry(i)} />}
                </div>
              </>
              :
              <div className='aio-input' style={{
                padding: "2px 4px",
                marginBottom: "2px",
                width: "155px",
                minWidth: "155px",
              }}>
                <div style={{ lineHeight: "1.1", fontSize: "75%", fontStyle: "italic" }}>{rv.newText}</div>
              </div>
            }
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderBottom: "1px burlywood solid", borderBottomRightRadius: "4px", }} />
            <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderTop: "1px burlywood solid", borderTopRightRadius: "4px", }} />
          </div>
          <div style={{ minWidth: "5px", width: "5px", marginTop: "6px", marginBottom: "6px", borderLeft: "1px burlywood solid", borderTop: "1px burlywood solid", borderBottom: "1px burlywood solid", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", }} />
          <div>
            {typeof setValues === "function"
              ?
              <AioReplacementValueDisplay
                values={rv.subList ?? [{ newText: "" }]}
                setValues={(ret) => updateSubList(ret, i)}
                level={level + 1}
              />
              :
              <AioReplacementValueDisplay
                values={rv.subList ?? [{ newText: "" }]}
                level={level + 1}
              />
            }
          </div>
        </div>)
        ;
    })}
  </>);
}