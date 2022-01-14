import { useState, useEffect } from "react";
import { AitRowGroup } from "./aitRowGroup";

export const AitTableBody = ({
  initialData,
  returnData,
}) => {

  const [rowGroups, setRowGroups] = useState(initialData.rowGroups ?? []);
  const [options, setOptions] = useState(initialData.options ?? {});

  // Send data up the tree
  useEffect(() => {
    const r = {
      rowGroups: rowGroups,
      options: options,
    }
    if (typeof (returnData) === "function") returnData(r);
  }, [options, returnData, rowGroups])

  // Update data from components
  const updateRowGroup = (i, ret) => {
    console.log(`Updating row group ${i} with data ${ret}`);
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
            initialData={rowGroup}
            returnData={(ret) => updateRowGroup(i, ret)}
          />
        );
      })}
    </>
  );
};