import React, { useState, useEffect, useCallback } from "react";
import { AitCell } from "./aitCell";
import { AioOptionGroup } from "../aio/aioOptionGroup";
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import { AitLocation, AitRowGroupData, AitTableBodyData, AitTableData, uuidv4, AitCellData, AitCellType } from "./aitInterface";
import { AitTableOptionNames, OptionType, OptionGroup } from "components/aio/aioInterface";
import { processOptions } from "components/functions";
import './ait.css';

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  { optionName: AitTableOptionNames.repeatingColumns, label: "Repeating columns", type: OptionType.object, value: { start: "First column", end: "Last column" } },
  { optionName: AitTableOptionNames.columnRepeatList, label: "Repeat lists for columns", type: OptionType.array, value: ["New list"] },
];

export const AsupInteralTable = (props: AsupInteralTableProps) => {
  const [headerData, setHeaderData] = useState<AitRowGroupData>(props.initialData.headerData);
  const [bodyData, setBodyData] = useState<AitTableBodyData>(props.initialData.bodyData);
  const [options, setOptions] = useState<OptionGroup>(processOptions(props.initialData.options, defaultTableOptions));
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

  const updateCell = useCallback((ret: AitCellData, location: AitLocation) => {
    if ( location.tableSection === AitCellType.header ) {
      let newHeader = {rows:headerData.rows, options:headerData.options};
      newHeader.rows[location.row].cells[location.cell] = ret;
      setHeaderData(newHeader);
    }
    else {
      let newBody = {rowGroups:bodyData.rowGroups, options: bodyData.options};
      newBody.rowGroups[location.rowGroup].rows[location.row].cells[location.cell] = ret;
      setBodyData(newBody);
    }
  }, [bodyData.options, bodyData.rowGroups, headerData.options, headerData.rows]);

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
          <div className={`ait-table-options  ${showOptionsButton ? "visible" : "hidden"}`} onClick={() => { setShowOptions(true); }}>
          </div>
          <AsupInternalWindow Title={"Table options"} Visible={showOptions} onClose={() => { setShowOptions(false); }}>
            <AioOptionGroup initialData={options} returnData={setOptions} />
          </AsupInternalWindow>
        </div>
        <table
          className="ait-table"
        >
          <thead>
            {
              headerData?.rows.map((row, ri): JSX.Element =>
                <tr key={ri} >
                  {row.cells.map((cell, ci): JSX.Element => {
                    // cell.aitid = cell.aitid ?? uuidv4();
                    let location = { tableSection: AitCellType.header, rowGroup: 0, row: ri, cell: ci } as AitLocation;
                    return (
                      <AitCell
                        key={ci}
                        location={location}
                        type={AitCellType.header}
                        editable={true}
                        initialData={cell}
                        returnData={(ret) => updateCell(ret, location)}
                        //rowGroupOptions={(i === 0 ? props.rowGroupOptions : undefined)}
                        //addRowGroup={props.addRowGroup}
                        //setRowGroupOptions={(i === 0 ? props.setRowGroupOptions : undefined)}
                        //rowOptions={(i === props.data.cells.length - 1 ? options : undefined)}
                        //setRowOptions={(i === props.data.cells.length - 1 ? setOptions : undefined)}
                        showCellBorders={props.showCellBorders}
                      />
                    );
                  })}
                </tr>
              )
            }
          </thead>
          <tbody>
            {
              bodyData.rowGroups?.map((rowGroup, rgi) => 
                rowGroup.rows.map((row, ri): JSX.Element =>
                  <tr key={ri} >
                    {row.cells.map((cell, ci): JSX.Element => {
                      // cell.aitid = cell.aitid ?? uuidv4();
                      let location = { tableSection: AitCellType.body, rowGroup: rgi, row: ri, cell: ci } as AitLocation;
                      return (
                        <AitCell
                          key={ci}
                          location={location}
                          type={AitCellType.body}
                          editable={true}
                          initialData={cell}
                          returnData={(ret) => updateCell(ret, location)}
                          //rowGroupOptions={(i === 0 ? props.rowGroupOptions : undefined)}
                          //addRowGroup={props.addRowGroup}
                          //setRowGroupOptions={(i === 0 ? props.setRowGroupOptions : undefined)}
                          //rowOptions={(i === props.data.cells.length - 1 ? options : undefined)}
                          //setRowOptions={(i === props.data.cells.length - 1 ? setOptions : undefined)}
                          showCellBorders={props.showCellBorders}
                        />
                      );
                    })}
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    </>
  );
};