import React, { useCallback } from 'react';
import { AioReplacementValue } from './aioInterface';

interface AioReplacementValueDisplayProps {
  values?: AioReplacementValue[],
  setValues?: (ret: AioReplacementValue[]) => void,
  level: number,
}

export const AioReplacementValueDisplay = ({values, setValues, level}: AioReplacementValueDisplayProps): JSX.Element => {

  const returnData = useCallback((newValues:AioReplacementValue[]) => {
    if ((typeof setValues) !== "function") return;
    setValues!(newValues);
  }, [setValues]);

  const updateNewText = useCallback((ret: string, i: number) => {
    let newValues = [...(values ?? [])];
    newValues[i].newText = ret;
    returnData(newValues);
  }, [returnData, values]);

  const updateSubList = useCallback((ret: AioReplacementValue[], i: number) => {
    let newValues = [...(values ?? [])];
    newValues[i].subList = ret;
    returnData(newValues);
  }, [returnData, values]);

  const addEntry = useCallback(() => {
    let newValues = [...(values ?? [])];
    newValues.push({ newText: "", subList: [{ newText: "" }] });
    returnData(newValues);
  }, [returnData, values]);

  const removeEntry = useCallback(() => {
    let newValues = [...(values ?? [])];
    newValues.pop();
    returnData(newValues);
  }, [returnData, values]);

  if (values === undefined) return (<></>);

  if (!values.some(rv => rv.subList !== undefined)) {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ minWidth: "180px", width: "180px" }}>
          <textarea
            className={"aio-input"}
            rows={4}
            value={values?.map(rv => rv.newText).join("\n") ?? ""}
            onChange={e => { 
              returnData(e.currentTarget.value.split("\n").map(t => { return { newText: t }; }));
            }}
            style={{ width: "168px", minWidth: "168px" }}
          />
        </div>
      </div>
    );
  }
  return (<>
    {values.map((rv, i) => {
      return (
        <div key={i} style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", width: "169px", minWidth: "169px" }}>
            <input
              key={`t${i}`}
              className={"aio-input"}
              value={rv.newText}
              type="text"
              onChange={(e) => updateNewText(e.currentTarget.value, i)}
              style={{ width: "157px", minWidth: "157px" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderBottom: "1px burlywood solid", borderBottomRightRadius: "4px", }} />
            <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderTop: "1px burlywood solid", borderTopRightRadius: "4px", }} />
          </div>
          <div style={{ minWidth: "5px", width: "5px", marginTop: "6px", marginBottom: "6px", borderLeft: "1px burlywood solid", borderTop: "1px burlywood solid", borderBottom: "1px burlywood solid", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", }} />
          <div>
            <AioReplacementValueDisplay
              values={rv.subList ?? [{ newText: "" }]}
              setValues={(ret) => updateSubList(ret, i)}
              level={level + 1}
            />
          </div>
        </div>)
        ;
    })}
    {(typeof (setValues) === "function") &&
      <div style={{ display: "flex", flexDirection: "column", alignContent: "flex-start", marginBottom: "4px" }}>
        <div className="aiox-button-holder" style={{ minWidth: "180px", width: "180px", display: "flex", justifyContent: "center" }}>
          <div className={"aiox-button aiox-plus"} onClick={addEntry} />
          {values.length > 1 && <div className={"aiox-button aiox-minus"} onClick={removeEntry} />}
        </div>
      </div>
    }
  </>);
}