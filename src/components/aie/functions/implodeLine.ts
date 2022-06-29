import { iStyleBlock } from "./aieInterface";

// Ensure all full block coverage and no overlaps
export const implodeLine = (styleBlocks: iStyleBlock[]): iStyleBlock[] => {
  // Copy input
  let ret: iStyleBlock[] = [];
  let cStart: number, cEnd: number, cStyleName: string|undefined;

  styleBlocks.sort((a, b) => a.start - b.start)
    .forEach((b, i, all) => {
      // Start off
      if (i === 0) {
        cStart = b.start;
        cEnd = b.end;
        cStyleName = b.styleName;
      }
      // Add on
      if (b.styleName === cStyleName && b.start <= cEnd) {
        cEnd = b.end;
      }
      // Or output and restart
      else {
        ret.push({
          start: cStart,
          end: cEnd,
          styleName: cStyleName,
        });
        cStart = b.start;
        cEnd = b.end;
        cStyleName = b.styleName;
      }
      // Always output at the end
      if (i === all.length -1) {
        ret.push({
          start: cStart,
          end: cEnd,
          styleName: cStyleName,
        });
      }
    })

  return ret;
}
