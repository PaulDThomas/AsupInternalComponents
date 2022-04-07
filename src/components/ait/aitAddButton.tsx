import React from 'react';

interface AitAddButtonProps {
  onClick: (ret: string) => void,
  tipText?: string,
  dropDownOptions?: string[],
}

export const AitAddButton = ({
  onClick,
  tipText,
  dropDownOptions,
}: AitAddButtonProps): JSX.Element => {

  return (
    <div style={{ position: "relative" }}>
      <div className="ait-tip" style={{ display: "flex", alignContent: "flex-start" }}>
        <div
          className={`ait-options-button ait-options-button-add-row-group`}
          onClick={(e) => { onClick(dropDownOptions ? dropDownOptions[0] : "") }}
        >
          <span className="ait-tiptext ait-tip-top">{tipText}</span>
        </div>
      </div>
    </div>
  );
}