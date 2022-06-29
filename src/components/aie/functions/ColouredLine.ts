import { iColouredLine, iColourStyles, iStyleBlock } from "./aieInterface";
import { explodeLine } from "./explodeLine";
import { getHtmlString } from "./getHtmlString";
import { implodeLine } from "./implodeLine";

export class ColouredLine {
  // Variables
  text: string;
  styles: iColourStyles;
  styleBlocks: iStyleBlock[];

  // Read only variables
  get html(): DocumentFragment {
    let h = document.createDocumentFragment();
    implodeLine(this.styleBlocks
      .map(b => { // Remove bad styleNames here
        if (!b.styleName || Object.keys(this.styles).findIndex(s => s === b.styleName) === -1) {
          return { start:b.start, end:b.end };
        }
        else return b;
      }))
      .forEach(b => {
        let s = document.createElement('span');
        s.className = 'aie-block';
        s.textContent = this.text.replace(/[\u202F| ]/g, "\u00A0").substring(b.start, b.end);
        if (b.styleName && Object.keys(this.styles).findIndex(s => s === b.styleName) >= 0) {
          s.dataset.style = b.styleName;
          s.style.cssText = Object.entries(this.styles[b.styleName])
            .map(([k, v]) => `${k.replace(/[A-Z]/g, " - $ & ").toLowerCase()}:${v}`)
            .join(';');
        }
        h.appendChild(s);
      });
    return h;
  }
  get htmlString(): string { return getHtmlString(this.html, "aie-line"); }

  // Constructor
  constructor(arg: iColouredLine);
  constructor(arg: string, styles?: iColourStyles);
  constructor(arg: string, styles?: iColourStyles, styleBlocks?: iStyleBlock[]);
  constructor(arg: string | iColouredLine, styles?: iColourStyles, styleBlocks?: iStyleBlock[]) {
    if (typeof arg === "string") {
      this.text = arg;
      this.styles = styles ?? {};
      this.styleBlocks = explodeLine(styleBlocks ?? [], arg.length);
    }
    else {
      this.text = arg.text;
      this.styles = arg.styles ?? styles ?? {};
      this.styleBlocks = explodeLine(arg.styleBlocks ?? styleBlocks ?? [], arg.text.length);
    }
  }

  applyStyle(styleName: string, start: number, end: number) {
    this.styleBlocks = explodeLine([
      { styleName, start, end },
      ...this.styleBlocks // Add existing styleBlocks
        .filter(b => b.start < start || b.end > end) // Remove any covered styleBlcoks
    ], this.text.length);
  }

  removeStyle(start: number, end: number) {
    this.styleBlocks = explodeLine([
      { start, end },
      ...this.styleBlocks // Add existing styleBlocks
        .filter(b => b.start < start || b.end > end) // Remove any covered styleBlcoks
    ], this.text.length);
  }
}
