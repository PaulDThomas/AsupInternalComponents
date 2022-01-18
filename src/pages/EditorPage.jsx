import { useState } from 'react';
import { AsupInternalEditor } from '../components/aie/AsupInternalEditor';
import { convertFromHTML } from 'draft-js';

export const EditorPage = () => {
  const [text, setText] = useState();
  const [raw, setRaw] = useState();
  const [html, setHtml] = useState();
  // eslint-disable-next-line no-unused-vars
  const [text2, setText2] = useState();
  const [initialText, setInitialText] = useState(JSON.parse(`
    {
      "blocks": [
        {
          "key": "1i66t",
          "text": "here there is a man",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [
            {
              "offset": 0,
              "length": 19,
              "style": "Notes"
            }
          ],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "8qe70",
          "text": "",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "avpaf",
          "text": "<script>'destroy' \\"everything\\"</script>",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [
            {
              "offset": 0,
              "length": 9,
              "style": "Notes"
            },
            {
              "offset": 30,
              "length": 9,
              "style": "Notes"
            },
            {
              "offset": 9,
              "length": 21,
              "style": "Optional"
            }
          ],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "5m427",
          "text": "of many talents",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [
            {
              "offset": 0,
              "length": 3,
              "style": "Notes"
            },
            {
              "offset": 8,
              "length": 7,
              "style": "Notes"
            },
            {
              "offset": 3,
              "length": 5,
              "style": "Editable"
            }
          ],
          "entityRanges": [],
          "data": {}
        }
      ],
      "entityMap": {}
    }`));
  // eslint-disable-next-line no-unused-vars
  const [initialText2, setInitialText2] = useState();

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
    <div
      style={{
        margin: "1rem",
        padding: "1rem",
      }}
    >
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
        marginTop: "1rem",
        padding: "1rem",
        border: "solid black 3px"
      }}>
        <button onClick={dothing}>set</button>
        <button onClick={save}>save</button>
        <button onClick={load}>load</button>
        <h5>Text</h5>
        <pre>{text}</pre>
        <h5>HTML</h5>
        <p dangerouslySetInnerHTML={{ __html: html }}></p>
        <h5>Raw</h5>
        <pre>{JSON.stringify(raw, null, 2)}</pre>
      </div>
    </div>
  );
}