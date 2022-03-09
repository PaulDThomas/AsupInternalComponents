import React from "react";
import { useState, useRef } from "react";

// tell direction after drag start, the first dirction that reach 5px offset
const DRAG_DIRECTION_NONE = "";
const DRAG_DIRECTION_ROW = "row";
const DRAG_DIRECTION_COLUMN = "column";

const defaultDrageState = {
  column: -1,
  row: -1,
  startPoint: null,
  direction: DRAG_DIRECTION_NONE, // row=move up down/column=move left right,
  dropIndex: -1 // drag target
};

const ReactTableDragColumnRow = props => {
  let { heads = [], rows = [], onDragEnd } = props;
  let [dragState, setDragState] = useState({ ...defaultDrageState });
  const headsEl = useRef(null),
    rowsEl = useRef(null),
    preview = useRef(null);

  if (dragState.direction === DRAG_DIRECTION_COLUMN) {
    heads = offsetIndex(dragState.column, dragState.dropIndex, heads);
    rows = rows.map(x => offsetIndex(dragState.column, dragState.dropIndex, x));
  }

  if (dragState.direction === DRAG_DIRECTION_ROW) {
    rows = offsetIndex(dragState.row, dragState.dropIndex, rows);
  }

  // console.log(JSON.stringify(dragState))
  return (
    <>
      <table>
        <thead>
          <tr ref={headsEl}>
            {heads.map((x, i) => (
              <th key={i}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody ref={rowsEl}>
          {rows.map((x = [], i) => (
            <tr key={i}>
              {x.map((y, j) => (
                <td
                  key={j}
                  style={{
                    height: "40px",
                    width: "40px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    border: "1px solid black",
                    cursor: dragState.direction ? "move" : "grab",
                    opacity:
                      dragState.direction === DRAG_DIRECTION_COLUMN
                        ? dragState.dropIndex === j
                          ? 0.5
                          : 1
                        : dragState.direction === DRAG_DIRECTION_ROW
                          ? dragState.dropIndex === i
                            ? 0.5
                            : 1
                          : 1
                  }}
                  draggable="true"
                  onDragStart={e => {
                    console.log(`onDragStart`);
                    e.dataTransfer.setDragImage(preview.current, 0, 0);
                    setDragState({
                      ...dragState,
                      row: i,
                      column: j,
                      startPoint: {
                        x: e.pageX,
                        y: e.pageY
                      }
                    });
                  }}
                  onDragEnter={e => {
                    console.log(`onDragEnter`);
                    if (!dragState.direction) {
                      if (dragState.column !== j) {
                        setDragState({
                          ...dragState,
                          direction: DRAG_DIRECTION_COLUMN,
                          dropIndex: j
                        });
                        return;
                      }
                      if (dragState.row !== i) {
                        setDragState({
                          ...dragState,
                          direction: DRAG_DIRECTION_ROW,
                          dropIndex: i
                        });
                        return;
                      }
                      return;
                    }

                    if (dragState.direction === DRAG_DIRECTION_COLUMN) {
                      if (j !== dragState.dropIndex) {
                        setDragState({
                          ...dragState,
                          dropIndex: j
                        });
                      }
                      return;
                    }
                    if (dragState.direction === DRAG_DIRECTION_ROW) {
                      if (i !== dragState.dropIndex) {
                        setDragState({
                          ...dragState,
                          dropIndex: i
                        });
                      }
                      return;
                    }
                  }}
                  onDragEnd={() => {
                    console.log(`onDragEnd`);
                    onDragEnd(
                      dragState.direction,
                      dragState.direction === DRAG_DIRECTION_COLUMN
                        ? dragState.column
                        : dragState.row,
                      dragState.dropIndex,
                      { heads, rows }
                    );
                    setDragState({ ...defaultDrageState });
                  }}
                >
                  <span>
                    <input style={{width:"25px"}} value={y} readOnly/>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        ref={preview}
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden"
        }}
      />
    </>
  );
};

function offsetIndex(from, to, arr = []) {
  if (from < to) {
    let start = arr.slice(0, from),
      between = arr.slice(from + 1, to + 1),
      end = arr.slice(to + 1);
    return [...start, ...between, arr[from], ...end];
  }
  if (from > to) {
    let start = arr.slice(0, to),
      between = arr.slice(to, from),
      end = arr.slice(from + 1);
    return [...start, arr[from], ...between, ...end];
  }
  return arr;
}

export const Table2 = () => {
  let [data, setData] = useState({
    heads: ["a", "b", "c", "d", "e", "f"],
    rows: [
      [1, 2, 3, 1, 2, 3],
      [11, 2, 3, 11, 2, 3],
      [1, 22, 3, 1, 22, 3],
      [1, 2, 33, 1, 2, 33]
    ]
  });
  return (
    <div>
      <h1>react table drag column row</h1>
      <div style={{ padding: "1rem" }}>
        <ReactTableDragColumnRow
          heads={data.heads}
          rows={data.rows}
          onChange={() => { console.log("drag end") }}
          onDragEnd={(type, from, to, newData) => {
            console.log({
              type,
              from,
              to,
              newData
            });
            setData(newData);
          }}
        />
      </div>
    </div>
  );
}

