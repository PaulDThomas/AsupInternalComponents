import * as React from 'react';
import './aie.css';

interface AieStyleButtonProps { 
  styleName: string, 
  currentStyle: Draft.DraftModel.ImmutableData.DraftInlineStyle, 
  applyStyleFunction: (styleName: string) => void,
};

export const AieStyleButton = (props:AieStyleButtonProps): JSX.Element => {
  // Apply style on click
  const aieClick = (e:React.MouseEvent) => {
    e.preventDefault();
    props.applyStyleFunction(props.styleName);
  }
  const className = "aie-button" + (props.currentStyle.has(props.styleName) ? " active" : "");
  return (
    <button className={className} onMouseDown={aieClick} >
      {props.styleName}
    </button>
  );
}

