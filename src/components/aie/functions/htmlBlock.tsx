import { DraftStyleMap, RawDraftContentBlock } from 'draft-js';
import { toHtml } from '../../functions';

/**
 * Safely change a draft block into HTML
 * @param b Raw Draft-js block
 * @param dsm Style map that has been applied
 * @returns HTML string of the content
 */
export const htmlBlock = (b: RawDraftContentBlock, dsm: DraftStyleMap): string => {
  // Explode string
  let chars = b.text.split('');
  // Swap out HTML characters for safety
  chars = chars.map((c) => toHtml(c));
  // Add inline style starts and ends
  for (const s of b.inlineStyleRanges) {
    chars[s.offset] = `<span classname="${s.style}" style="${Object.entries(dsm[s.style] ?? {})
      .map(([k, v]) => `${k.replace(/[A-Z]/g, '-$&').toLowerCase()}:${v}`)
      .join(';')}">${chars[s.offset]}`;
    chars[s.offset + s.length - 1] = `${chars[s.offset + s.length - 1]}</span>`;
  }

  const ret = document.createElement('div');
  ret.setAttribute('classname', 'aie-text');
  ret.dataset.key = b.key;
  ret.dataset.type = b.type;
  ret.dataset.inlineStyleRanges = JSON.stringify(b.inlineStyleRanges);
  ret.innerHTML = chars.join('');
  return ret.outerHTML;
};
