export interface AifBlockLine {
  aifid?: string,
  left?: string | false,
  centre?: string | false,
  right?: string | false,
  addBelow?: boolean,
  canEdit?: boolean,
  canRemove?: boolean,
  canMove?: boolean,
}

export enum AifLineType {
  leftOnly = "Left only",
  centreOnly = "Centre only",
  leftAndRight = "Left and Right", 
  leftCentreAndRight = "Left, Centre and Right"
}