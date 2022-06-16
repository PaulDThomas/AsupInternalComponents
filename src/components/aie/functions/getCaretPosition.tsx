export function getCaretPosition(element: HTMLElement): { start: number; end: number; } {
  let end: number = 0;
  let start: number = 0;
  let sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    var range = sel.getRangeAt(0);
    var preCaretRange = range.cloneRange();
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
