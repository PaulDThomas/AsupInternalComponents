import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { AsupInternalEditor } from '../components/aie/AsupInternalEditor';
import { convertFromHTML } from 'draft-js';

export const EditorPage = () => {
  const [text, setText] = useState();
  const [raw, setRaw] = useState();
  const [html, setHtml] = useState();
  const [text2, setText2] = useState();
  const [initialText, setInitialText] = useState();
  const [initialText2, setInitialText2] = useState();
  const [firstLine, setFirstLine] = useState("Nothing");

  useEffect(() => {
    if (text !== undefined && text.blocks !== undefined) {
      setFirstLine(setText);
    }
  }, [text])

  const dothing = () => {
    console.log("Update");
    var newThing = convertFromHTML("<p color='red'>Here</p><span style='color:red'>ref</span>");
    newThing = "<p color='red'>Hello</p><span style='color:red'>world</span>";
    newThing = "Goodbye universe";
    setInitialText(newThing);
  }

  const save = () => {
    window.localStorage.setItem('content', JSON.stringify(raw));
    console.log("Saved: ");
    console.log(raw);
  }

  const load = () => {
    var saved = JSON.parse(window.localStorage.getItem('content'));
    setInitialText(saved);
  }

  return (
    <>
      <table style={{ padding: "1rem", border: "1px black solid" }}>
        <tbody>
          <tr>
            <td style={{ width: "400px", height: "100%" }}>
              <AsupInternalEditor
                initialText={initialText}
                returnText={setText}
                returnRaw={setRaw}
                returnHtml={setHtml}
                showStyleButtons={true}
                addStyle={{ width: "298px", height: "100%" }}
                textAlignment={"left"}
              />
              <AsupInternalEditor
                initialText={initialText2}
                returnText={setText2}
                addStyle={{ width: "98px" }}
                showStyleButtons={true}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{
        padding: "1rem",
        border: "solid black 3px"
      }}>
        <button onClick={dothing}>set</button>
        <button onClick={save}>save</button>
        <button onClick={load}>load</button>
        <pre>{text}</pre>
        <p dangerouslySetInnerHTML={{__html:html}}></p>
      </div>
    </>
  );
}