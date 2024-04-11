import { AitCellData } from "../table/interface";
import { newCell } from "./newCell";
import { replaceCellText } from "./replaceCellText";

describe("Check replace cell text", () => {
  test("Basic test", async () => {
    const cell = newCell<string>(60);
    cell.text = "c1";
    expect(replaceCellText(cell, "c1", "c1-replaced").replacedText).toEqual("c1-replaced");
    expect(replaceCellText(cell, "c2", "c2-replaced").replacedText).toEqual(undefined);
  });

  test("HTML test", async () => {
    const cell: AitCellData<string> = newCell(60);
    const htmlText =
      // eslint-disable-next-line quotes
      '<div classname="aie-text" data-inline-style-ranges="[{&quot;offset&quot;:0,&quot;length&quot;:5,&quot;style&quot;:&quot;Notes&quot;}]"><span classname="Notes" style="color:blue;font-size:16pt">Notes</span>  work</div>';
    cell.text = htmlText;
    expect(replaceCellText(cell, "work", "working").replacedText).toEqual(
      // eslint-disable-next-line quotes
      '<div classname="aie-text" data-inline-style-ranges="[{&quot;offset&quot;:0,&quot;length&quot;:5,&quot;style&quot;:&quot;Notes&quot;}]"><span classname="Notes" style="color:blue;font-size:16pt">Notes</span>  working</div>',
    );
    const notReplaced = replaceCellText(cell, "Notes  work", "Notes  working");
    expect(notReplaced.text).toEqual(htmlText);
    expect(notReplaced.replacedText).toEqual(undefined);
  });
});
