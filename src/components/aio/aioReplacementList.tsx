import React, { useCallback } from "react";
import { newReplacement } from "../functions";
import { AioIconButton } from "./aioIconButton";
import { AioExternalReplacements, AioReplacement } from "./aioInterface";
import { AioLabel } from "./aioLabel";
import { AioReplacementDisplay } from "./aioReplacementDisplay";

/**
 * Properties for AioReplacements
 * @param value AioReplacement list
 * @param setValue update function
 */
interface AioReplacementListProps {
  id: string;
  label?: string;
  replacements?: AioReplacement[];
  setReplacements?: (ret: AioReplacement[]) => void;
  dontAskSpace?: boolean;
  dontAskTrail?: boolean;
  externalLists?: AioExternalReplacements[];
}

/**
 * Option item for replacements
 * @param props replacement object
 * @returns JSX
 */
export const AioReplacementList = ({
  id,
  label,
  replacements,
  setReplacements,
  dontAskSpace,
  dontAskTrail,
  externalLists,
}: AioReplacementListProps): JSX.Element => {
  /** Update individual replacement and send it back */
  const updateReplacement = useCallback(
    (ret: AioReplacement, i: number) => {
      if (typeof setReplacements !== "function") return;
      const newValue = [...(replacements ?? [])];
      newValue[i] = ret;
      setReplacements(newValue);
    },
    [replacements, setReplacements],
  );

  const addReplacement = useCallback(
    (i: number) => {
      if (typeof setReplacements !== "function") return;
      const newReplacements = [...(replacements ?? [])];
      newReplacements.splice(i, 0, newReplacement());
      setReplacements(newReplacements);
    },
    [replacements, setReplacements],
  );

  const removeReplacement = useCallback(
    (i: number) => {
      if (typeof setReplacements !== "function") return;
      const newReplacements = [...(replacements ?? [])];
      newReplacements.splice(i, 1);
      setReplacements(newReplacements);
    },
    [replacements, setReplacements],
  );

  return (
    <>
      <AioLabel
        id={`${id}-label`}
        label={label}
      />
      <div>
        {!label && (
          <>
            <span>then...</span>{" "}
          </>
        )}
        {typeof setReplacements === "function" && (
          <div
            id={`${id}-addreplacement`}
            className={"aiox-button aiox-addDown"}
            onClick={() => addReplacement(0)}
          />
        )}
        {(replacements ?? []).map((repl, i) => {
          return (
            <div key={`${i}-${repl.airid}`}>
              {i > 0 && <div> and...</div>}
              <AioReplacementDisplay
                id={`${id}-replacementdisplay-${i}`}
                airid={repl.airid}
                oldText={repl.oldText}
                newTexts={repl.newTexts}
                includeTrailing={repl.includeTrailing}
                externalName={repl.externalName}
                setReplacement={
                  typeof setReplacements === "function"
                    ? (ret) => updateReplacement(ret, i)
                    : undefined
                }
                dontAskSpace={dontAskSpace}
                dontAskTrail={dontAskTrail}
                externalLists={externalLists}
              />
              {typeof setReplacements === "function" && (
                <div
                  className="aiox-button-holder"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    marginBottom: "2px",
                  }}
                >
                  {replacements && replacements.length >= 1 && (
                    <AioIconButton
                      id={`${id}-remove`}
                      iconName={"aiox-removeUp"}
                      onClick={() => removeReplacement(i)}
                      tipText={"Remove old text"}
                    />
                  )}
                  <AioIconButton
                    id={`${id}-add`}
                    iconName={"aiox-addDown"}
                    onClick={() => addReplacement(i + 1)}
                    tipText={"Add old text"}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
