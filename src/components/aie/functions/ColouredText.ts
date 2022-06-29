import { iColourStyles } from "./aieInterface";
import { ColouredLine } from "./ColouredLine";
import { getHtmlString } from "./getHtmlString";

// Class
export class ColouredText {
  // Variables
  lines: ColouredLine[];

  // Read only variables
  get textArray(): string[] { return this.lines.map(line => line.text.replace(/[\u202F|\u00A0]/g, " ")); }
  get text(): string { return this.textArray.join("\n"); }
  get html(): DocumentFragment {
    let h = new DocumentFragment();
    this.lines.forEach(l => {
      let nl = document.createElement('div');
      nl.className = 'aie-line';
      nl.append(l.html);
      h.appendChild(nl);
    });
    return h;
  }
  get htmlString(): string { return getHtmlString(this.html, "aie-text"); }

  // Overloads
  constructor(arg: ColouredLine[])
  constructor(arg: string[])
  constructor(arg: string)
  constructor(arg: string | string[] | ColouredLine[], styles?: iColourStyles) {
    //this.colouredText = colouredText;
    this.lines = [];
    if (typeof arg === "string") {
      arg
        .replace(/[\u200B-\u200F\uFEFF\r]/g, '') // Remove undesirable non-printing chars
        .replace(/[\u202F| ]/g, "\u00A0")        // All spaces are non-breaking
        .split('\n')                             // Split on line break
        .forEach(t => {                          // Process each line
          let l = new ColouredLine(t, styles);   // Create new Coloured line with the text
          this.lines.push(l);                    // Add into the main array
        });
    }
    else if (Array.isArray(arg)) {
      if ((arg as Array<string | ColouredLine>).every(a => typeof a === "string")) {
        (arg as string[]).forEach(t => {
          let l = new ColouredLine(t
            .replace(/[\u200B-\u200F\uFEFF\r]/g, '') // Remove undesirable non-printing chars
            .replace(/[\u202F| ]/g, "\u00A0")        // All spaces are non-breaking
            , styles);
          this.lines.push(l);
        });
      }
      else {
        this.lines.push(...(arg as ColouredLine[]));
      }
    }
  }
}