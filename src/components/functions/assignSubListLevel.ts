import { AioReplacementValue } from "components/aio/aioInterface";

export const assignSubListLevel = (
  rvs: AioReplacementValue[],
  levels: number
): AioReplacementValue[] => {
  if (levels <= 1)
    return rvs.map((rv) => {
      return { newText: rv.newText ?? "" };
    });
  else {
    if (!rvs.length) {
      return [
        {
          newText: "",
          subList: assignSubListLevel([{ newText: "" }], levels - 1)
        }
      ];
    } else {
      return rvs.map((rv) => {
        return {
          newText: rv.newText ?? "",
          subList: assignSubListLevel(rv.subList ?? [], levels - 1)
        };
      });
    }
  }
};