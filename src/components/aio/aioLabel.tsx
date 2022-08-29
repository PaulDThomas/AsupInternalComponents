import * as React from 'react';

interface AioLabelProps {
  label?: string;
  noColon?: boolean;
}

export const AioLabel = (props: AioLabelProps): JSX.Element => {
  if (props.label === undefined) return <></>;

  return (
    <div className={'aio-label'}>{`${props.label}${!props.noColon && props.label ? ':' : ''}`}</div>
  );
};
