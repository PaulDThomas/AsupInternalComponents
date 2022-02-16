import * as React from "react";
import { AioPrintItem } from "./aioPrintItem";

interface AioArraySortableProps {
  inputArray: any[],
  updateArray?: (value: any) => void,
  newItem?: any,
  canRemoveItems?: boolean,
};

export function AioArraySortable(props: AioArraySortableProps) {

  return (
    <>
      {
        props.inputArray.map((value: any, i: number) => {
          const id = value ?? i;
          return (
            <AioPrintItem
              key={i}
              id={id}
              value={value}
              setValue={
                (props.updateArray) ? (ret) => {
                  const newArray = [...Object.values(props.inputArray)];
                  newArray[i] = ret;
                  if (props.updateArray) props.updateArray(newArray);
                } : undefined
              }
              moveUp={
                (props.updateArray && i > 0) ? () => {
                  const mover = props.inputArray[i];
                  const newArray = [...(props.inputArray)];
                  newArray.splice(i, 1);
                  newArray.splice(i - 1, 0, mover);
                  if (props.updateArray) props.updateArray(newArray);
                } : undefined
              }
              moveDown={
                (props.updateArray &&i < props.inputArray.length - 1) ? () => {
                  const mover = props.inputArray[i];
                  const newArray = [...(props.inputArray)];
                  newArray.splice(i, 1);
                  newArray.splice(i + 1, 0, mover);
                  if (props.updateArray) props.updateArray(newArray);
                } : undefined
              }
              addItem={
                (props.updateArray && props.newItem !== undefined) ? () => {
                  const newArray = [...props.inputArray];
                  newArray.splice(i, 0, props.newItem);
                  if (props.updateArray) props.updateArray(newArray);
                } : undefined
              }
              removeItem={
                (props.updateArray && props.canRemoveItems) ? () => {
                  const newArray = [...props.inputArray];
                  newArray.splice(i, 1);
                  if (props.updateArray) props.updateArray(newArray);
                } : undefined
              }
            />
          );
        })
      }
    </>
  );
}
