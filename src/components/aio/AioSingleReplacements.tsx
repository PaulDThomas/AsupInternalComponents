import React, { useCallback } from 'react';
import { fromHtml, newExternalSingle, toHtml } from '../functions';
import { AioIconButton } from './aioIconButton';
import { AioExternalSingle } from './aioInterface';
import { AioLabel } from './aioLabel';
import { AioString } from './aioString';

/**
 * Properties for AioReplacements
 * @param value AioReplacement list
 * @param setValue update function
 */
interface AioSingleReplacementProps {
  id: string;
  label?: string;
  replacements?: AioExternalSingle[];
  setReplacements?: (ret: AioExternalSingle[]) => void;
}

/**
 * Option item for replacements
 * @param props replacement object
 * @returns JSX
 */
export const AioSingleReplacements = ({
  id,
  label,
  replacements,
  setReplacements,
}: AioSingleReplacementProps): JSX.Element => {
  /* Send everything back */
  const returnData = useCallback(
    (ret: AioExternalSingle, i: number) => {
      if (typeof setReplacements !== 'function') return;
      const newReplacements = [...(replacements ?? [])];
      newReplacements[i] = ret;
      setReplacements(newReplacements);
    },
    [replacements, setReplacements],
  );

  /** Update individual replacement */
  const updateReplacement = useCallback(
    (ret: { oldText?: string; newText?: string }, i: number) => {
      if (
        typeof setReplacements !== 'function' ||
        replacements === undefined ||
        replacements.length < i - 1
      )
        return;
      const newReplacement: AioExternalSingle = {
        airid: replacements[i].airid,
        oldText: ret.oldText ?? replacements[i].oldText,
        newText: ret.newText ?? replacements[i].newText,
      };
      returnData(newReplacement, i);
    },
    [replacements, returnData, setReplacements],
  );

  const addReplacement = useCallback(
    (i: number) => {
      if (typeof setReplacements !== 'function') return;
      const newReplacements = [...(replacements ?? [])];
      newReplacements.splice(i, 0, newExternalSingle());
      setReplacements(newReplacements);
    },
    [replacements, setReplacements],
  );

  const removeReplacement = useCallback(
    (i: number) => {
      if (typeof setReplacements !== 'function') return;
      const newReplacements = [...(replacements ?? [])];
      newReplacements.splice(i, 1);
      setReplacements(newReplacements);
    },
    [replacements, setReplacements],
  );

  return (
    <>
      <AioLabel
        id={`${id}-label`}
        label={label}
      />
      <div>
        {typeof setReplacements === 'function' && (
          <AioIconButton
            id={`${id}-add`}
            iconName={'aiox-addDown'}
            onClick={() => addReplacement(0)}
            tipText={'Add text'}
          />
        )}
        {(replacements ?? []).map((repl, i) => {
          return (
            <div key={`${i}-${repl.airid}`}>
              <AioString
                id={`${id}-from`}
                label='From'
                value={fromHtml(repl.oldText ?? '')}
                setValue={(ret) => updateReplacement({ oldText: toHtml(ret) }, i)}
              />
              <AioString
                id={`${id}-to`}
                label='to'
                value={fromHtml(repl.newText ?? '')}
                setValue={(ret) => updateReplacement({ newText: toHtml(ret) }, i)}
              />

              {typeof setReplacements === 'function' && (
                <div
                  className='aiox-button-holder'
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    marginBottom: '2px',
                  }}
                >
                  {replacements && replacements.length >= 1 && (
                    <AioIconButton
                      id={`${id}-remove`}
                      iconName={'aiox-removeUp'}
                      onClick={() => removeReplacement(i)}
                      tipText={'Remove text'}
                    />
                  )}
                  <AioIconButton
                    id={`${id}-add`}
                    iconName={'aiox-addDown'}
                    onClick={() => addReplacement(i + 1)}
                    tipText={'Add text'}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
