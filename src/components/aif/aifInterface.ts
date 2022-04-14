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