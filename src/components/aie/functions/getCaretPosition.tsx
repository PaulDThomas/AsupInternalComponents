export function getCaretPosition(element: HTMLElement): { start: number; end: number } {
  let end = 0;
  let start = 0;
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    end = preCaretRange.toString().length;
    if (element.contains(range.startContainer)) {
      preCaretRange.setStart(range.startContainer, range.startOffset);
      start = end - preCaretRange.toString().length;
    }
  }
  return { start, end };
}
