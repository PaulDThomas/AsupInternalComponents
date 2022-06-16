import { iColouredLine, iColourStyles, iStyleBlock } from "./aieInterface";
import { ColouredLine } from "./ColouredLine";
import { ColouredText } from "./ColouredText";
import { drawInnerHtml } from "./drawInnerHtml";
import { explodeLine } from "./explodeLine";
import { getCaretPosition } from "./getCaretPosition";
import { getHtmlString } from "./getHtmlString";
import { implodeLine } from "./implodeLine";

export type { iColourStyles, iStyleBlock, iColouredLine };
export { ColouredLine, ColouredText, explodeLine, implodeLine, getHtmlString };

export { drawInnerHtml, getCaretPosition }