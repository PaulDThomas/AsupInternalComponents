export function getHTMLfromV2Text(
  text: string,
  styleName: string,
  style: React.CSSProperties,
): string {
  if (styleName === '') return text.replace(/[\u200B-\u200F\uFEFF]/g, '');
  const isr = {
    length: text.length,
    offset: 0,
    style: styleName,
  };
  const cssString = Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, '-$&').toLowerCase()}:${v}`)
    .join(';');
  const html = `<div classname="aie-text" data-inline-style-ranges='${JSON.stringify([
    isr,
  ])}'><span classname="${styleName}" style="${cssString}">${text.replace(
    /[\u200B-\u200F\uFEFF]/g,
    '',
  )}</span></div>`;
  return html;
}
