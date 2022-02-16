import * as React from "react";
import { AioString } from "./aioString";
import { Option } from "./aioInterface.js";

interface AioPrintOptionProps {
  option: Option, 
  updateOption?: (value: any) => void,
};

export const AioPrintOption = ( props: AioPrintOptionProps ): JSX.Element => {
  if (!props.option) {
    console.log("Returning notihng from AioPrintOption");
    console.log(JSON.stringify(props));
    return (<></>);
  }

  switch (props.option.type) {
    case ("string"):
    default:
      return (
        <AioString
          label={props.option.label ?? props.option.name}
          value={props.option.value}
          setValue={(ret:string) => { if (props.updateOption) props.updateOption(ret); } }
        />
      )
  }
}