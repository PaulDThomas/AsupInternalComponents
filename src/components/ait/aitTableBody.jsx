import { AsupInternalEditor } from "../aie/AsupInternalEditor";

export const AitTableBody = ({
  initialData,
  initialRows,
  initialColumns,
  maxRows,
  maxColumns,
  returnData,
  cellProperties,
  rowGroupProperties,
  columnGroupProperties,
}) => {

  // Update cell call
  const updateCell = (r, n, e) => {
    console.log(`Updating cell ${r}, ${n} with return: ${e}`);
  }

  return (
    <tbody>
      <tr>
      <td>One</td>
        <td>Two</td>
        <td>Five</td>
        <td>Six</td>
      </tr>
      <tr>
        <td>Three</td>
        <td>Four</td>
        <td>Seven</td>
        <td>
          <AsupInternalEditor
          initialText={"Eight"}
          returnText={(e) => updateCell(1, 4, e)}
          />
        </td>
      </tr>
    </tbody>
  );
};