export const toHtml = <T extends string | object>(text: T): T =>
  typeof text === "string"
    ? (text
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/≥/g, "&ge;")
        .replace(/≤/g, "&le;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/\n/g, "<br/>")
        .replace(/\u00A0/g, "&nbsp;") as T)
    : text;

export const fromHtml = <T extends string | object>(text: T): T =>
  typeof text === "string"
    ? (text
        .replace(/&nbsp;/g, "\u00A0")
        .replace(/<br\/>/g, "\n")
        .replace(/&apos;/g, "'")
        // eslint-disable-next-line quotes
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&le;/g, "≤")
        .replace(/&ge;/g, "≥")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&") as T)
    : text;
