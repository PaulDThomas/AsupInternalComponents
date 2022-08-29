import { iStyleBlock } from './aieInterface';

export const explodeLine = (styleBlocks: iStyleBlock[], length: number): iStyleBlock[] => {
  const ret: iStyleBlock[] = [];
  for (let i = 0; i < length; i++) {
    ret.push({
      start: i,
      end: i + 1,
      styleName: styleBlocks.find((b) => b.start <= i && b.end > i)?.styleName,
    });
  }
  return ret;
};
