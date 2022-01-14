import { useState } from "react";
import { AitTableBody } from "./aitTableBody";
import { AitTableHeader } from "./aitTableHeader";
import { AitOptionsWindow } from "./aitOptionsWindow";
import './ait.css';
import { useEffect } from "react/cjs/react.development";

export const AsupInteralTable = ({
  initialData,
  maxRows,
  maxColumns,
  returnData,
  cellProperties,
  rowGroupProperties,
  columnGroupProperties,
  addStyle,
  showOptions = "dialog",
}) => {
  const [headerData, setHeaderData] = useState(initialData.headerData ?? {});
  const [bodyData, setBodyData] = useState(initialData.bodyData ?? {});
  const [options, setOptions] = useState(initialData.options ?? []);
  const [optionsView, setOptionsView] = useState("hidden");

  // Show or hide style buttons
  const aitShowProperties = () => { if (showOptions) { setOptionsView(showOptions); } };
  const aitHideProperties = () => { setOptionsView("hidden"); };

  // Collate and return data
  useEffect(() => {
    const r = {
      headerData: headerData,
      bodyData: bodyData,
      options: options,
    };
    returnData(r);
  }, [headerData, bodyData, options, returnData]);

  if (initialData.options) console.log(initialData.options);

  // Print the table
  return (
    <div
      className="ait-holder"
      onMouseOver={aitShowProperties}
      onMouseLeave={aitHideProperties}
      style={addStyle}
    >
      <table className="ait-table">
        <AitTableHeader
          initialData={initialData.headerData ?? {}}
          returnData={setHeaderData}
        />
        <AitTableBody
          initialData={initialData.bodyData ?? {}}
          returnData={setBodyData}
        />
      </table>
      <AitOptionsWindow
          initialData={initialData.options ?? []}
          returnData ={setOptions}
        />
    </div>
  );
};