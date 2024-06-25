import { AioExternalReplacements, AioReplacement } from "../aio/interface";
import { AitRowData } from "../table/interface";
import { replaceCellText } from "./replaceCellText";
import { fromHtml } from "./tofromHtml";
import { updateExternals } from "./updateExternals";

/**
 * Recursive function to replace column header information
 * @param replacement Single set of replacment text
 * @param rows Header rows
 * @returns Updated rows
 */
export const replaceRows = <T extends string | object>(
  rows: AitRowData<T>[],
  defaultCellWidth: number,
  getTextFromT: (s: T) => string[],
  replaceTextInT: (s: T, oldPhrase: string, newPhrase: T) => T,
  replacement?: AioReplacement<T>,
  externalLists?: AioExternalReplacements<T>[],
): AitRowData<T>[] => {
  // Look for match, is there is one to find
  if (
    replacement === undefined ||
    replacement.oldText === "" ||
    replacement.newTexts.length === 0 ||
    replacement.newTexts[0].texts.join("") === ""
  ) {
    return rows;
  }

  // Set up holders
  const newRows: AitRowData<T>[] = [];
  let found = false;

  // Look through each cell
  let ri = 0;
  let processedRows = 0;
  let emergencyExit = 0;
  while (ri < rows.length && emergencyExit < 10000) {
    if (ri >= rows.length || rows[ri] === undefined || rows[ri].cells.length === undefined) {
      console.group("High ri value somehow");
      console.warn(`ri: ${ri}`);
      console.warn(`${JSON.stringify(rows)}`);
      console.groupEnd();
    } else
      for (let ci = 0; ci < rows[ri].cells.length && !found; ci++) {
        const cellTextParts: string[] = getTextFromT(
          rows[ri].cells[ci].replacedText ?? rows[ri].cells[ci].text ?? "",
        );
        if (
          replacement !== undefined &&
          // Compare as non-HTML text
          cellTextParts.some((t) => t.includes(fromHtml(replacement.oldText)))
        ) {
          // Get targetCell
          found = true;
          const targetCell = rows[ri].cells[ci];

          const midRows: AitRowData<T>[] = [];

          // Cycle through newTexts
          for (let rvi = 0; rvi < replacement.newTexts.length; rvi++) {
            const rv = replacement.newTexts[rvi];

            // Perform replacements for each text entry
            for (let ti = 0; ti < rv.texts.length; ti++) {
              const thisRepeat = replaceCellText(
                targetCell,
                replacement.oldText,
                rv.texts[ti],
                replaceTextInT,
              );

              // Process remaining cells, including target after replacement
              let lowerQuad: AitRowData<T>[] =
                replacement.includeTrailing ?? false
                  ? rows.slice(ri).map((r, rj) => {
                      const cells =
                        rj === 0
                          ? [
                              thisRepeat,
                              ...r.cells
                                .slice(ci + 1)
                                .map((c) =>
                                  replaceCellText(
                                    c,
                                    replacement.oldText,
                                    rv.texts[ti],
                                    replaceTextInT,
                                  ),
                                ),
                            ]
                          : [
                              ...r.cells
                                .slice(ci)
                                .map((c) =>
                                  replaceCellText(
                                    c,
                                    replacement.oldText,
                                    rv.texts[ti],
                                    replaceTextInT,
                                  ),
                                ),
                            ];
                      return {
                        aitid: r.aitid,
                        rowRepeat: `${r.rowRepeat ?? ""}${`[${rvi},${ti}]`}`,
                        cells: cells,
                      };
                    })
                  : [
                      {
                        aitid: rows[ri].aitid,
                        rowRepeat: `${rows[ri].rowRepeat ?? ""}${`[${rvi},${ti}]`}`,
                        cells: [
                          thisRepeat,
                          ...rows[ri].cells
                            .slice(ci + 1)
                            .map((c) =>
                              replaceCellText(c, replacement.oldText, rv.texts[ti], replaceTextInT),
                            ),
                        ],
                      },
                    ];
              // Find amount to move row cursor
              processedRows = lowerQuad.length;
              // Process lowerQuad if there are subLists
              const subLists = updateExternals(rv.subLists, externalLists);
              if (subLists && subLists.length > 0)
                for (let si = 0; si < subLists.length; si++) {
                  lowerQuad = replaceRows(
                    lowerQuad,
                    defaultCellWidth,
                    getTextFromT,
                    replaceTextInT,
                    subLists[si],
                  );
                }

              // Expand to cover rest of the row
              midRows.push(...lowerQuad);

              // Add spaceAfter to bottom left cell in the block
              if (rv.spaceAfter) {
                midRows[midRows.length - 1].cells[0].spaceAfterRepeat = true;
              }
            }
          }

          // Add preceeding cells from current row
          if (midRows.length > 0)
            midRows.forEach((r, ix) => {
              r.cells.splice(
                0,
                0,
                ...rows[ri].cells.slice(0, ci).map((c) => ({
                  ...c,
                  replacedText: ix === 0 ? c.replacedText : ("" as T),
                  spaceAfterRepeat: c.spaceAfterRepeat && ix === midRows.length - 1,
                })),
              );
            });

          // Add returned rows
          newRows.push(...midRows);
        }
      }
    // Add the row if it was not found on this pass
    if (!found) {
      newRows.push(rows[ri]);
      ri++;
    }
    if (found) {
      ri = ri + processedRows;
      found = false;
    }
    emergencyExit++;
  }
  return newRows;
};
