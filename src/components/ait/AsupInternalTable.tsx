import React, { useState, useEffect, useCallback, useRef } from "react";
import { AitCell } from "./aitCell";
import { AioOptionGroup } from "../aio/aioOptionGroup";
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import { AitLocation, AitRowGroupData, AitTableBodyData, AitTableData, AitCellData, AitCellType, AitRowData } from "./aitInterface";
import { AitTableOptionNames, OptionType, OptionGroup, AitCellOptionNames } from "components/aio/aioInterface";
import { processOptions } from "components/functions";
import { v4 as uuidv4 } from 'uuid';
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

// Add required aitids
const addAitIdToRowGroup = (rg: AitRowGroupData): AitRowGroupData => {
  if (!rg.aitid) rg.aitid = uuidv4();
  rg.rows = rg.rows.map(r => {
    if (!r.aitid) r.aitid = uuidv4();
    return r;
  });
  return rg;
};
const addAitIdToBody = (b: AitTableBodyData): AitTableBodyData => {
  b.rowGroups = b.rowGroups.map(rg => addAitIdToRowGroup(rg));
  return b;
};

const defaultTableOptions: OptionGroup = [
  { optionName: AitTableOptionNames.tableName, label: "Table name", type: OptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.tableDescription, label: "Table description", type: OptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.rowHeaderColumns, label: "Number of row headers", type: OptionType.number, value: 1 },
  { optionName: AitTableOptionNames.repeatingColumns, label: "Repeating columns", type: OptionType.object, value: { start: "First column", end: "Last column" } },
  { optionName: AitTableOptionNames.columnRepeatList, label: "Repeat lists for columns", type: OptionType.array, value: ["New list"] },
];

export const AsupInteralTable = (props: AsupInteralTableProps) => {
  const [headerData, setHeaderData] = useState<AitRowGroupData>(addAitIdToRowGroup(props.initialData.headerData));
  const [bodyData, setBodyData] = useState<AitTableBodyData>(addAitIdToBody(props.initialData.bodyData));
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
      //footerData: footerData ?? {},
      options: options,
    };

    if (JSON.stringify(r) !== lastSend) {
      props.returnData(r);
      setLastSend(JSON.stringify(r));
    }
  }, [headerData, bodyData, options, lastSend, props]);

  // Update individual cells when a return is passed
  const updateCell = useCallback((ret: AitCellData, location: AitLocation) => {
    if (location.tableSection === AitCellType.header) {
      let newHeader = { rows: headerData.rows, options: headerData.options };
      newHeader.rows[location.row].cells[location.cell] = ret;
      setHeaderData(newHeader);
    }
    else {
      let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
      newBody.rowGroups[location.rowGroup].rows[location.row].cells[location.cell] = ret;
      setBodyData(newBody);
    }
  }, [bodyData.options, bodyData.rowGroups, headerData.options, headerData.rows]);


  // Update options when a return is passed
  const updateOptions = useCallback((ret: OptionGroup, location: AitLocation) => {
    // Update header options
    if (location.tableSection === AitCellType.header) {
      // Update row options
      if (location.row >= 0) {
        let newHeader = { rows: headerData.rows, options: headerData.options };
        newHeader.rows[location.row].options = ret;
        setHeaderData(newHeader);
      }
      // Update row group options
      else {
        let newHeader = { rows: headerData.rows, options: ret };
        setHeaderData(newHeader);
      }
      //  Update body options
    } else {
      if (location.row >= 0) {
        let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
        newBody.rowGroups[location.rowGroup].rows[location.row].options = ret;
        setBodyData(newBody);
      }
      // Update row group options
      else if (location.rowGroup >= 0) {
        let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
        newBody.rowGroups[location.rowGroup].options = ret;
        setBodyData(newBody);
      } else {
        console.log("Should not hit this!");
      }
    }
  }, [headerData.options, headerData.rows, bodyData.options, bodyData.rowGroups]);

  // Add a new row group to the table body
  const addRowGroup = useCallback((rgi: number) => {
    let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    let newRowGroup = { options: [], rows: [{ aitid: uuidv4(), options: [], cells: new Array(4).fill({ originalText: "" }) }] };
    newBody.rowGroups.splice(rgi + 1, 0, newRowGroup);
    // newRowGroup = { rows:[{cells:new Array(4).fill(text:"", originalText:"")}], options: []} as AitRowGroupData;
    setBodyData(newBody);
  }, [bodyData.options, bodyData.rowGroups]);

  // Remove a row group from the table body
  const removeRowGroup = useCallback((rgi: number) => {
    let newBody = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    newBody.rowGroups.splice(rgi, 1);
    setBodyData(newBody);
  }, [bodyData.options, bodyData.rowGroups]);

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
              <AioOptionGroup initialData={options} returnData={setOptions} />
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
                          type={AitCellType.header}
                          editable={true}
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
                            type={AitCellType.body}
                            editable={true}
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