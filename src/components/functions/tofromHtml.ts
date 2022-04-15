export const toHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/\n/g, "<br/>")
    .replace(/~/g, "<br/>")
    .replace(/ /g, "&nbsp;")
  ;

export const fromHtml = (text: string): string =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/<br\/>/g, "\n")
    .replace(/~/g, "\n")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
  ;