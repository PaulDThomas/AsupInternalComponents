import React from 'react';
import { AieStyleMap, AsupInternalEditor } from '../aie';

export const OriginalText = ({
  id,
  text,
  setText,
  styleMap,
}: {
  id: string;
  label: string;
  text: string | null | undefined;
  setText: (ret: string) => void;
  styleMap?: AieStyleMap;
}): JSX.Element => {
  if (typeof text !== 'string') return <></>;
  else
    return (
      <div className='aiw-body-row'>
        <div className={'aio-label'}>Unprocessed text: </div>
        <AsupInternalEditor
          id={id}
          value={text}
          setValue={setText}
          showStyleButtons={styleMap !== undefined}
          styleMap={styleMap}
        />
      </div>
    );
};
