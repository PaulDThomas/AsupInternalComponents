import React, { useState, useEffect, useCallback, useMemo } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from 'uuid';
import { AioOptionType, AioOptionGroup, AioReplacement } from "components/aio/aioInterface";
import { AioOptionDisplay } from "components/aio/aioOptionDisplay";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
import { AitBorderRow } from "./aitBorderRow";
import { AitHeader } from "./aitHeader";
import { AitTableOptionNames, AitRowGroupData, AitRowGroupOptionNames, AitTableBodyData, AitTableData, AitCellType, AitCellOptionNames, AitOptionList } from "./aitInterface";
import { AitRowGroup } from "./aitRowGroup";
import { newCell, objEqual, processOptions } from "./processes";
import './ait.css';

interface AsupInteralTableProps {
  tableData: AitTableData,
  setTableData: (ret: AitTableData) => void,
  style?: React.CSSProperties,
  showCellBorders?: boolean,
}

// Initial data processing on load
const initialRowGroupProcess = (rg: AitRowGroupData): AitRowGroupData => {
  if (!rg.aitid) rg.aitid = uuidv4();
  rg.rows = rg.rows.map(r => {
    if (!r.aitid) r.aitid = uuidv4();
    if (!r.options) r.options = [];
    return r;
  });
  rg.options = processOptions(rg.options, defaultRowGroupOptions);
  return rg;
};

const initialBodyProcess = (b: AitTableBodyData): AitTableBodyData => {
  b.rowGroups = b.rowGroups.map(rg => initialRowGroupProcess(rg));
  return b;
};

const defaultTableOptions: AioOptionGroup = [
  { optionName: AitTableOptionNames.tableName, label: "Table name", type: AioOptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.tableDescription, label: "Table description", type: AioOptionType.string, value: "New table" },
  { optionName: AitTableOptionNames.noRepeatProcessing, label: "Supress repeats", type: AioOptionType.boolean, value: false },
  { optionName: AitTableOptionNames.rowHeaderColumns, label: "Number of row headers", type: AioOptionType.number, value: 1 },
  //{ optionName: AitTableOptionNames.repeatingColumns, label: "Repeating columns", type: AioOptionType.object, value: { start: "First column", end: "Last column" } },
  //{ optionName: AitTableOptionNames.columnRepeatList, label: "Repeat lists for columns", type: AioOptionType.array, value: ["New list"] },
];

const defaultRowGroupOptions: AioOptionGroup = [
  { optionName: AitRowGroupOptionNames.rgName, label: "Group name", type: AioOptionType.string, value: "New group" },
  {
    optionName: AitRowGroupOptionNames.replacements,
    label: "Replacement lists",
    type: AioOptionType.replacements,
    value: [{ replacementTexts: [{ level: 0, text: "", spaceAfter: false }], replacementValues: [{ newText: "" }] }] as AioReplacement[]
  },
];

/**
 * Table view for clinical table data
 * @param props 
 * @returns 
 */
