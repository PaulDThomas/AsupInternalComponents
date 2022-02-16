import * as React from "react";
import { FC, useRef } from "react";
import { AioPrintItem } from "./aioPrintItem";

interface AioArraySortableProps {
  inputArray: any[],
  updateArray?: (value: any) => void,
};

export const AioArraySortable = (props: AioArraySortableProps): JSX.Element => {

  const renderCard = React.useCallback(
    (value: any, i: number) => {
      return (
        <AioPrintItem
          key={i}
          label={"!!grip!!"}
          value={value}
          setValue={(ret) => {
            const newArray = [...Object.values(props.inputArray)];
            newArray[i] = ret;
            if (props.updateArray) props.updateArray(newArray);
          }}
        />
      );
    }, []);


  return (
    <>
      {props.inputArray.map(renderCard)}
    </>
  );
}
