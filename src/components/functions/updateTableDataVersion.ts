import { AioReplacement } from "../aio";
import { AitRowData, AitRowGroupData, AitTableData } from "../ait";
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

export const updateTableDataVersion = (inData: OldTableData | AitTableData): AitTableData => {
  let headerData = inData.headerData === false
    ? false
    : inData.headerData !== undefined
      ? {
        ...inData.headerData,
        replacements: inData.headerData?.replacements !== undefined
          ? updateReplacementVersion(inData.headerData?.replacements)
          : undefined
      } as AitRowGroupData
      : undefined
    ;
  let outData: AitTableData = {
    ...inData,
    headerData: headerData,
    bodyData: inData.bodyData?.map(rg => {
      let org = {
        ...rg,
        replacements: rg.replacements !== undefined
          ? updateReplacementVersion(rg.replacements)
          : undefined
      } as AitRowGroupData;
      if (rg.replacements === undefined) delete org.replacements;
      return org;
    })
  };
  return outData;
};