import React, {useCallback} from "react";
import { AioReplacement } from "./aioInterface";
import { AioLabel } from "./aioLabel";

interface AioReplacementsProps {
  value: AioReplacement,
  setValue?: (value: AioReplacement) => void,
}

export const AioReplacements = (props: AioReplacementsProps): JSX.Element => {

  const updateText = useCallback((newText: string) => {
    console.log(`new text`);
    let newReplacement = props.value ?? { replacementText: "", replacementValues: []};
    newReplacement.replacementText = newText;
    props.setValue!(newReplacement);
  }, [props]);

  const updateList = useCallback((newList: string) => {
    console.log(`new list`);
    let newReplacement = props.value ?? { replacementText: "", replacementValues: []};
    newReplacement.replacementValues = newList.split("\n");
    props.setValue!(newReplacement);
  }, [props]);

  return (
    <>
        <AioLabel label={"Replace text"} />
        <div className={"aio-input-holder"}>
          {(typeof (props.setValue) !== "function")
            ?
            <span>{props.value.replacementText}</span>
            :
            <input
              className={"aio-input"}
              value={props.value?.replacementText ?? ""}
              type="text"
              onChange={(e) => updateText(e.currentTarget.value)}
            />
          }
          <div>with...</div>
          {(typeof (props.setValue) !== "function")
            ?
            <span>{props.value.replacementValues?.join("\n")}</span>
            :
            <textarea
              className={"aio-input"}
              rows={4}
              value={props.value?.replacementValues?.join("\n") ?? ""}
              onChange={(e) => updateList(e.currentTarget.value)}
            />
          }
        </div>
    </>
  );
}