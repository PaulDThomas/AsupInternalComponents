import { AioBoolean } from "./aioBoolean";
import { AioExpander } from "./aioExpander";
import { AioOptionType } from "./aioInterface";
import { AioLabel } from "./aioLabel";
import { AioNumber } from "./aioNumber";
import { AioSelect } from "./aioSelect";
import { AioString } from "./aioString";

interface iRenderLineItem {
  id: string;
  value: unknown;
  label?: string;
  availableValues?: Array<string>;
  setValue?: (value: unknown) => void;
  type?: string;
  canAddItems?: boolean;
  canMoveItems?: boolean;
  canRemoveItems?: boolean;
}

export const RenderLineItem = ({
  id,
  value,
  label,
  availableValues,
  setValue,
  type,
  canAddItems,
  canMoveItems,
  canRemoveItems,
}: iRenderLineItem): JSX.Element => {
  // Take given type, or treat null as a string, or work out what we have
  switch (type ?? (value === null ? "string" : typeof value)) {
    // Processing - do nothing, this should not be hit here
    // case (AioOptionType.processing): return (<></>);
    // Object, need another expander
    case "object":
    case AioOptionType.object:
      return (
        <AioExpander
          id={id}
          label={label}
          inputObject={value as { [key: string]: unknown } | undefined}
          updateObject={
            setValue
              ? (ret: { [key: string]: unknown }) => {
                  if (typeof setValue === "function") setValue(ret);
                }
              : undefined
          }
          canAddItems={canAddItems}
          canMoveItems={canMoveItems}
          canRemoveItems={canRemoveItems}
        />
      );

    // Replacements
    // case AioOptionType.replacements:
    //   return (
    //     <AioReplacementList
    //       id={id}
    //       label="Replacement text"
    //       replacements={value as AioReplacement[] | undefined}
    //       setReplacements={
    //         setValue
    //           ? (ret: AioReplacement[]) => {
    //               if (typeof setValue === "function") setValue(ret);
    //             }
    //           : undefined
    //       }
    //     />
    //   );

    // Select
    case AioOptionType.select:
      return (
        <AioSelect
          id={id}
          label={label}
          value={value as string | undefined}
          availableValues={availableValues}
          setValue={
            setValue
              ? (ret: string) => {
                  if (typeof setValue === "function") setValue(ret);
                }
              : undefined
          }
        />
      );

    // Number
    case AioOptionType.number:
    case "number":
      return (
        <AioNumber
          id={id}
          label={label}
          value={value as number}
          setValue={
            setValue
              ? (ret: number) => {
                  if (typeof setValue === "function") setValue(ret);
                }
              : undefined
          }
        />
      );

    // Boolean
    case AioOptionType.boolean:
    case "boolean":
      return (
        <AioBoolean
          id={id}
          label={label}
          value={value as boolean}
          setValue={
            setValue
              ? (ret: boolean) => {
                  if (typeof setValue === "function") setValue(ret);
                }
              : undefined
          }
        />
      );

    // String or default
    case AioOptionType.string:
    case "string":
      return (
        <AioString
          id={id}
          label={label}
          value={value as string}
          setValue={
            setValue
              ? (ret: string) => {
                  if (typeof setValue === "function") setValue(ret);
                }
              : undefined
          }
        />
      );

    // Undefined
    case "undefined":
      return (
        <AioString
          id={id}
          label={label}
          value={"Undefined"}
        />
      );

    default:
      return (
        <AioLabel
          id={`${id}-missing`}
          label={`Missing type for ${type ?? (value === null ? "string" : typeof value)}`}
          noColon={true}
        />
      );
  }
};
