import { useState } from "react";

export const AitCell = ({
  columnNumber,
  initialData = {},
  colSpan = 1,
  rowSpan = 1,
  returnData,
  type,
  editable = true,
}) => {

  if (type === "header") {
    return (
      <th
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {initialData.text}
    </th>
    );
  } else {
    return (
      <td
        colSpan={colSpan}
        rowSpan={rowSpan}
      >
        {initialData.text}
      </td>
    );
  }
}