
export function getHTMLfromV2Text(text: string, styleName: string): string {
  if (styleName === "")
    return text;
  let isr = {
    length: text.length,
    offset: 0,
    style: styleName
  };
  return `<div classname="aie-text" data-inline-style-ranges='${JSON.stringify([isr])}'><span classname="${styleName}">${text}</span></div>`;
  //c
}