export const AsupInteralTable = (props: AsupInteralTableProps) => {
  const [headerData, setHeaderData] = useState<AitRowGroupData>(initialRowGroupProcess(props.tableData.headerData));
  const [bodyData, setBodyData] = useState<AitTableBodyData>(initialBodyProcess(props.tableData.bodyData));
  const [options, setOptions] = useState<AioOptionGroup>(processOptions(props.tableData.options, defaultTableOptions));
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsButton, setShowOptionsButton] = useState(false);
  const [lastSend, setLastSend] = useState<AitTableData>(structuredClone(props.tableData));

  useEffect(() => setHeaderData(initialRowGroupProcess(props.tableData.headerData)), [props.tableData.headerData]);
  useEffect(() => setBodyData(initialBodyProcess(props.tableData.bodyData)), [props.tableData.bodyData]);
  useEffect(() => setOptions(processOptions(props.tableData.options, defaultTableOptions)), [props.tableData.options]);

  // Show or hide style buttons
  const aitShowProperties = () => { setShowOptionsButton(true); };
  const aitHideProperties = () => { setShowOptionsButton(false); };

  // Collate and return data
  useEffect(() => {
    if (typeof (props.setTableData) !== "function") return;

    const r = {
      headerData: headerData,
      bodyData: bodyData,
      options: options,
    };

    let [chkObj] = objEqual(r, lastSend, `TABLECHECK`);
    if (!chkObj) {
      props.setTableData(r);
      setLastSend(r);
    }
  }, [headerData, bodyData, options, lastSend, props]);

  // Update to a rowGroup data
  const updateRowGroup = useCallback((ret: AitRowGroupData, rgi: number) => {
    let newBody: AitTableBodyData = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    newBody.rowGroups[rgi] = ret;
    setBodyData(newBody);
  }, [bodyData.options, bodyData.rowGroups]);

  // Add a new row group to the table body
  const addRowGroup = useCallback((rgi: number) => {
    let newBody: AitTableBodyData = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    let newRowGroup: AitRowGroupData = {
      aitid: uuidv4(),
      options: [],
      rows: [{
        aitid: uuidv4(),
        options: structuredClone(defaultRowGroupOptions),
        cells: [],
      }]
    };
    let cols = bodyData.rowGroups[0].rows[0].cells
      .map(c => (c.options?.find(o => (o.optionName === AitCellOptionNames.colSpan))?.value) ?? 1)
      .reduce((sum, a) => sum + a, 0);
    for (let i = 0; i < cols; i++) newRowGroup.rows[0].cells.push(newCell());
    newBody.rowGroups.splice(rgi + 1, 0, newRowGroup);
    setBodyData(newBody); // This will trigger updateTable from updateCell
  }, [bodyData.options, bodyData.rowGroups]);

  // Remove a row group from the table body
  const removeRowGroup = useCallback((rgi: number) => {
    let newBody: AitTableBodyData = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    newBody.rowGroups.splice(rgi, 1);
    setBodyData(newBody);
  }, [bodyData.options, bodyData.rowGroups]);

  let higherOptions = useMemo(() => {
    return {
      showCellBorders: props.showCellBorders,
      noRepeatProcessing: options.find(o => o.optionName === AitTableOptionNames.noRepeatProcessing)?.value,
      rowHeaderColumns: options.find(o => o.optionName === AitTableOptionNames.rowHeaderColumns)?.value,
    };
  }, [options, props.showCellBorders]) as AitOptionList;

  const addCol = useCallback((col: number) => {
    let newBody: AitTableBodyData = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    newBody.rowGroups = newBody.rowGroups.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(col + 1, 0, newCell());
        return r;
      });
      return rg;
    });
    setBodyData(newBody);
    let newHeader: AitRowGroupData = { ...headerData };
    headerData.rows = newHeader.rows.map(r => {
      r.cells.splice(col + 1, 0, newCell());
      return r;
    });
    setHeaderData(newHeader);
  }, [bodyData.options, bodyData.rowGroups, headerData]);

  const remCol = useCallback((col: number) => {
    let newBody: AitTableBodyData = { rowGroups: bodyData.rowGroups, options: bodyData.options };
    newBody.rowGroups = newBody.rowGroups.map(rg => {
      rg.rows = rg.rows.map(r => {
        r.cells.splice(col, 1);
        return r;
      });
      return rg;
    });
    setBodyData(newBody);
    let newHeader: AitRowGroupData = { ...headerData };
    headerData.rows = newHeader.rows.map(r => {
      r.cells.splice(col, 1);
      return r;
    });
    setHeaderData(newHeader);
  }, [bodyData.options, bodyData.rowGroups, headerData]);

  // Print the table
  return (
    <>
      <div
        className="ait-holder"
        onMouseOver={aitShowProperties}
        onMouseLeave={aitHideProperties}
        style={props.style}
      >
        <div>
          <div className={`ait-table-options  ${showOptionsButton ? "visible" : "hidden"}`} onClick={() => { setShowOptions(true); }}>
          </div>
          {showOptions &&
            <AsupInternalWindow Title={"Table options"} Visible={showOptions} onClose={() => { setShowOptions(false); }}>
              <AioOptionDisplay options={options} setOptions={setOptions} />
            </AsupInternalWindow>
          }
        </div>
        <table className="ait-table">
          {headerData.rows.length > 0 &&
            <thead>
              <AitBorderRow
                rowCells={bodyData.rowGroups[0].rows[0].cells}
                spaceAfter={true}
                changeColumns={{
                  addColumn: addCol,
                  removeColumn: remCol,
                  showButtons: showOptionsButton,
                }}
              />
              <AitHeader
                aitid={headerData.aitid}
                rows={headerData.rows}
                options={headerData.options}
                setHeaderData={setHeaderData}
                higherOptions={{
                  ...higherOptions,
                  tableSection: AitCellType.header,
                  rowGroup: 0,
                }}
              />
              <AitBorderRow rowCells={bodyData.rowGroups[0].rows[0].cells} spaceBefore={true} noBorder={true} />
            </thead>
          }

          <tbody>
            <AitBorderRow
              rowCells={bodyData.rowGroups[0].rows[0].cells}
              spaceAfter={true}
              changeColumns={headerData.rows.length === 0 ?
                {
                  addColumn: addCol,
                  removeColumn: remCol,
                  showButtons: showOptionsButton,
                }
                : undefined}
            />
            {
              bodyData.rowGroups?.map((rowGroup: AitRowGroupData, rgi: number) => {

                if (rowGroup.aitid === undefined) rowGroup.aitid = uuidv4();

                return (
                  <AitRowGroup
                    key={rowGroup.aitid}
                    aitid={rowGroup.aitid}
                    rows={rowGroup.rows}
                    options={rowGroup.options}
                    setRowGroupData={(ret) => { updateRowGroup(ret, rgi) }}
                    higherOptions={{
                      ...higherOptions,
                      tableSection: AitCellType.body,
                      rowGroup: rgi,
                    }}
                    addRowGroup={(rgi) => { addRowGroup(rgi) }}
                    removeRowGroup={rgi > 0 ? (rgi) => { removeRowGroup(rgi) } : undefined}
                  />
                );
              })
            }
            <AitBorderRow rowCells={bodyData.rowGroups[0].rows[0].cells} />
          </tbody>
        </table>
      </div>
    </>
  );
};