import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { processTable, processOptions } from "./processes";
import { AitCell } from "./aitCell";
import { AitLocation, AitRowGroupData, AitTableBodyData, AitTableData, AitCellData, AitCellType, AitRowData } from "./aitInterface";
import { AioOptionDisplay } from "../aio/aioOptionDisplay";
import { AitTableOptionNames, OptionType, OptionGroup, AitCellOptionNames, AitRowGroupOptionNames } from "../aio/aioInterface";
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import './ait.css';

interface AsupInteralTableProps {
  initialData: AitTableData,
  returnData: (ret: AitTableData) => void,
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

// Initial data processing on load
const initialRowGroupProcess = (rg: AitRowGroupData): AitRowGroupData => {
  if (!rg.aitid) rg.aitid = uuidv4();
  rg.rows = rg.rows.map(r => {
    if (!r.aitid) r.aitid = uuidv4();
    return r;
  });
  rg.options = processOptions(rg.options, defaultRowGroupOptions);
  return rg;
};

const initialBodyProcess = (b: AitTableBodyData): AitTableBodyData => {
  b.rowGroups = b.rowGroups.map(rg => initialRowGroupProcess(rg));
  return b;
};

const defaultTableOptions: OptionGroup = [
  { optionName: AitTableOptionNames.tableName, label: "Table name", type: OptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.tableDescription, label: "Table description", type: OptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.rowHeaderColumns, label: "Number of row headers", type: OptionType.number, value: 1 },
  { optionName: AitTableOptionNames.repeatingColumns, label: "Repeating columns", type: OptionType.object, value: { start: "First column", end: "Last column" } },
  { optionName: AitTableOptionNames.columnRepeatList, label: "Repeat lists for columns", type: OptionType.array, value: ["New list"] },
];

const defaultRowGroupOptions: OptionGroup = [
  { optionName: AitRowGroupOptionNames.rgName, label: "Group name", type: OptionType.string, value: "New group" },
  { optionName: AitRowGroupOptionNames.replacements, label: "Replacement lists", type: OptionType.replacements, value: {}},
];


export const AsupInteralTable = (props: AsupInteralTableProps) => {
  const [headerData, setHeaderData] = useState<AitRowGroupData>(initialRowGroupProcess(props.initialData.headerData));
  const [bodyData, setBodyData] = useState<AitTableBodyData>(initialBodyProcess(props.initialData.bodyData));
  const [options, setOptions] = useState<OptionGroup>(processOptions(props.initialData.options, defaultTableOptions));
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsButton, setShowOptionsButton] = useState(false);
  const [lastSend, setLastSend] = useState<string>(JSON.stringify(props.initialData));

  useEffect(() => setHeaderData(props.initialData.headerData), [props.initialData.headerData]);
  useEffect(() => setBodyData(props.initialData.bodyData), [props.initialData.bodyData]);

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
    if (typeof (props.returnData) !== "function") return;

    const r = {
      headerData: headerData,
      bodyData: bodyData,
      options: options,
    };

