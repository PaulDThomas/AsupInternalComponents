import { ColouredText } from "../functions/ColouredText";

// Regex from https://stackoverflow.com/questions/12014441/remove-every-white-space-between-tags-using-javascript
// use as .replace(getMultiSpace, "$1$3")
let getMultiSpace = RegExp(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g);


// Only check basic functions in ColouredText
describe('Check basic ColouredText', () => {

  let testThing = new ColouredText("test two");
  test('Returns text', async () => {
    expect(testThing.text).toEqual("test two");
    expect(testThing.textArray).toEqual(["test two"]);
    expect(testThing.htmlString).toEqual('<div class="aie-text"><div class="aie-line"><span class="aie-block">test&nbsp;two</span></div></div>');
  });

  let testThing2 = new ColouredText("test two\r\nline two");
  test('Returns text array', async () => {
    expect(testThing2.text).toEqual("test two\nline two");
    expect(testThing2.textArray).toEqual(["test two", "line two"]);
    expect(testThing2.htmlString).toEqual(`
<div class="aie-text">
  <div class="aie-line">
    <span class="aie-block">test&nbsp;two</span>
  </div>
  <div class="aie-line">
    <span class="aie-block">line&nbsp;two</span>
  </div>
</div>
      `.replace(getMultiSpace, "$1$3"));
  });

});