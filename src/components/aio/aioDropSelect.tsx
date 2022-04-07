import React from "react";
import { AioIconButton } from "./aioIconButton";

interface AioDropSelectProps {
  value?: string,
  availableValues?: Array<string>,
  setValue?: (value: string) => void,
}

/**
 * Wrapper to preprend Icon button with chosen text
 */
export const AioDropSelect = ({ value, setValue, availableValues }: AioDropSelectProps): JSX.Element => {
  return (
    <>
      <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        <span
          style={{
            marginRight: value !== undefined ? "0.25rem" : "0"
          }}
        >{value}</span>
        {typeof setValue === "function" &&
          <AioIconButton
            onClick={(ret) => { setValue(ret); }}
            menuItems={availableValues}
          />
        }
      </div>
    </>
  );
}