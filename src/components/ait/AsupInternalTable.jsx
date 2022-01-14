import { useState } from "react";
import { AitTableBody } from "./aitTableBody";
import { AitRowGroup } from "./aitRowGroup";
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
  const [footerData, setFooterData] = useState(initialData.footerData ?? {});
  const [options, setOptions] = useState(initialData.options ?? []);
  const [optionsView, setOptionsView] = useState("hidden");

  // Show or hide style buttons
  const aitShowProperties = () => { if (showOptions) { setOptionsView(showOptions); } };
  const aitHideProperties = () => { setOptionsView("hidden"); };

  // Collate and return data
  useEffect(() => {
    const r = {
      headerData: headerData ?? {},
      bodyData: bodyData ?? {},
      footerData: footerData ?? {},
      options: options ?? [],
    };
    returnData(r);
  }, [headerData, bodyData, options, returnData, footerData]);

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
        <thead>
          <AitRowGroup
            initialData={initialData.headerData ?? {}}
            returnData={setHeaderData}
            type="header"
          />
        </thead>
        <tbody>
          <AitTableBody
            initialData={initialData.bodyData ?? {}}
            returnData={setBodyData}
          />
        </tbody>
        <tfoot>
          <AitRowGroup
            initialData={initialData.footerData ?? {}}
            returnData={setFooterData}
            type="footer"
          />
        </tfoot>
      </table>
      <AitOptionsWindow
        initialData={initialData.options ?? []}
        returnData={setOptions}
      />
    </div>
  );
};