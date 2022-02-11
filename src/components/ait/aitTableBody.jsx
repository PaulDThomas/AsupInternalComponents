import { useState, useEffect } from "react";
import { AitRowGroup } from "./aitRowGroup";

export const AitTableBody = ({
  initialData,
  returnData,
  showCellBorders,
}) => {

  const [rowGroups, setRowGroups] = useState(initialData.rowGroups ?? []);
  const [options, setOptions] = useState(initialData.options ?? []);

  // Updates to initial data
  useEffect(() => { setRowGroups(initialData.rowGroups ?? []); }, [initialData.rowGroups]);
  useEffect(() => { setOptions(initialData.options ?? {}); }, [initialData.options]);


  // Send data up the tree
  useEffect(() => {
    const r = {
      rowGroups: rowGroups,
      options: options,
    }
    if (typeof (returnData) === "function") returnData(r);
  }, [options, returnData, rowGroups])

  // Update data from components
  const updateRowGroup = (ret, i) => {
    //console.log(`Updating row group ${i} in aitTableBody to... ${JSON.stringify(ret)}`);
    const newRowGroups = rowGroups;
    newRowGroups[i] = ret;
    setRowGroups(newRowGroups);
  };

  return (
    <>
      {(rowGroups ?? []).map((rowGroup, i) => {
        return (
          <AitRowGroup
            key={i}
            location={{tableSection:"body", rowGroup:i}}
            initialData={rowGroup}
            returnData={(ret) => updateRowGroup(ret, i)}
            showCellBorders={showCellBorders}
          />
        );
      })}
    </>
  );
};