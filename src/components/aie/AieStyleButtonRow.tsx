import * as React from 'react';
import { AieStyleButton } from './AieStyleButton';
import './aie.css';

interface AieStyleButtonRowProps { 
  styleList: string[], 
  currentStyle: Draft.DraftModel.ImmutableData.DraftInlineStyle, 
  applyStyleFunction: (styleName: string) => void,
  disabled?: boolean
}

export const AieStyleButtonRow = (props:AieStyleButtonRowProps):JSX.Element => {
  var buttons = [];
  for (var style of props.styleList) {
    buttons.push(
      <AieStyleButton
        key={style}
        styleName={style}
        currentStyle={props.currentStyle}
        applyStyleFunction={props.applyStyleFunction}
        disabled={props.disabled}
      />
    );
  }
  return (<>{buttons}</>);
}

