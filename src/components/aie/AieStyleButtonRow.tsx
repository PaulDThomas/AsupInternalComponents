import * as React from "react";
import "./aie.css";
import { AieStyleButton } from "./AieStyleButton";

interface AieStyleButtonRowProps {
  id: string;
  styleList: string[];
  currentStyle: Draft.DraftModel.ImmutableData.DraftInlineStyle | string;
  applyStyleFunction: (styleName: string) => void;
  disabled?: boolean;
}

export const AieStyleButtonRow = (props: AieStyleButtonRowProps): JSX.Element => {
  const buttons = [];
  for (const style of props.styleList) {
    buttons.push(
      <AieStyleButton
        id={`${props.id}-${style}`}
        key={style}
        styleName={style}
        currentStyle={
          typeof props.currentStyle === "string" ? style === props.currentStyle : props.currentStyle
        }
        applyStyleFunction={props.applyStyleFunction}
        disabled={props.disabled && props.currentStyle !== "string"}
      />,
    );
  }
  return <>{buttons}</>;
};
