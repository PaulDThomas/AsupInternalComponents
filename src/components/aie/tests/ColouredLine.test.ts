import { iColourStyles, iStyleBlock } from "../functions/aieInterface";
import { ColouredLine } from "../functions/ColouredLine";

// Regex from https://stackoverflow.com/questions/12014441/remove-every-white-space-between-tags-using-javascript
// use as .replace(getMultiSpace, "$1$3")
let getMultiSpace = RegExp(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g);

describe('Check basic ColouredLine', () => {
  let styles: iColourStyles = {
    red: { color: "red" },
    blue: { color: "blue" },
    green: { color: "green" },

  }

  let tT1 = new ColouredLine("test one", styles);
  test('Returns text', async () => {
    expect(tT1.text).toEqual("test one");
    expect(tT1.htmlString).toEqual('<div class="aie-line"><span class="aie-block">test&nbsp;one</span></div>');
  });

  let styleBlocks: iStyleBlock[] = [
    { start: 1, end: 2, styleName: "red" },
    { start: 2, end: 3, styleName: "green" },
    { start: 3, end: 4, styleName: "blue" },
  ]
  let tT2 = new ColouredLine("test two", styles, styleBlocks)
  test('Returns coloured', async () => {
    expect(tT2.text).toEqual("test two");
    expect(tT2.htmlString).toEqual(`
<div class="aie-line">
  <span class="aie-block">t</span>
  <span class="aie-block" data-style="red" style="color: red;">e</span>
  <span class="aie-block" data-style="green" style="color: green;">s</span>
  <span class="aie-block" data-style="blue" style="color: blue;">t</span>
  <span class="aie-block">&nbsp;two</span>
</div>
    `.replace(getMultiSpace, "$1$3"));
  });

  test('Apply style', async () => {
    tT1.applyStyle("red", 4, 8);
    expect(tT1.htmlString).toEqual(`
<div class="aie-line">
  <span class="aie-block">test</span>
  <span class="aie-block" data-style="red" style="color: red;">&nbsp;one</span>
</div>
    `.replace(getMultiSpace, "$1$3"));
  });
 
  test('Remove style', async () => {
    tT1.removeStyle(6, 7);
    expect(tT1.htmlString).toEqual(`
<div class="aie-line">
  <span class="aie-block">test</span>
  <span class="aie-block" data-style="red" style="color: red;">&nbsp;o</span>
  <span class="aie-block">n</span>
  <span class="aie-block" data-style="red" style="color: red;">e</span>
</div>
    `.replace(getMultiSpace, "$1$3"));
  });

  test('Apply bad style', async () => {
    tT1.applyStyle("pink", 4, 8);
    expect(tT1.htmlString).toEqual(`
<div class="aie-line">
  <span class="aie-block">test&nbsp;one</span>
</div>
    `.replace(getMultiSpace, "$1$3"));
  });


});
