import React, { useCallback } from 'react';
import './aio.css';
import { AioOption } from './aioInterface';
import { AioLabel } from './aioLabel';
import { AioPrintOption } from './aioPrintOption';

interface AioOptionDisplayProps {
  options?: AioOption[];
  setOptions?: (ret: AioOption[]) => void;
}

export const AioOptionDisplay = ({ options, setOptions }: AioOptionDisplayProps): JSX.Element => {
  // Update current options from child object
  const updateOption = useCallback(
    (ret: AioOption, i: number) => {
      if (typeof setOptions !== 'function') return;
      const newOptions = [...(options ?? [])];
      newOptions[i].value = ret;
      setOptions(newOptions);
    },
    [options, setOptions],
  );

  if (options === undefined)
    return (
      <div className='aio-body-row'>
        <AioLabel label='No options deinfed' />
      </div>
    );

  return (
    <>
      {options?.map((option, i) => {
        return (
          <div
            className='aio-body-row'
            key={i}
          >
            <AioPrintOption
              id={option.optionName as string}
              label={(option.label ?? option.optionName) as string}
              value={option.value}
              setValue={
                !option.readOnly
                  ? (ret: AioOption) => {
                      updateOption(ret, i);
                    }
                  : undefined
              }
              type={option.type}
              availablValues={option.availableValues}
            />
          </div>
        );
      })}
    </>
  );
};