    if (JSON.stringify(r) !== lastSend) {
      props.returnData(r);
      setLastSend(JSON.stringify(r));
    }
  }, [headerData, bodyData, options, lastSend, props]);

  // Process table after any update
  const updateTable = useCallback((h, b, o) => {
    let [newHeader, newBody, newOptions] = processTable(h,b,o);
    setOptions(newOptions);
    setHeaderData(newHeader);
    setBodyData(newBody);
  }, []);

  // Update individual cells when a return is passed
  const updateCell = useCallback((ret: AitCellData, location: AitLocation) => {
    let newHeader = { rows: headerData.rows, options: headerData.options };
    let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    let newOptions = options;
    if (location.tableSection === AitCellType.header) {
      newHeader.rows[location.row].cells[location.cell] = ret;
    }
    else {
      newBody.rowGroups[location.rowGroup].rows[location.row].cells[location.cell] = ret;
    }
    [newHeader, newBody] = processTable(newHeader, newBody, newOptions);
    updateTable(newHeader, newBody, newOptions);
  }, [bodyData.options, bodyData.rowGroups, headerData.options, headerData.rows, options, updateTable]);


  // Update options when a return is passed
  const updateOptions = useCallback((ret: OptionGroup, location?: AitLocation) => {
    console.log(ret);
    let newHeader = { rows: headerData.rows, options: headerData.options };
    let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    let newOptions = options;
    // Update table options
    if (!location) newOptions = ret;
    // Update header options
    else if (location!.tableSection === AitCellType.header) {
      // Update row options
      if (location!.row >= 0) {
        newHeader.rows[location!.row].options = ret;
      }
      // Update row group options
      else {
        newHeader = { rows: headerData.rows, options: ret };
      }
      //  Update body options
    } else {
      if (location!.row >= 0) {
        newBody.rowGroups[location!.rowGroup].rows[location!.row].options = ret;
      }
      // Update row group options
      else if (location!.rowGroup >= 0) {
        newBody.rowGroups[location!.rowGroup].options = ret;
      } else {
        console.log("Should not hit this!");
      }
    }
    updateTable(newHeader, newBody, newOptions);
  }, [headerData.rows, headerData.options, bodyData.rowGroups, bodyData.options, options, updateTable]);

  // Add a new row group to the table body
  const addRowGroup = useCallback((rgi: number) => {
    let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    let newRowGroup = { options: [], rows: [{ aitid: uuidv4(), options: [], cells: new Array(4).fill({ originalText: "" }) }] };
    newBody.rowGroups.splice(rgi + 1, 0, newRowGroup);
    setBodyData(newBody); // This will trigger updateTable from updateCell
  }, [bodyData.options, bodyData.rowGroups]);

  // Remove a row group from the table body
  const removeRowGroup = useCallback((rgi: number) => {
    let newHeader = { rows: headerData.rows, options: headerData.options };
    let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    let newOptions = options;
    newBody.rowGroups.splice(rgi, 1);
    updateTable(newHeader, newBody, newOptions);
  }, [bodyData.options, bodyData.rowGroups, headerData.options, headerData.rows, options, updateTable]);

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
          {showOptions &&
            <AsupInternalWindow Title={"Table options"} Visible={showOptions} onClose={() => { setShowOptions(false); }}>
              <AioOptionDisplay initialData={options} returnData={(ret) => updateOptions(ret)} />
            </AsupInternalWindow>
          }
        </div>
        <table
          className="ait-table"
        >
          <thead>
            <tr>
              {headerData.rows[0].cells.map((cell: AitCellData, ci: number): JSX.Element =>
                <td className="ait-border-cell" colSpan={cell.options.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
              )}
            </tr>
            {
              headerData?.rows.map((row, ri): JSX.Element => {
                return (
                  <tr key={row.aitid} >
                    {row.cells.map((cell, ci): JSX.Element => {
                      let location = { tableSection: AitCellType.header, rowGroup: 0, row: ri, cell: ci } as AitLocation;
                      return (
                        <AitCell
                          key={cell.aitid ?? ci}
                          location={location}
                          showCellBorders={props.showCellBorders}
                          readOnly={cell.readOnly}
                          initialData={cell}
                          returnData={(ret) => updateCell(ret, location)}
                          rowGroupOptions={ci === 0 ? [headerData.options, updateOptions] : undefined}
                          rowOptions={ci === row.cells.length - 1 ? [row.options, updateOptions] : undefined}
                        />
                      );
                    })}
                  </tr>
                );
              }
              )
            }
            <tr>
              {headerData.rows[0].cells.map((cell: AitCellData, ci: number): JSX.Element =>
                <td className="ait-border-cell" colSpan={cell.options.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
              )}
            </tr>
          </thead>
          <tbody>
            {
              bodyData.rowGroups?.map((rowGroup: AitRowGroupData, rgi: number) =>
                rowGroup.rows.map((row: AitRowData, ri: number): JSX.Element => {
                  return (
                    <tr key={row.aitid} >
                      {row.cells.map((cell: AitCellData, ci: number): JSX.Element => {
                        let location = { tableSection: AitCellType.body, rowGroup: rgi, row: ri, cell: ci } as AitLocation;
                        return (
                          <AitCell
                            key={cell.aitid ?? ci}
                            location={location}
                            showCellBorders={props.showCellBorders}
                            readOnly={cell.readOnly}
                            initialData={cell}
                            returnData={(ret) => updateCell(ret, location)}
                            rowGroupOptions={ci === 0 && ri === 0 ? [rowGroup.options, updateOptions] : undefined}
                            addRowGroup={ci === 0 && ri === 0 ? addRowGroup : undefined}
                            removeRowGroup={ci === 0 && ri === 0 && rgi > 0 ? removeRowGroup : undefined}
                            rowOptions={(ci === row.cells.length - 1 ? [row.options, updateOptions] : undefined)}
                          />
                        );
                      })}
                    </tr>
                  );
                }
                )
              )
            }
            <tr>
              {headerData.rows[0].cells.map((cell: AitCellData, ci: number): JSX.Element =>
                <td className="ait-border-cell" colSpan={cell.options.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};