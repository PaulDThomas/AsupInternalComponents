import React, { useCallback, useRef, useState } from 'react';
import { AioReplacement, AitRowGroupData, AitTableData, AsupInternalTable } from '../components';

let sampleGroupTemplates: AitRowGroupData[] = [
  { name: "Empty section", rows: [{ cells: [] }], replacements: [] },
  {
    name: "Continuous statistics",
    rows: [{
      cells: [
        { text: "!!parameter!!" },
        { text: "!!statistic!!" },
        { text: "!!xval!!" },
        { text: "!!xval!!" },
        { text: "!!xval!!" },
        { text: "!!xval!!" },
        { text: "!!xval!!" },
        { text: "!!xval!!" },
        { text: "!!xval!!" },
        { text: "!!xval!!" },
      ]
    }],
    replacements: [
      { replacementTexts: [{ text: "!!parameter!!", spaceAfter: false }], replacementValues: [{ newText: "Enter parameter name" }] },
      {
        replacementTexts: [
          { text: "!!statistic!!", spaceAfter: false },
          { text: "!!xval!!", spaceAfter: false }
        ],
        replacementValues: [
          { newText: "n", subList: [{ newText: "xxx" }] },
          { newText: "Mean", subList: [{ newText: " xx.x" }] },
          { newText: "SD", subList: [{ newText: " xx.x" }] },
          { newText: "Median", subList: [{ newText: " xx.x" }] },
          { newText: "Min", subList: [{ newText: "  x" }] },
          { newText: "Max", subList: [{ newText: "xxx" }] }
        ],
      }
    ]
  },
  {
    name: "Categorical statistics",
    rows: [
      {
        cells: [
          { text: "!!parameter!!" },
        ]
      },
      {
        cells: [
          { text: "!!category!!", textIndents: 1 },
          { text: "!!statistic!!" },
          { text: "!!xval!!" },
          { text: "!!xval!!" },
          { text: "!!xval!!" },
          { text: "!!xval!!" },
          { text: "!!xval!!" },
          { text: "!!xval!!" },
          { text: "!!xval!!" },
          { text: "!!xval!!" },
        ]
      }
    ],
    replacements: [
      {
        replacementTexts: [
          { text: "!!parameter!!", spaceAfter: true },
          { text: "!!category!!", spaceAfter: false }
        ],
        replacementValues: [
          { newText: "Enter parameter names", subList: [{ newText: "Enter categories" }] }
        ]
      },
      {
        replacementTexts: [
          { text: "!!statistic!!", spaceAfter: false },
          { text: "!!xval!!", spaceAfter: false }
        ],
        replacementValues: [
          { newText: "n (%)", subList: [{ newText: "xx (xx.x)" }] },
        ],
      }
    ]
  },
];

