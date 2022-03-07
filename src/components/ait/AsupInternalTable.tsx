import React, { useState, useEffect } from "react";
import { AitTableBody } from "./aitTableBody";
import { AitRowGroup } from "./aitRowGroup";
import { AioOptionGroup } from "../aio/aioOptionGroup";
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import './ait.css';
import { AitLocation, AitRowType, AitTableData } from "./aitInterface";
import { AitTableOptionNames, OptionType, OptionGroup } from "components/aio/aioInterface";
import { processOptions } from "components/functions";

interface AsupInteralTableProps {
  initialData: AitTableData,
  returnData: (ret: AitTableData) => void,
  // cellProperties,
  // rowGroupProperties,
  // columnGroupProperties,
  addStyle: React.CSSProperties,
  showCellBorders?: boolean,
  maxRows?: number,
  maxColumns?: number,
}

// Taken from https://stackoverflow.com/questions/58886782/how-to-find-focused-react-component-like-document-activeelement
// Handles change of active element
const useActiveElement = () => {
  const [active, setActive] = useState(document.activeElement);
  const handleFocusIn = () => { setActive(document.activeElement); }

  useEffect(() => {
    document.addEventListener('focusin', handleFocusIn)
    return () => { document.removeEventListener('focusin', handleFocusIn) };
  }, []);

  return active;
}

const defaultTableOptions: OptionGroup = [
  { optionName: AitTableOptionNames.tableName, label: "Table name", type: OptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.tableDescription, label: "Table description", type: OptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.rowHeaderColumns, label: "Number of row headers", type: OptionType.number, value: 1 },
  { optionName: AitTableOptionNames.repeatingColumns, label: "Repeating columns", type: OptionType.object, value: "Column selection" },
  { optionName: AitTableOptionNames.columnRepeatList, label: "Repeat lists for columns", type: OptionType.object, value: "New list" },
];

export const AsupInteralTable = (props: AsupInteralTableProps) => {
  const [headerData, setHeaderData] = useState(props.initialData.headerData ?? {});
  const [bodyData, setBodyData] = useState(props.initialData.bodyData ?? {});
  const [options, setOptions] = useState(processOptions(props.initialData.options, defaultTableOptions));
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsButton, setShowOptionsButton] = useState(false);

  /* 
  Leave this code in, but commented out for now... 
  it could be useful later to be able to be able to identify the cell that is active
  */
  // const [currentLocation, setCurrentLocation] = useState<AitLocation>();
  // const focusedElement = useActiveElement();
  // useEffect(() => {
  //   if (focusedElement && focusedElement.closest(".ait-holder td")) {
  //     const ds = focusedElement!.closest("td")!.dataset;
  //     console.log("Current dataset for location: " + JSON.stringify(ds));
  //     const cl: AitLocation = {
  //       tableSection: ds.locationTableSection ?? "body",
  //       rowGroup: parseInt(ds.locationRowGroup ?? "0"),
  //       row: parseInt(ds.locationRow ?? "0"),
  //       cell: parseInt(ds.locationCell ?? "0"),
  //     };
  //     setCurrentLocation(cl);
  //   }
  //   else {
  //     console.log("No table focus");
  //   }
  // }, [focusedElement]);

  // Show or hide style buttons
  const aitShowProperties = () => { setShowOptionsButton(true); };
  const aitHideProperties = () => { setShowOptionsButton(false); };

  // Collate and return data
  useEffect(() => {
    const r = {
      headerData: headerData,
      bodyData: bodyData,
      //footerData: footerData ?? {},
      options: options,
    };
    if (props.returnData) props.returnData(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData, bodyData, options, props.returnData]);


  // Print the table
  return (
    <>
      <div
        className="ait-holder"
        onMouseOver={aitShowProperties}
        onMouseLeave={aitHideProperties}
        style={props.addStyle}
      >
        <div>
          <div className={`ait-table-options  ${showOptionsButton ? "visible" : "hidden"}`} onClick={(e) => { setShowOptions(true); }} />
        </div>
        <table
          className="ait-table"
        >
          <thead>
            <AitRowGroup
              location={{ tableSection: "header", rowGroup: 0 }}
              initialData={props.initialData.headerData ?? {}}
              returnData={setHeaderData}
              showCellBorders={props.showCellBorders}
              type={AitRowType.header}
            />
          </thead>
          <tbody>
            <AitTableBody
              initialData={props.initialData.bodyData ?? {}}
              returnData={setBodyData}
              showCellBorders={props.showCellBorders}
            />
          </tbody>
          {/* <tfoot>
          <AitRowGroup
          initialData={initialData.footerData ?? {}}
          returnData={setFooterData}
          type="footer"
          />
        </tfoot> */}
        </table>
      </div>
      <AsupInternalWindow
        Title={"Table options"}
        Visible={showOptions}
        onClose={() => { setShowOptions(false); }}
      >
        <AioOptionGroup initialData={options} returnData={setOptions} />
      </AsupInternalWindow>
    </>
  );
};