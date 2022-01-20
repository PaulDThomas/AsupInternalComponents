import { useState, useEffect } from "react";
import { AitTableBody } from "./aitTableBody";
import { AitRowGroup } from "./aitRowGroup";
import { AitOptionsWindow } from "./aitOptionsWindow";
import './ait.css';
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";

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

  useEffect(() => {
    if (focusedElement.closest(".ait-holder")) {
      const ds = focusedElement.closest("td").dataset;
      setCurrentLocation(
        Object.keys(ds)
          .reduce((location, k) => {
            location[k.substring(8)] = ds[k];
            return location;
          }, {})
      );
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
      <AsupInternalWindow
        Title="Location"
      >
        <table>
          <tbody>
            <tr>
              <td>Section</td>
              <td>{currentLocation.TableSection ?? ""}</td>
            </tr>
            <tr>
              <td>RowGroup</td>
              <td>{currentLocation.RowGroup ?? ""}</td>
            </tr>
            <tr>
              <td>Row</td>
              <td>{currentLocation.Row ?? ""}</td>
            </tr>
            <tr>
              <td>Cell</td>
              <td>{currentLocation.Cell ?? ""}</td>
            </tr>
          </tbody>
        </table>
      </AsupInternalWindow>
    </div>
  );
};