export function getV2TextStyle(text: string): { newText: string; styleName: string } {
  // Do nothing if there is nothing to do
  if (!text.includes('classname')) return { newText: text, styleName: '' };
  // Create element so you can read the things
  const d = document.createElement('div');
  d.innerHTML = text;
  let styleName = '';
  // Any style info will have been in the first child dataset
  if ((d.children[0] as HTMLDivElement).dataset.inlineStyleRanges) {
    // Get the inline style range, but only interested in the style name
    const isr = JSON.parse((d.children[0] as HTMLDivElement).dataset.inlineStyleRanges ?? '[]');
    // Add the style name
    if (Array.isArray(isr) && isr.length > 0) styleName = isr[0].style;
  }
  return {
    newText: d.textContent ?? '',
    styleName,
  };
}
