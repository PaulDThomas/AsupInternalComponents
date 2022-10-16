import React from 'react';
import { AioIconButton } from './aioIconButton';

interface AioDropSelectProps {
  id: string;
  value?: string;
  availableValues?: Array<string>;
  setValue?: (value: string) => void;
}

/**
 * Wrapper to preprend Icon button with chosen text
 */
export const AioDropSelect = ({
  id,
  value,
  setValue,
  availableValues,
}: AioDropSelectProps): JSX.Element => {
  return (
    <>
      <div
        id={id}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <span
          id={`${id}-value`}
          style={{
            marginRight: value !== undefined ? '0.25rem' : '0',
          }}
        >
          {value}
        </span>
        {typeof setValue === 'function' && (
          <AioIconButton
            id={`${id}-button`}
            onClick={(ret) => {
              setValue(ret);
            }}
            menuItems={availableValues}
          />
        )}
      </div>
    </>
  );
};
