import React, { useCallback } from "react";
import { AioReplacement } from "./aioInterface";
import { AioLabel } from "./aioLabel";
import { AioReplacementDisplay } from "./aioReplacementDisplay";

/**
 * Properties for AioReplacements
 * @param value AioReplacement list
 * @param setValue update function
 */
interface AioReplacementListProps {
  label?: string,
  replacements: AioReplacement[],
  setReplacements?: (value: AioReplacement[]) => void,
  dontAskOptions?: boolean,
  externalLists?: AioReplacement[],
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
    let newValue = [...replacements];
    newValue[i] = ret;
    setReplacements(newValue);
  }, [replacements, setReplacements]);

  const addReplacement = useCallback((i: number) => {
    if (typeof setReplacements !== "function") return;
    let newReplacements = [...replacements];
    let newReplacement: AioReplacement = { oldText: "", newText: [""], spaceAfter: false, includeTrailing: false, subLists: [], };
    newReplacements.splice(i, 0, newReplacement);
    setReplacements!(newReplacements);
  }, [replacements, setReplacements]);

  const removeReplacement = useCallback((i: number) => {
    if (typeof setReplacements !== "function") return;
    let newReplacements = [...replacements];
    newReplacements.splice(i, 1);
    setReplacements!(newReplacements);
  }, [replacements, setReplacements]);

  return (
    <>
      <AioLabel label={label} />
      <div>
        <span>then...</span>{" "}
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
                newText={repl.newText}
                subLists={repl.subLists}
                spaceAfter={repl.spaceAfter}
                includeTrailing={repl.includeTrailing}
                givenName={repl.givenName}
                externalName={repl.externalName}
                setReplacement={(ret) => updateReplacement(ret, i)}
                dontAskOptions={dontAskOptions}
                externalLists={externalLists}
              />
              {typeof setReplacements === "function" &&
                <div className="aiox-button-holder" style={{ display:"flex", flexDirection:"row", alignContent:"center" }}>
                  {replacements.length >= 1 && <div className={"aiox-button aiox-removeUp"} onClick={() => removeReplacement(i)} />}
                  <div className={"aiox-button aiox-addDown"} onClick={() => addReplacement(i+1)} />
                </div>
              }
            </div>
          )
        })}
      </div>
    </>
  );
}