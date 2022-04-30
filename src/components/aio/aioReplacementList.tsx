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
  label?: string,
  replacements?: AioReplacement[],
  setReplacements?: (ret: AioReplacement[]) => void,
  dontAskOptions?: boolean,
  externalLists?: AioExternalReplacements[],
}

/**
 * Option item for replacements
 * @param props replacement object
 * @returns JSX
 */
export const AioReplacementList = ({
  label,
  replacements,
  setReplacements,
  dontAskOptions,
  externalLists,
}: AioReplacementListProps): JSX.Element => {

  /** Update individual replacement and send it back */
  const updateReplacement = useCallback((ret: AioReplacement, i: number) => {
    if (typeof setReplacements !== "function") return;
    let newValue = [...(replacements ?? [])];
    newValue[i] = ret;
    setReplacements(newValue);
  }, [replacements, setReplacements]);

  const addReplacement = useCallback((i: number) => {
    if (typeof setReplacements !== "function") return;
    let newReplacements = [...(replacements ?? [])];
    newReplacements.splice(i, 0, newReplacement());
    setReplacements!(newReplacements);
  }, [replacements, setReplacements]);

  const removeReplacement = useCallback((i: number) => {
    if (typeof setReplacements !== "function") return;
    let newReplacements = [...replacements!];
    newReplacements.splice(i, 1);
    setReplacements!(newReplacements);
  }, [replacements, setReplacements]);

  return (
    <>
      <AioLabel label={label} />
      <div>
        {!label && <><span>then...</span>{" "}</>}
        {typeof setReplacements === "function" &&
          <div className={"aiox-button aiox-addDown"} onClick={() => addReplacement(0)} />
        }
        {(replacements ?? []).map((repl, i) => {
          return (
            <div key={repl.airid ?? i}>
              {i > 0 && <div> and...</div>}
              <AioReplacementDisplay
                airid={repl.airid}
                oldText={repl.oldText}
                newTexts={repl.newTexts}
                includeTrailing={repl.includeTrailing}
                externalName={repl.externalName}
                setReplacement={typeof setReplacements === "function" ? (ret) => updateReplacement(ret, i) : undefined}
                dontAskOptions={dontAskOptions}
                externalLists={externalLists}
              />
              {typeof setReplacements === "function" &&
                <div className="aiox-button-holder" style={{ display: "flex", flexDirection: "row", alignContent: "center", marginBottom: '2px' }}>
                  {replacements!.length >= 1 && <AioIconButton iconName={"aiox-removeUp"} onClick={() => removeReplacement(i)} tipText={"Add old text"} />}
                  <AioIconButton iconName={"aiox-addDown"} onClick={() => addReplacement(i + 1)} tipText={"Remove old text"} />
                </div>
              }
            </div>
          )
        })}
      </div>
    </>
  );
}