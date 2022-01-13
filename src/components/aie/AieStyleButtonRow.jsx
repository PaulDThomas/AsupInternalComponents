import 'draft-js/dist/Draft.css';
import './aie.css';
import { AieStyleButton } from './AieStyleButton';

export const AieStyleButtonRow = ({ styleList, currentStyle, applyStyleFunction }) => {
  var buttons = [];
  for (var style of styleList) {
    buttons.push(
      <AieStyleButton
        key={style}
        styleName={style}
        currentStyle={currentStyle}
        applyStyleFunction={applyStyleFunction}
      />
    );
  }
  return buttons;
}

