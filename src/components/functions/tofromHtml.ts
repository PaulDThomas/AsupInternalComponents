export const toHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\n/g, '<br/>')
    .replace(/\u00A0/g, '&nbsp;');

export const fromHtml = (text: string): string =>
  text
    .replace(/&nbsp;/g, '\u00A0')
    .replace(/<br\/>/g, '\n')
    // eslint-disable-next-line quotes
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
