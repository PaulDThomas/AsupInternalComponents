/**
 * Replace text in HTML string, updating inline-style-ranges
 * @param s
 * @param oldPhrase
 * @param newPhrase
 * @returns
 */
export const newReplacedText = (s: string, oldPhrase: string, newPhrase: string): string => {
  let ret: string;
  // Do standard replace if not aie-text or no inline styles
  if (!s.match(/^<div classname=["']aie-text/i) || !s.includes('data-inline-style-ranges')) {
    ret = s.replaceAll(oldPhrase, newPhrase);
  }
  // Otherwise work out new style points
  else {
    // Create element to manipulate
    const htmlIn = document.createElement('template');
    htmlIn.innerHTML = s.trim();
    // Cycle through each block as a div
    for (let i = 0; i < htmlIn.content.children.length; i++) {
      // Set up for inlineStyle manipulation
      let pos = 0;
      const inlineStyleRanges: { offset: number; length: number; style: string }[] = [];
      // Update element text
      const child = htmlIn.content.children[i] as HTMLDivElement;
      child.innerHTML = child.innerHTML.replaceAll(oldPhrase, newPhrase);
      // Get new style lengths
      for (let j = 0; j < child.childNodes.length; j++) {
        // Should only be possible to have span and #text
        if (child.childNodes[j].nodeName === 'SPAN') {
          const subchild = child.childNodes[j] as HTMLSpanElement;
          inlineStyleRanges.push({
            offset: pos,
            length: subchild.textContent?.length ?? 0,
            style: subchild.attributes.getNamedItem('classname')?.value ?? '',
          });
          pos = pos + (subchild.textContent?.length ?? 0);
        }
        // Move position marker
        else {
          pos = pos + (child.childNodes[j] as Text).length;
        }
      }
      // Replace block data
      child.dataset.inlineStyleRanges = JSON.stringify(inlineStyleRanges);
    }
    // Return processed element
    ret = htmlIn.innerHTML;
  }
  return ret;
};