export const TablePage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [tableData, setTableData] = useState<AitTableData>({ 
    "headerData": { "aitid": "processedHeader", "replacements": [{ "replacementTexts": [{ "text": "!!trt!!", "spaceAfter": false }, { "text": "", "spaceAfter": false }], "replacementValues": [{ "newText": "&lt;&lt;low&nbsp;dose&gt;&gt;", "subList": [] }, { "newText": "&lt;&lt;high&nbsp;dose&gt;&gt;", "subList": [] }, { "newText": "Total", "subList": [] }, { "newText": "Control", "subList": [] }] }], "comments": "", "rows": [{ "aitid": "7f3fb58c-2b1a-4155-878a-a13c51635a11", "cells": [{ "text": "", "colSpan": 1, "rowSpan": 2, "colWidth": 150, "textIndents": 0, "aitid": "05315c16-9964-4e76-87bd-e4a7b2e5905a" }, { "aitid": "fe5093dc-1258-4d5e-872e-fae99e2e67d9", "text": "Statistic", "comments": "", "colSpan": 1, "rowSpan": 2, "textIndents": 0 }, { "text": "!!trt!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "replacedText": "&lt;&lt;low&nbsp;dose&gt;&gt;", "aitid": "400b2d13-09e1-4ad2-a3ae-fcd078076cc0" }, { "text": "Total", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "5a09c048-31ef-4d45-b044-d6ddd7ee5468" }] }, { "aitid": "3a4da0e4-27a7-41b8-93ee-fbd9b514d49e", "cells": [{ "text": "", "colSpan": 1, "rowSpan": 0, "textIndents": 0, "aitid": "6a6b8d60-4cf8-4eed-a13c-f780ac514045" }, { "text": "", "rowSpan": 0, "colSpan": 1, "textIndents": 0, "aitid": "167f4701-cebc-4a0e-8536-19a94a449ae3" }, { "text": "N=xxx", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "ac6c6203-4287-4aa4-a7c4-b3fe55a93032" }, { "text": "N=xxx", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "c1a54ac1-5034-44ca-b19f-10a0f6a3338e" }] }] }, "bodyData": [{ "aitid": "808413e6-e7c9-4807-9a3e-29b9d48e6c89", "rows": [{ "cells": [{ "text": "!!label!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "df8a3213-79e4-45d6-b7f7-8a35631c8874" }, { "text": "!!stat!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "51b476f6-9228-468b-89eb-8e0536f06526" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "1921b229-eb28-4959-83f4-9c1300f120ba" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "8426aac9-74e7-420b-834c-81a6fad26732" }], "aitid": "30a9f880-cbe4-416c-8245-4ddf7913e1c0" }], "comments": "Hello&nbsp;worlds", "replacements": [{ "replacementTexts": [{ "text": "!!label!!", "spaceAfter": false }, { "text": "!!stat!!", "spaceAfter": false }, { "text": "!!xval!!", "spaceAfter": false }], "replacementValues": [{ "newText": "Age&nbsp;(&lt;&lt;unit&gt;&gt;)", "subList": [{ "newText": "n", "subList": [{ "newText": "xxx" }] }, { "newText": "Mean", "subList": [{ "newText": " xx.x" }] }, { "newText": "SD", "subList": [{ "newText": "  x.x" }] }, { "newText": "Median", "subList": [{ "newText": " xx.x" }] }, { "newText": "Min", "subList": [{ "newText": "  x" }] }, { "newText": "Max", "subList": [{ "newText": "xxx" }] }] }] }], "spaceAfter": true }, { "aitid": "fa30989f-0b0c-4831-9a16-7a67c4618861", "rows": [{ "cells": [{ "text": "!!label!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "a3a87ad5-a126-457b-a98f-c84b26e93394" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "7d881539-1279-4173-abcc-54953757c390" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "838d0a9b-edc0-4c19-82d7-4a26e730cabd" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "6f46f1f8-d16f-4229-99e9-cc25c50bdcc9" }], "aitid": "78a78d9f-3086-43aa-999b-d95589ec00ec" }, { "cells": [{ "text": "!!category!!", "colSpan": 1, "rowSpan": 1, "textIndents": 1, "aitid": "529ffa2d-ac6d-482e-833c-49af72b4b228" }, { "text": "!!stat!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "9296b0c8-694b-4745-b395-c0e8ea7f1a57" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "e470001e-f6d3-4463-b515-924f6c8e609c" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "ae94adbe-77f1-4a6e-9f63-fb61add92ac2" }], "aitid": "1ae3732f-2c5a-4c4e-b819-b35c5308c155" }], "replacements": [{ "replacementTexts": [{ "text": "!!label!!", "spaceAfter": false }], "replacementValues": [{ "newText": "Age&nbsp;group&nbsp;(&lt;&lt;unit&gt;&gt;)" }] }, { "replacementTexts": [{ "text": "!!category!!", "spaceAfter": false }], "replacementValues": [{ "newText": "&lt;&lt;Category&nbsp;1&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;2&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;3&gt;&gt;" }, { "newText": "Missing" }] }, { "replacementTexts": [{ "text": "!!stat!!", "spaceAfter": false }, { "text": "!!xval!!", "spaceAfter": false }], "replacementValues": [{ "newText": "n (%)", "subList": [{ "newText": "xxx (xx.x)" }] }] }] }, { "aitid": "79674a1f-b9cf-4f3e-974c-642cd1960f4f", "rows": [{ "cells": [{ "text": "!!label!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "01942018-f33c-4ba1-ad3b-72b893f0b645" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "19bad062-e19d-44f6-bb9b-97e67ddf996a" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "b67ee822-e210-4ff2-b8f3-8454edcdb6e3" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "ee85218d-9685-4e00-a253-9885caa10685" }], "aitid": "f1111b17-f419-43f0-8a2c-72fd68a66d83" }, { "cells": [{ "text": "!!category!!", "colSpan": 1, "rowSpan": 1, "textIndents": 1, "aitid": "f78458b5-9056-4f83-a47e-6f720f49efcf" }, { "text": "!!stat!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "796c3f42-bf10-4266-ab30-0b37e384e4f6" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "d72c3b33-d403-4b72-85c8-d864e27e5224" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "b2ae41c6-8a97-4ec3-9e75-d9f1508f72e2" }], "aitid": "0acd6902-8e32-4ca5-af33-7c2b6c098e11" }], "replacements": [{ "replacementTexts": [{ "text": "!!label!!", "spaceAfter": false }], "replacementValues": [{ "newText": "Sex" }] }, { "replacementTexts": [{ "text": "!!category!!", "spaceAfter": false }], "replacementValues": [{ "newText": "&lt;&lt;Category&nbsp;1&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;2&gt;&gt;" }, { "newText": "Missing" }] }, { "replacementTexts": [{ "text": "!!stat!!", "spaceAfter": false }, { "text": "!!xval!!", "spaceAfter": false }], "replacementValues": [{ "newText": "n (%)", "subList": [{ "newText": "xxx (xx.x)" }] }] }] }, { "aitid": "24ffdda8-9275-46ba-a6d4-aea3775c6358", "rows": [{ "aitid": "0cd9881d-7348-47da-a684-79f8a5ba3547", "cells": [{ "text": "!!label!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "2ef3391c-e566-4e1c-a9e5-d950a131128d" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "52be42dd-422c-491d-b08b-47c84b84905a" }, { "aitid": "c15e7c54-8f28-4a24-b596-cbe206303e82", "text": "", "comments": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0 }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "c0bad22a-bc75-4999-ba57-06c9bfa4fa28" }] }, { "cells": [{ "text": "!!category!!", "colSpan": 1, "rowSpan": 1, "textIndents": 1, "aitid": "cfc4ece9-b640-4509-8fef-01471824c453" }, { "text": "!!stat!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "44721b82-552f-4315-a6c1-1f3834a65fb9" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "fde927d4-c2cc-42e5-afa2-ffe702ac6b06" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "3d92edf0-44a9-49d2-9a5f-816dafd4fba4" }], "aitid": "e531cdc3-3b59-4681-b5d8-c5591f7995f2" }], "comments": "", "replacements": [{ "replacementTexts": [{ "text": "!!label!!", "spaceAfter": false }], "replacementValues": [{ "newText": "Race" }] }, { "replacementTexts": [{ "text": "!!category!!", "spaceAfter": false }], "replacementValues": [{ "newText": "&lt;&lt;Category&nbsp;1&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;2&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;3&gt;&gt;" }, { "newText": "Missing" }] }, { "replacementTexts": [{ "text": "!!stat!!", "spaceAfter": false }, { "text": "!!xval!!", "spaceAfter": false }], "replacementValues": [{ "newText": "n (%)", "subList": [{ "newText": "xxx (xx.x)" }] }] }] }, { "aitid": "745694f8-780e-4555-b187-044b5c4c8a94", "rows": [{ "cells": [{ "text": "!!label!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "ccb912cf-1d15-444c-a95f-26e54a05ef46" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "9af15c80-650d-49f6-9b23-b6368dba3e45" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "70394d69-4261-4df8-a204-dfb1c5613e15" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "a0afdb4a-39ad-4b69-8d1a-9e9ca290fd66" }], "aitid": "3b2bd816-d20a-46ed-a7c6-315a9a736c43" }, { "cells": [{ "text": "!!category!!", "colSpan": 1, "rowSpan": 1, "textIndents": 1, "aitid": "985e94e4-3526-4f66-9177-efdffd2b018c" }, { "text": "!!stat!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "a4d0f8a5-46a2-420d-ae97-d195f21cbe51" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "2a0192b8-b1f1-442e-8422-22575b624b90" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "53907215-89d5-46d6-a165-c636f966130d" }], "aitid": "10f4f6ff-0c33-4fc6-9874-906f4b2223ef" }], "replacements": [{ "replacementTexts": [{ "text": "!!label!!", "spaceAfter": false }], "replacementValues": [{ "newText": "Ethnicity" }] }, { "replacementTexts": [{ "text": "!!category!!", "spaceAfter": false }], "replacementValues": [{ "newText": "&lt;&lt;Category&nbsp;1&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;2&gt;&gt;" }, { "newText": "Missing" }] }, { "replacementTexts": [{ "text": "!!stat!!", "spaceAfter": false }, { "text": "!!xval!!", "spaceAfter": false }], "replacementValues": [{ "newText": "n (%)", "subList": [{ "newText": "xxx (xx.x)" }] }] }] }, { "aitid": "d5844cc9-5bd6-44ee-a31a-771e33c76a7b", "rows": [{ "cells": [{ "text": "!!label!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "97233cfd-3da4-4e2e-b54b-f54933936894" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "c142d926-0285-4c7d-bfae-55ab29bed90e" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "89b553f8-efe9-47a7-b4df-f8c1c060ab74" }, { "text": "", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "2b484bdd-f24d-49d1-94dd-2ab467e60c7d" }], "aitid": "b950ad5a-f514-4df0-b5e1-25a5e3ba1e9f" }, { "cells": [{ "text": "!!category!!", "colSpan": 1, "rowSpan": 1, "textIndents": 1, "aitid": "069dec12-1f97-42dc-8cbe-f08b95de30b2" }, { "text": "!!stat!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "b1c4c914-f350-43ba-9fc7-c791267f9824" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "c25c6bc0-75a5-4418-ba22-e14254cefc9c" }, { "text": "!!xval!!", "colSpan": 1, "rowSpan": 1, "textIndents": 0, "aitid": "837cdf84-7742-4371-9e07-a9e4ea1cddb4" }], "aitid": "9487f246-faf0-45bc-a8dd-8b55efd6eae5" }], "replacements": [{ "replacementTexts": [{ "text": "!!label!!", "spaceAfter": false }], "replacementValues": [{ "newText": "Country" }] }, { "replacementTexts": [{ "text": "!!category!!", "spaceAfter": false }], "replacementValues": [{ "newText": "&lt;&lt;Category&nbsp;1&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;2&gt;&gt;" }, { "newText": "&lt;&lt;Category&nbsp;3&gt;&gt;" }, { "newText": "Missing" }] }, { "replacementTexts": [{ "text": "!!stat!!", "spaceAfter": false }, { "text": "!!xval!!", "spaceAfter": false }], "replacementValues": [{ "newText": "n (%)", "subList": [{ "newText": "xxx (xx.x)" }] }] }] }], "rowHeaderColumns": 2, "noRepeatProcessing": false 
  });
  const [externalReplacements, setExternalReplacements] = useState<AioReplacement[]>([]);
  const [listStatus, setListStatus] = useState<string>("");

  const loadData = useCallback(() => {
    try {
      if (ta.current && ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('tableContent') ?? "";
      }
      if (ta.current) {
        const j = JSON.parse(ta.current!.value?.toString() ?? "{}");
        setTableData(j);
        ta.current.value = JSON.stringify(j, null, 2);
      }
    }
    catch (e) {
      console.log("JSON parse failed");
      console.dir(e);
    }
  }, []);

  const loadReplacements = useCallback(() => {
    try {
      const j: { name: string, list: AioReplacement }[] = JSON.parse(window.localStorage.getItem('listContent') ?? "[]");
      setExternalReplacements(j.map(j => j.list));
      setListStatus(`Loaded ${j.length} lists: ${j.map(rep => rep.list.givenName).join(', ')}`);
    }
    catch (e) {
      console.log("JSON parse from listContent failed");
      console.dir(e);
      setListStatus("Error loading external list data");
    }
  }, []);


  return (<>
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}>
      <AsupInternalTable
        tableData={tableData}
        setTableData={setTableData}
        style={{ margin: "1rem" }}
        showCellBorders={true}
        externalLists={externalReplacements}
        groupTemplates={sampleGroupTemplates}
      />
    </div>
    <div style={{
      margin: "1rem",
      padding: "1rem",
      border: "solid black 3px",
      backgroundColor: "rgb(220, 220, 220)",
      borderRadius: "8px",
    }}>
      <button onClick={loadData}>Load</button>
      <button
        onClick={() => {
          if (!ta.current) return;
          // Show intended data
          ta.current.value = JSON.stringify(tableData, null, 2);
          // Save string
          window.localStorage.setItem('tableContent', JSON.stringify(tableData));
        }}
      >
        Save
      </button>
      <span style={{ paddingLeft: "1rem" }}>(browser storage)</span>

      <button onClick={loadReplacements} style={{ marginLeft: "1rem", marginRight: "0.5rem" }}>Load lists</button>
      <span>{listStatus}</span>

      <pre>
        <textarea style={{ width: "98%", height: "200px" }} ref={ta} />
      </pre>
    </div>
  </>);
}
