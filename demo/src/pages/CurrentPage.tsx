import React from "react";
import { AsupInternalBlock } from "../../../src/components/aif/AsupInternalBlock";

export const CurrentPage = () => {
  const [left, setLeft] = React.useState<string>("");
  const pageBy = React.useMemo(
    () => ({
      aifid: "page-by",
      left: left,
      addBelow: false,
      canRemove: false,
      canMove: false,
      center: null,
      right: null,
    }),
    [left],
  );

  return (
    <div
      style={{
        width: "calc(vw - 4rem - 2px)",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "white",
        border: "1px solid black",
        margin: "1rem",
      }}
    >
      <h2>Current</h2>
      <AsupInternalBlock
        id="pageby"
        style={{
          fontFamily: "Courier New",
          fontSize: "9pt",
          fontWeight: 500,
        }}
        lines={[pageBy]}
        setLines={(ret) => ret[0].left !== left && setLeft(ret[0].left ?? "")}
        externalSingles={[
          {
            oldText: "=",
            newText: "<=",
          },
        ]}
        styleMap={{
          Optional: {
            css: { color: "seagreen" },
            aieExclude: ["Notes", "Superscript", "O^", "N^"],
          },
          Notes: {
            css: { color: "royalblue" },
            aieExclude: ["Optional", "Superscript", "O^", "N^"],
          },
          Superscript: {
            css: { verticalAlign: "super", fontSize: "small" },
            aieExclude: ["Optional", "Notes", "O^", "N^"],
          },
          "O^": {
            css: { color: "seagreen", verticalAlign: "super", fontSize: "small" },
            aieExclude: ["Optional", "Notes", "Superscript", "N^"],
          },
          "N^": {
            css: { color: "royalblue", verticalAlign: "super", fontSize: "small" },
            aieExclude: ["Optional", "Notes", "Superscript", "O^"],
          },
        }}
        minLines={1}
        maxLines={1}
      />
    </div>
  );
};
