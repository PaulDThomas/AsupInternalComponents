import React, { useEffect, useState } from 'react';
import { AioLabel } from './aioLabel';

interface AioStringProps {
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
      <AioLabel label={props.label} />
      <div className={'aio-input-holder'}>
        {typeof props.setValue !== 'function' ? (
          <span>{value}</span>
        ) : (
          <input
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
