export interface AifBlockLine {
  aifid?: string; // Unique ID
  left?: string | null; // Left aligned text in the row
  center?: string | null; // Center aligned text in the row
  right?: string | null; // Right aligned text in the row
  addBelow?: boolean; // If the user can add a line below
  canEdit?: boolean; // If the user can edit the line
  canRemove?: boolean; // If the user can remove the line
  canMove?: boolean; // If the user can move the line in an array of lines
  canChangeType?: boolean; // Can update the type of line
}

export const enum AifLineType {
  leftOnly = 'Left only',
  centerOnly = 'Center only',
  leftAndRight = 'Left and Right',
  leftCenterAndRight = 'Left, Center and Right',
}
