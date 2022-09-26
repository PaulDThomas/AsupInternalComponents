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

  const cssString = Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, '-$&').toLowerCase()}:${v}`)
    .join(';');

  let html = `<div classname="aie-text" data-inline-style-ranges='${isr}'>`;

  html += `<span${styleName !== '' ? `classname="${styleName}" style="${cssString}"` : ''}>${toHtml(
    text.replace(/[\u200B-\u200F\uFEFF]/g, ''),
  )}</span>`;

  html += '</div>';

  return html;
}
