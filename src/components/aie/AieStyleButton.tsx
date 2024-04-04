import * as React from "react";
import "./aie.css";

interface AieStyleButtonProps {
  id: string;
  styleName: string;
  currentStyle: Draft.DraftModel.ImmutableData.DraftInlineStyle | boolean;
  applyStyleFunction: (styleName: string) => void;
  disabled?: boolean;
}

export const AieStyleButton = (props: AieStyleButtonProps): JSX.Element => {
  // Apply style on click
  const aieClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.applyStyleFunction(props.styleName);
  };
  const className =
    "aie-button" +
    ((typeof props.currentStyle === "boolean" && props.currentStyle === true) ||
    (typeof props.currentStyle !== "boolean" && props.currentStyle.has(props.styleName))
      ? " active"
      : "");
  return (
    <button
      id={props.id}
      className={className}
      onMouseDown={aieClick}
      disabled={props.disabled}
    >
      {props.styleName}
    </button>
  );
};
