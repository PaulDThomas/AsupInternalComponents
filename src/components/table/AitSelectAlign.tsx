import { DraftComponent } from "draft-js";
import { AioSelect } from "../aio/aioSelect";

interface AitSelectAlignProps {
  id: string;
  align?: DraftComponent.Base.DraftTextAlignment | "default" | "decimal";
  setAlign?: (ret: DraftComponent.Base.DraftTextAlignment | null | "decimal") => void;
}

export const AitSelectAlign = ({ id, align, setAlign }: AitSelectAlignProps) => {
  return (
    <AioSelect
      id={id}
      label="Justify text"
      value={
        align === undefined
          ? "Default"
          : align.charAt(0).toUpperCase() + align.substring(1).toLowerCase()
      }
      availableValues={["Default", "Left", "Center", "Right", "Decimal"]}
      setValue={
        setAlign
          ? (ret) =>
              setAlign(
                ret !== "Default"
                  ? (ret.toLowerCase() as DraftComponent.Base.DraftTextAlignment | "decimal")
                  : null,
              )
          : undefined
      }
    />
  );
};
