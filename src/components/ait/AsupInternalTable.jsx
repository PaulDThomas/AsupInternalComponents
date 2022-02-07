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
}) => {
  const [headerData, setHeaderData] = useState(initialData.headerData ?? {});
  const [bodyData, setBodyData] = useState(initialData.bodyData ?? {});
  const [options, setOptions] = useState(initialData.options ?? {});
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsButton, setShowOptionsButton] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({});

  const focusedElement = useActiveElement();

  useEffect(() => {
    if (focusedElement.closest(".ait-holder td")) {
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
  const aitShowProperties = () => { setShowOptionsButton(true); };
  const aitHideProperties = () => { setShowOptionsButton(false); };

  // Collate and return data
  useEffect(() => {
    console.log("returnData in AsupInternalTable");
    const r = {
      headerData: headerData ?? {},
      bodyData: bodyData ?? {},
      //footerData: footerData ?? {},
    };
    returnData(r);
  }, [headerData, bodyData, returnData]);

  // Print the table
  return (
    <>
      <div
        className="ait-holder"
        onMouseOver={aitShowProperties}
        onMouseLeave={aitHideProperties}
        style={addStyle}
      >
        <div>
          <div className={`ait-table-options  ${showOptionsButton ? "visible" : "hidden"}`} onClick={(e) => {console.log('click show optins'); setShowOptions(true);}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16" onClick={(e) => { setShowOptions(true); }}>
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
            </svg>
          </div>
        </div>
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
        Title={"Table options"}
        Visible={showOptions}
        onClose={() => {setShowOptions(false);} }
      >
        <div className='aiw-sub-title'><small>Table</small></div>
        <AioOptionGroup initialData={options} returnData={setOptions} />
        {/* <div className='aiw-sub-title'><small>Section: </small> {currentLocation.TableSection ?? ""}</div>
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
          )} 
          returnData={(ret) => updateOptions(currentLocation, "rowGroup", ret)}
          />
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
          )}
          returnData={(ret) => updateOptions(currentLocation, "row", ret)}
        />
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
          )}
          returnData={(ret) => updateOptions(currentLocation, "cell", ret)}
        /> */}
      </AsupInternalWindow>
    </>
  );
};