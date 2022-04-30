import { AioReplacement, AitRowData, AitRowGroupData, AitTableData } from "components";
import { oldReplacement, updateReplacementVersion } from "./updateReplacementVersion";

interface OldTableData {
  headerData?: OldRowGroupData,
  bodyData?: OldRowGroupData[],
  comments?: string,
  rowHeaderColumns?: number,
  noRepeatProcessing?: boolean,
};

interface OldRowGroupData {
  aitid?: string,
  name?: string,
  rows: AitRowData[],
  comments?: string,
  spaceAfter?: boolean,
  replacements?: AioReplacement[] | oldReplacement[],
};

export const updateTableDataVersion = (inData: OldTableData): AitTableData => {
  return {
    ...inData,
    headerData: {
      ...inData.headerData,
      replacements: updateReplacementVersion(inData.headerData?.replacements)
    } as AitRowGroupData,
    bodyData: inData.bodyData?.map(rg => {
      return {
        ...rg,
        replacements: updateReplacementVersion(rg.replacements)
      } as AitRowGroupData;
    })
  };
};