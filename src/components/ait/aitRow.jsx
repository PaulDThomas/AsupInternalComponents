import { useState } from "react";
import { AitCell } from "./aitCell";

export const AitRow = ({
  initialData,
  returnData,
  type="body"
}) => {


  return (
    <tr>
      {initialData.map((c, i) => {
        return (
          <AitCell 
            key={i}
            type={type}
            colSpan={c.colSpan}
            rowSpan={c.rowSpan}
            initialData={c}
            />
        );
      })}
    </tr>
  );
}