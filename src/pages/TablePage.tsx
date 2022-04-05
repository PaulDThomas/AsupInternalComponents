import { AitTableData } from 'components';
import React, { useCallback, useRef, useState } from 'react';
import { AsupInternalTable } from '../components/ait/AsupInternalTable';

export const TablePage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [tableData, setTableData] = useState<AitTableData>({"headerData":{"aitid":"processedHeader","replacements":[{"replacementTexts":[{"text":"!!trt!!","spaceAfter":false}],"replacementValues":[{"newText":"<<low dose>>"},{"newText":"<<high dose>>"},{"newText":"Total"},{"newText":"Control"}]}],"rows":[{"aitid":"5ebd6abd-c10a-40bc-845c-1f4aafccf20b","cells":[{"aitid":"16d6d859-1dfb-480e-8d46-578820eb7ab5","text":"","colSpan":1,"rowSpan":2,"colWidth":150,"textIndents":0},{"aitid":"c8135b39-7b8a-437a-8816-f48fcace8fc6","text":"Statistic","colSpan":1,"rowSpan":2,"textIndents":0},{"aitid":"b212e0be-8607-4d55-be03-21ce12a95f47","text":"!!trt!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"<<low dose>>"},{"aitid":"319a0a45-ae79-4891-847c-f0a457d30204","text":"Total","colSpan":1,"rowSpan":1,"textIndents":0}]},{"aitid":"02acc23d-b3af-46bb-94cc-03c9c2be5468","cells":[{"aitid":"972b3861-98f1-4e1c-97d9-333407f55661","text":"","colSpan":1,"rowSpan":0,"textIndents":0},{"aitid":"01876532-d1e8-4960-81d2-33a94a9ee14c","text":"","rowSpan":0,"colSpan":1,"textIndents":0},{"aitid":"831a90c2-a587-4f14-ab47-318b02cffee5","text":"N=xxx","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"1c73099d-b449-4544-b860-822c4a822810","text":"N=xxx","colSpan":1,"rowSpan":1,"textIndents":0}]}]},"bodyData":[{"aitid":"3c4760e8-65d9-4a50-ac4b-067b46487efd","rows":[{"aitid":"4ce9c8cb-72e2-494d-b1c1-b484dd72b0ce","cells":[{"aitid":"4e6b57eb-d76c-4da5-b6c6-01e55a0e0f97","text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"41a0cc05-b42e-4155-aad7-c5eacc133be2","text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"f59d0390-0b16-4f79-8107-8e2101753d6a","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"085a6ebc-7319-4f6d-ad32-86cad5112cab","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false},{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"Age (<<unit>>)","subList":[{"newText":"n","subList":[{"newText":"xxx"}]},{"newText":"Mean","subList":[{"newText":" xx.x"}]},{"newText":"SD","subList":[{"newText":"  x.x"}]},{"newText":"Median","subList":[{"newText":" xx.x"}]},{"newText":"Min","subList":[{"newText":"  x"}]},{"newText":"Max","subList":[{"newText":"xxx"}]}]}]}]},{"aitid":"8d018e7b-85d5-4b3d-8272-bacff6d33f7d","rows":[{"aitid":"9dc4f8cd-ca42-4452-86cf-f6c3d1fc83e7","cells":[{"aitid":"c387ed41-9f15-47fd-a1a8-62fe74343530","text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"389668b6-50e6-494c-8cef-c03b0a8ba45c","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"05ac7797-31b4-4516-a5ae-8fb02ba70c50","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"01c89ee0-6c18-4b24-a820-e190c214ef1e","text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"aitid":"096616c0-381b-480e-9289-8f37edeef3a4","cells":[{"aitid":"828bcdbf-84ea-49e7-b2bd-a29dfc0015ec","text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1},{"aitid":"11b8573c-62a3-4119-be93-e71181f128ca","text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"aitid":"72996661-3b76-4e0d-8062-3066101fc0fb","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"5e65bf52-f2c8-4bdd-b8e4-f358c4202a58","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Age group (<<unit>>)"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"<<Category 3>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"aitid":"1f0ae2b6-b81f-45a5-9250-2255f91c713d","rows":[{"aitid":"98832786-b26c-4d80-90a6-57a9048ba70d","cells":[{"aitid":"f8a77d14-420e-428a-a826-a541a08a4d39","text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"8155fc80-45f9-4583-9b3a-edf4d8b5f358","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"de6e560f-8b4b-4b26-b24b-e93e51b6c854","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"e5d225e0-e582-4fc0-81c2-e65361bdeeb3","text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"aitid":"9b927d0d-7e9c-4f08-b75f-6fc3a8a81a1d","cells":[{"aitid":"0790fab4-50dc-43f7-afb3-655c24c32ef3","text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1,"replacedText":"<<Category 1>>"},{"aitid":"0f035a2e-a2ce-4815-b188-1e6b33b5a48b","text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"aitid":"dbf6b6a3-ce6f-4291-bd65-2f5a696616e8","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"17d4b060-cc50-48f3-be36-392632b64031","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Sex"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"aitid":"f17c8cf3-05d5-4905-8b2e-9987cc7b6e77","rows":[{"aitid":"fcd0c1a3-9c12-4ac6-ba25-462fde1c02fc","cells":[{"aitid":"703fea14-22a2-43a6-b03b-2fbc5162cfcb","text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"68940e50-721e-491b-af3a-cfdff3828d0d","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"09bc63a3-66d7-4801-a3bf-28c9ac623e0f","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"361d0031-39a1-48ee-887d-8c64d5911510","text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"aitid":"56624b1c-48ce-4d3d-889b-fafd83d21983","cells":[{"aitid":"b0e2e883-1eef-42e5-8805-39c9552647b9","text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1},{"aitid":"12d6d762-6af5-4ad4-b686-3457374b5e9c","text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"aitid":"379392e9-942c-46ed-82d8-9b6dd0574e0c","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"},{"aitid":"d98e062e-8088-43ea-855f-a9a933938b07","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Race"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"<<Category 3>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"aitid":"1ed04d35-58e8-4428-acc6-1eac1cd9113d","rows":[{"aitid":"c83b628c-c06e-407b-b05e-fd87bac0c375","cells":[{"aitid":"fa723743-7231-4b7d-8710-ca962bf86813","text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"c5e3de67-4f25-4149-97e0-581041138ab2","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"ce96cf46-07fc-4edf-9236-96d37358f41c","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"33928fcc-4f9b-4e66-a0ef-9b2887e017f6","text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"aitid":"6e596156-554a-46cc-bb76-3b25c2f0100b","cells":[{"aitid":"91ee9e71-31bd-4349-9636-f2b6efe02cc5","text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1},{"aitid":"a1317491-29f2-484c-a933-891ad9cc1867","text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"aitid":"cba36d74-221a-4ac9-b8df-db7a7ddcb785","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"},{"aitid":"5dfcd9c3-733e-4ab7-afe8-538734491455","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"xxx (xx.x)"}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Ethnicity"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]},{"aitid":"edb66036-f024-4b89-8ae8-9c7919bdc2aa","rows":[{"aitid":"602c98e9-e473-450d-bf0b-86049ef1f502","cells":[{"aitid":"2200ce88-82d0-4473-8d39-8e7031102bfb","text":"!!label!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"1b69883a-0b3c-4c7c-bb70-9b2da23d4ca3","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"e82c0a1b-ddfa-4238-9f9f-5af535c9540a","text":"","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"32ce9cd5-6c0b-49c9-bf4f-cc31139fc619","text":"","colSpan":1,"rowSpan":1,"textIndents":0}]},{"aitid":"d75ef1e7-2e4b-461f-8c67-4bdeeef3d4e6","cells":[{"aitid":"3454b7c8-0fc0-48be-8df7-09174887a8b8","text":"!!category!!","colSpan":1,"rowSpan":1,"textIndents":1,"replacedText":"<<Category 1>>"},{"aitid":"532fb80e-e1f4-4d1f-a3b8-ed7b65861c6e","text":"!!stat!!","colSpan":1,"rowSpan":1,"textIndents":0,"replacedText":"n (%)"},{"aitid":"255ae14b-831e-484a-8dd3-100b5a010d63","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0},{"aitid":"12997b0c-83b2-4f15-b0bc-c512e1098b57","text":"!!xval!!","colSpan":1,"rowSpan":1,"textIndents":0}]}],"replacements":[{"replacementTexts":[{"text":"!!label!!","spaceAfter":false}],"replacementValues":[{"newText":"Country"}]},{"replacementTexts":[{"text":"!!category!!","spaceAfter":false}],"replacementValues":[{"newText":"<<Category 1>>"},{"newText":"<<Category 2>>"},{"newText":"<<Category 3>>"},{"newText":"Missing"}]},{"replacementTexts":[{"text":"!!stat!!","spaceAfter":false},{"text":"!!xval!!","spaceAfter":false}],"replacementValues":[{"newText":"n (%)","subList":[{"newText":"xxx (xx.x)"}]}]}]}],"rowHeaderColumns":2,"noRepeatProcessing":false});

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
      />
    </div>
    <div style={{
      margin: "1rem",
      padding: "1rem",
      border: "solid black 3px",
      backgroundColor: "rgb(220, 220, 220)",
      borderRadius: "8px",
    }}>
      <button
        onClick={loadData}>
        Load
      </button>
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
      <pre>
        <textarea style={{ width: "98%", height: "200px" }} ref={ta} />
      </pre>
    </div>
  </>);
}
