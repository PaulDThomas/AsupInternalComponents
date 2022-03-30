import { AitRowData } from "components/ait/aitInterface";

/**
 * Print row data as a character print with new lines, tabs
 * @param rs 
 * @returns Table string
 */
export const printRows = (rs: AitRowData[]): string => {
  return "\t" + rs
    .map(r => r.cells
      .map(c => `${c.text} ${c.replacedText ? " => " + c.replacedText : ""}`)
      .join(",")
    )
    .join("\n\t");
}
