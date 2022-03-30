import { AitRowData } from "components/ait/aitInterface";

function printRows(rs: AitRowData[]): string {
  return "\t" + rs
    .map(r => r.cells
      .map(c => `${c.text} ${c.replacedText ? " => " + c.replacedText : ""}`)
      .join(",")
    )
    .join("\n\t");
}
