import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AsupInternalEditor } from '../components';

export const EditorPage = () => {
  const [text, setText] = useState(`<div classname="aie-text" data-inline-style-ranges="[{&quot;offset&quot;:0,&quot;length&quot;:5,&quot;style&quot;:&quot;Notes&quot;}]"><span classname="Notes" style="color:blue;font-size:16pt">Notes</span>  work</div>`);

  const dothing = () => {
    console.log("Update");
    var newThing = "<p color='red'>Here</p><span style='color:red'>ref</span>";
    setText(newThing);
  }

  const save = () => {
    window.localStorage.setItem('content', JSON.stringify(text));
    console.log("Saved: ");
    console.log(text);
  }

  const load = () => {
    var saved = JSON.parse(window.localStorage.getItem('content') ?? "");
    setText(saved);
  }

  const thisStyleMap = {
    Editable: { css: { color: "red", fontFamily: "courier", fontSize: "16pt" }, aieExclude: ["Optional", "Notes"] },
    Optional: { css: { color: "green", fontWeight: "100", fontFamily: "serif", fontSize: "16pt" }, aieExclude: ["Editable", "Notes"] },
    Notes: { css: { color: "blue", fontSize: "16pt" }, aieExclude: ["Editable", "Optional"] },
  };


  let locn = useLocation();

  return (
    <div
      style={{
        margin: "1rem",
        padding: "1rem",
      }}
    >
      <table>
        <tbody>
          <tr>
            <td>
              <AsupInternalEditor
                value={text}
                setValue={setText}
                showStyleButtons={true}
                style={{ width: "195px", height: "100%" }}
                textAlignment={"left"}
                styleMap={thisStyleMap}
              />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <AsupInternalEditor
                value={text}
                setValue={setText}
                showStyleButtons={true}
                style={{ width: "195px", height: "100%" }}
                textAlignment={"decimal"}
                styleMap={thisStyleMap}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <AsupInternalEditor
                value={text}
                setValue={setText}
                showStyleButtons={true}
                style={{ width: "196px", height: "100%" }}
                textAlignment={"center"}
                styleMap={thisStyleMap}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <AsupInternalEditor
        value={text}
        setValue={setText}
        showStyleButtons={true}
        style={{ width: "600px", height: "100%" }}
        textAlignment={"right"}
        styleMap={thisStyleMap}
      />

      <div style={{
        marginTop: "1rem",
        padding: "1rem",
        border: "solid black 3px"
      }}>
        <div>Current location is... {locn.pathname}</div>
        <button onClick={dothing}>set</button>
        <button onClick={save}>save</button>
        <button onClick={load}>load</button>
        <h5>Text</h5>
        <pre>{text}</pre>
        <h5>HTML</h5>
        <p dangerouslySetInnerHTML={{ __html: text }}></p>
      </div>
    </div>
  );
}