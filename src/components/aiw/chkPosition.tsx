import React from 'react';
import { Rnd } from 'react-rnd';

export const chkPosition = (
  windowRef: React.RefObject<Rnd>,
  currentX?: number | undefined,
  currentY?: number | undefined,
): { newX: number; newY: number } => {
  if (!windowRef.current || !windowRef.current.resizableElement.current)
    return { newX: 0, newY: 0 };
  const posn = windowRef.current.resizableElement.current.getBoundingClientRect();
  const parentPosn = windowRef.current.getParent().getBoundingClientRect();
  let newX = currentX ?? 0;
  let newY = currentY ?? 0;
  if (posn.left < 0) {
    newX = -parentPosn.left;
  }
  if (
    posn.right > window.innerWidth ||
    (currentX === undefined && parentPosn.left + posn.width > window.innerWidth)
  ) {
    newX = Math.max(-parentPosn.left, window.innerWidth - parentPosn.left - posn.width);
  }
  if (posn.top < 0) {
    newY = -parentPosn.top;
  }
  if (
    posn.bottom > window.innerHeight ||
    (currentY === undefined && parentPosn.top + posn.height > window.innerHeight)
  ) {
    newY = Math.max(-parentPosn.top, window.innerHeight - parentPosn.top - posn.height);
  }
  return { newX, newY };
};
