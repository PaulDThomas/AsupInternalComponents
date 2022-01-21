import { useState, useEffect } from "react";
import { AitTableBody } from "./aitTableBody";
import { AitRowGroup } from "./aitRowGroup";
import { AioOptionGroup } from "../aio/aioOptionGroup";
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import './ait.css';

// Taken from https://stackoverflow.com/questions/58886782/how-to-find-focused-react-component-like-document-activeelement
// Handles change of active element
const useActiveElement = () => {
  const [active, setActive] = useState(document.activeElement);

  const handleFocusIn = (e) => {
    setActive(document.activeElement);
  }

  useEffect(() => {
    document.addEventListener('focusin', handleFocusIn)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
    };
  }, [])

  return active;
}

export const AsupInteralTable = ({
  initialData,
  maxRows,
  maxColumns,
  returnData,
  cellProperties,
  rowGroupProperties,
  columnGroupProperties,
  addStyle,
  showCellBorders,
  showOptions = "dialog",
}) => {
  const [headerData, setHeaderData] = useState(initialData.headerData ?? {});
  const [bodyData, setBodyData] = useState(initialData.bodyData ?? {});
  //const [footerData, setFooterData] = useState(initialData.footerData ?? {});
  const [options, setOptions] = useState(initialData.options ?? []);
  const [currentLocation, setCurrentLocation] = useState({});
  // const [optionsView, setOptionsView] = useState("hidden");

  const focusedElement = useActiveElement();

  // const setCellOptions = (e) => { console.log("setCellOptions:"); console.dir(e); }

  useEffect(() => {
    if (focusedElement.closest(".ait-holder")) {
      const ds = focusedElement.closest("td").dataset;
      const cl = Object.keys(ds)
        .reduce((location, k) => {
          location[k.substring(8)] = ds[k];
          return location;
        }, {});
      setCurrentLocation(cl);
    }
    else {
      console.log("No table focus");
    }
  }, [focusedElement])

  // Show or hide style buttons
  // const aitShowProperties = () => { if (showOptions) { setOptionsView(showOptions); } };
  // const aitHideProperties = () => { setOptionsView("hidden"); };

  // Collate and return data
  useEffect(() => {
    const r = {
      headerData: headerData ?? {},
      bodyData: bodyData ?? {},
      //footerData: footerData ?? {},
      options: options ?? [],
    };
    returnData(r);
  }, [headerData, bodyData, options, returnData]);

  // Print the table
  return (
    <>
      <div
        className="ait-holder"
        // onMouseOver={aitShowProperties}
        // onMouseLeave={aitHideProperties}
        style={addStyle}
      >
        <table
          className="ait-table"
        >
          <thead>
            <AitRowGroup
              location={{ tableSection: "header", rowGroup: 0 }}
              initialData={initialData.headerData ?? {}}
              returnData={setHeaderData}
              showCellBorders={showCellBorders}
              type="header"
            />
          </thead>
          <tbody>
            <AitTableBody
              initialData={initialData.bodyData ?? {}}
              returnData={setBodyData}
              showCellBorders={showCellBorders}
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
        Title="Options"
      >
        <div className='aiw-sub-title'><small>Table</small></div>
        <AioOptionGroup initialData={options} returnData={setOptions} />
        <div className='aiw-sub-title'><small>Section: </small> {currentLocation.TableSection ?? ""}</div>
        <div className='aiw-sub-title'><small>RowGroup: </small> {currentLocation.RowGroup ?? ""}</div>
        <AioOptionGroup
          initialData={(
            (!currentLocation)
              ? null
              : (currentLocation.TableSection === "body"
                ? bodyData.rowGroups[currentLocation.RowGroup].options
                : (currentLocation.TableSection === "header"
                  ? headerData.options
                  : null
                )
              )
          )} />
        <div className='aiw-sub-title'><small>Row: </small> {currentLocation.Row ?? ""}</div>
        <AioOptionGroup
          initialData={(
            (!currentLocation)
              ? null
              : (currentLocation.TableSection === "body"
                ? bodyData.rowGroups[currentLocation.RowGroup].rows[currentLocation.Row].options
                : (currentLocation.TableSection === "header"
                  ? headerData.rows[currentLocation.Row].options
                  : null
                )
              )
          )} />
        <div className='aiw-sub-title'><small>Cell: </small> {currentLocation.Cell ?? ""}</div>
        <AioOptionGroup
          initialData={(
            (!currentLocation)
              ? null
              : (currentLocation.TableSection === "body"
                ? bodyData.rowGroups[currentLocation.RowGroup].rows[currentLocation.Row].cells[currentLocation.Cell].options
                : (currentLocation.TableSection === "header"
                  ? headerData.rows[currentLocation.Row].cells[currentLocation.Cell].options
                  : null
                )
              )
          )} />
      </AsupInternalWindow>
    </>
  );
};