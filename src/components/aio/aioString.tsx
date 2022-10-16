import React, { useEffect, useState } from 'react';
import { AioLabel } from './aioLabel';

interface AioStringProps {
  id: string;
  label?: string;
  value?: string;
  setValue?: (value: string) => void;
}

export const AioString = (props: AioStringProps): JSX.Element => {
  const [value, setValue] = useState<string>(props.value ?? '');
  useEffect(() => {
    setValue(props.value ?? '');
  }, [props.value]);

  return (
    <>
      <AioLabel
        id={`${props.id}-label`}
        label={props.label}
      />
      <div className={'aio-input-holder'}>
        {typeof props.setValue !== 'function' ? (
          <span id={props.id}>{value}</span>
        ) : (
          <input
            id={props.id}
            className={'aio-input'}
            value={value ?? ''}
            type='text'
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
            onBlur={() => {
              if (props.setValue !== undefined) {
                props.setValue(value);
              }
            }}
          />
        )}
      </div>
    </>
  );
};
