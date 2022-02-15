import * as React from "react";
import { AioString } from "./aioString.jsx";
import { Option } from "./aioInterface.js";

export const AioPrintOption = (option: Option, updateOption: () => void): JSX.Element => {
    if (!option) {
      return (<></>);
    }

    switch (option.type) {
      case ("string"):
      default:
        return (
          <AioString
            Label={option.label ?? option.name}
            Value={option.value}
            SetValue={updateOption}
          />
        )
    }
  }