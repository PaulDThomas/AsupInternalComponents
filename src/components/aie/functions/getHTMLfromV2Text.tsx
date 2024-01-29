import { toHtml } from '../../functions/tofromHtml';

export function getHTMLfromV2Text(
  text: string,
  styleName: string,
  style: React.CSSProperties,
): string {
  const isr = JSON.stringify([
    {
      length: text.length,
      offset: 0,
      style: styleName,
    },
  ]);

  const html = document.createElement('div');
  html.setAttribute('classname', 'aie-text');
  html.dataset.inlineStyleRanges = isr;

  const span = document.createElement('span');
  if (styleName !== '') {
    span.setAttribute('classname', styleName);
  }
  html.appendChild(span);

  const cssString = Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, '-$&').toLowerCase()}:${v}`)
    .join(';');
  span.setAttribute('style', cssString);

  const textContent = document.createTextNode(toHtml(text.replace(/[\u200B-\u200F\uFEFF]/g, '')));
  span.appendChild(textContent);

  return html.outerHTML;
}
