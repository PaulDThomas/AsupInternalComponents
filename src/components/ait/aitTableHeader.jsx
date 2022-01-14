import "./ait.css";
import { AitRow } from "./aitRow";

export const AitTableHeader = ({
  initialData,
  maxRows,
  maxColumns,
  returnData,
  cellProperties,
  rowGroupProperties,
  columnGroupProperties,
}) => {

  const updateRow = (i, r) => {
    console.log(`Updating row ${i} with data ${JSON.stringify(r)}`);
  }

  return (
    <thead>
      {initialData.rows.map((row, i) => {
        return (
          <AitRow
            key={i}
            type={"header"}
            initialData={row}
            returnData={(r) => updateRow(i, r)}
          />
        )
      })}
    </thead>
  );
};