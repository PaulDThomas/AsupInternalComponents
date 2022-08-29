export interface AifBlockLine {
  aifid?: string; // Unique ID
  left?: string | false; // Left aligned text in the row
  centre?: string | false; // Centre aligned text in the row
  right?: string | false; // Right aligned text in the row
  addBelow?: boolean; // If the user can add a line below
  canEdit?: boolean; // If the user can edit the line
  canRemove?: boolean; // If the user can remove the line
  canMove?: boolean; // If the user can move the line in an array of lines
}

export const enum AifLineType {
  leftOnly = 'Left only',
  centreOnly = 'Centre only',
  leftAndRight = 'Left and Right',
  leftCentreAndRight = 'Left, Centre and Right',
}
