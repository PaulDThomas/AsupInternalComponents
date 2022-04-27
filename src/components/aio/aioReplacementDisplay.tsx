import React, { useCallback } from "react";
import { AioReplacement } from "./aioInterface";
import { AioLabel } from "./aioLabel";
import { AioReplacementTable } from "./aioReplacementTable";

/**
 * Properties for AioReplacements
 * @param value AioReplacement list
 * @param setValue update function
 */
interface AioReplacementsProps {
  replacements: AioReplacement[],
  setReplacements?: (value: AioReplacement[]) => void,
  dontAskSpace?: boolean,
  externalLists?: AioReplacement[],
}

/**
 * Option item for replacements
 * @param props replacement object
 * @returns JSX
 */
export const AioReplacementDisplay = ({
  replacements,
  setReplacements,
  dontAskSpace,
  externalLists,
}: AioReplacementsProps): JSX.Element => {

  /** Update individual replacement and send it back */
  const updateReplacement = useCallback((ret: AioReplacement, i: number) => {
    if (typeof setReplacements !== "function") return;
    let newValue = [...replacements];
    newValue[i] = ret;
    setReplacements(newValue);
  }, [replacements, setReplacements]);

  const addReplacement = useCallback((i: number) => {
    let newReplacements = [...replacements];
    let newReplacement: AioReplacement = { replacementTexts: [{ text: "", spaceAfter: false, }], replacementValues: [{ newText: "", }], };
    newReplacements.splice(i + 1, 0, newReplacement);
    setReplacements!(newReplacements);
  }, [replacements, setReplacements]);

  const removeReplacement = useCallback((i: number) => {
    let newReplacements = [...replacements];
    newReplacements.splice(i, 1);
    setReplacements!(newReplacements);
  }, [replacements, setReplacements]);

  return (
    <>
      <AioLabel label={"Replace text"} />
      <div className={"aio-input-holder"}>
        {typeof setReplacements === "function" && 
          <div className="aiox-button-holder" style={{ minWidth: "32px", width: "32px" }}>
            <div className={"aiox-button aiox-addDown"} onClick={() => addReplacement(-1)} />
          </div>
        }
        {(replacements ?? []).map((repl, i) => {
          return (
            <div key={repl.airid ?? i}>
              {i > 0 && <div> and then...</div>}
              <AioReplacementTable
                airid={repl.airid}
                replacementTexts={repl.replacementTexts}
                replacementValues={repl.replacementValues}
                givenName={repl.givenName}
                externalName={repl.externalName}
                setReplacement={(ret) => updateReplacement(ret, i)}
                dontAskSpace={dontAskSpace}
                externalLists={externalLists}
              />
              {typeof setReplacements === "function" &&
                <div className="aiox-button-holder" style={{ minWidth: "32px", width: "32px" }}>
                  <div className={"aiox-button aiox-addDown"} onClick={() => addReplacement(i)} />
                  {replacements.length >= 1 && <div className={"aiox-button aiox-removeUp"} onClick={() => removeReplacement(i)} />}
                </div>
              }
            </div>
          )
        })}
      </div>
    </>
  );
}