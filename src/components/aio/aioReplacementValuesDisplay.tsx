import React, { useCallback, useEffect, useState } from 'react';
import { AioReplacementValue } from './aioInterface';

interface AioReplacementValueDisplayProps {
  values?: AioReplacementValue[],
  setValues?: (ret: AioReplacementValue[]) => void,
  level: number,
}

export const AioReplacementValueDisplay = (props: AioReplacementValueDisplayProps): JSX.Element => {

  const [currentText, setCurrentText] = useState(props.values && props.values.length > 0 ? props.values.map(rv => rv.newText).join("\n") : "");
  const [lastSend, setLastSend] = useState(props.values && props.values.length > 0 ? props.values.map(rv => rv.newText).join("\n") : "");

  useEffect(() => {
    if ((typeof props.setValues) !== "function") return;
    if (currentText !== lastSend) {
      props.setValues!(currentText.split("\n").map(t => { return { newText: t }; }));
      setLastSend(currentText);
    }
  }, [currentText, lastSend, props.setValues]);

  const updateNewText = useCallback((ret: string, i: number) => {
    if ((typeof props.setValues) !== "function") return;
    let newValues = [...(props.values ?? [])];
    newValues[i].newText = ret;
    props.setValues!(newValues);
  }, [props]);

  const updateSubList = useCallback((ret: AioReplacementValue[], i: number) => {
    if ((typeof props.setValues) !== "function") return;
    let newValues = [...(props.values ?? [])];
    newValues[i].subList = ret;
    props.setValues!(newValues);
  }, [props]);

  const addEntry = useCallback(() => {
    let newValues = [...(props.values ?? [])];
    newValues.push({ newText: "", subList: [{ newText: "" }] });
    props.setValues!(newValues);
  }, [props]);

  const removeEntry = useCallback(() => {
    let newValues = [...(props.values ?? [])];
    newValues.pop();
    props.setValues!(newValues);
  }, [props]);

  if (props.values === undefined) return (<></>);

  if (!props.values.some(rv => rv.subList !== undefined)) {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ minWidth: "180px", width: "180px" }}>
          <textarea
            className={"aio-input"}
            rows={4}
            value={currentText}
            onChange={(e) => { setCurrentText(e.currentTarget.value); }}
            style={{ width: "168px", minWidth: "168px" }}
          />
        </div>
      </div>
    );
  }
  return (<>
    {props.values.map((rv, i) => {
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
              level={props.level + 1}
            />
          </div>
        </div>)
        ;
    })}
    {(typeof (props.setValues) === "function") &&
      <div style={{ display: "flex", flexDirection: "column", alignContent: "flex-start", marginBottom: "4px" }}>
        <div className="aiox-button-holder" style={{ minWidth: "180px", width: "180px", display: "flex", justifyContent: "center" }}>
          <div className={"aiox-button aiox-plus"} onClick={addEntry} />
          {props.values.length > 1 && <div className={"aiox-button aiox-minus"} onClick={removeEntry} />}
        </div>
      </div>
    }
  </>);
}