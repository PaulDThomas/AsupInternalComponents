import { AioReplacement, AitRowGroupData, AitTableData, AsupInternalTable } from 'components';
import React, { useCallback, useRef, useState } from 'react';

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
    "headerData":{"replacements":[{"replacementTexts":[{"text":"!!trt!!","spaceAfter":false}],"replacementValues":[{"newText":"<<low dose>>"},{"newText":"<<high dose>>"},{"newText":"Total"},{"newText":"Control"}]}],"rows":[{"cells":[{"text":"","colSpan":1,"rowSpan":2,"colWidth":150,"textIndents":0},{"text":"Statistic","colSpan":1,"rowSpan":2,"textIndents":0},{"text":"!!trt!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"<<low dose>>"},{"text":"Total","colSpan":1,"rowSpan":1,"textIndents":0}]},{"cells":[{"text":"","colSpan":1,"rowSpan":0,"textIndents":0},{"text":"","rowSpan":0,"colSpan":1,"textIndents":0},{"text":"N=xxx","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"N=xxx","colSpan":1,"rowSpan":1,"textIndents":0}]}]},"bodyData":[{"rows":[{"cells":[{"text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false},{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"Age (<<unit>>)","subList":[{"newText":"n","subList":[{"newText":"xxx"}]},{"newText":"Mean","subList":[{"newText":" xx.x"}]},{"newText":"SD","subList":[{"newText":"  x.x"}]},{"newText":"Median","subList":[{"newText":" xx.x"}]},{"newText":"Min","subList":[{"newText":"  x"}]},{"newText":"Max","subList":[{"newText":"xxx"}]}]}]}]},{"rows":[{"cells":[{"text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"cells":[{"text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1},{"text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Age group (<<unit>>)"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"<<Category 3>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"rows":[{"cells":[{"text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"cells":[{"text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1,"replacedText":"<<Category 1>>"},{"text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Sex"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"rows":[{"cells":[{"text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"cells":[{"text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1},{"text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Race"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"<<Category 3>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"rows":[{"cells":[{"text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"cells":[{"text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1},{"text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Ethnicity"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"rows":[{"cells":[{"text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"cells":[{"text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1,"replacedText":"<<Category 1>>"},{"text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Country"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"<<Category 3>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]}],"rowHeaderColumns":2,"noRepeatProcessing":false
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
