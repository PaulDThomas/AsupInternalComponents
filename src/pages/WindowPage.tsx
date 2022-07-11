import { AiwContext } from 'components/aiw/aiwContext';
import React, { useContext } from 'react';

export const WindowPage = () => {
  const windowContext = useContext(AiwContext);

  return (
    <div style={{
      margin: "1rem",
      padding: "1rem",
      border: "solid black 3px"
    }}>
      <label>
        Add Window
        &nbsp;
        <button
          name="showWindowCheck"
          onClick={(e) => {
            windowContext.openAiw({
              title: "This is the window title",
              elements: (<div style={{
                backgroundColor: "cyan",
                width: "100%",
                height: "100%",
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
              }}>
                <span>h</span>
              </div>)
            });
          }}
        >here</button>
      </label>
      <pre>
        {JSON.stringify(windowContext.aiwList, null, 2)}
      </pre>
    </div>
  );
}