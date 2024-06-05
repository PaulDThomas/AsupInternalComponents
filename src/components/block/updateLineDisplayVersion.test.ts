import { AibBlockLine, AibLineType } from "./interface";
import { OldBlockLine, updateLineDisplayVersion } from "./updateLineDisplayVersion";

describe("updateLineDisplayVersion", () => {
  it("should update the line display version correctly", () => {
    const input: OldBlockLine[] = [
      {
        aifid: "1",
        left: "Left 1",
        centre: "Center 1",
        right: "Right 1",
        addBelow: true,
        canEdit: true,
        canRemove: true,
        canMove: true,
      },
      {
        aifid: "2",
        left: "Left 2",
        centre: false,
        right: "Right 2",
        addBelow: false,
        canEdit: true,
        canRemove: true,
        canMove: false,
      },
      {
        aifid: "3",
        left: "Left 3",
        centre: false,
        addBelow: false,
        canEdit: true,
        canRemove: true,
        canMove: false,
      },
      {
        aifid: "4",
      },
    ];

    const expectedOutput: AibBlockLine<string>[] = [
      {
        aifid: "1",
        lineType: AibLineType.leftCenterAndRight,
        left: "Left 1",
        center: "Center 1",
        right: "Right 1",
        addBelow: true,
        canEdit: true,
        canRemove: true,
        canMove: true,
      },
      {
        aifid: "2",
        lineType: AibLineType.leftAndRight,
        left: "Left 2",
        center: null,
        right: "Right 2",
        addBelow: false,
        canEdit: true,
        canRemove: true,
        canMove: false,
      },
      {
        aifid: "3",
        lineType: AibLineType.leftOnly,
        left: "Left 3",
        center: null,
        right: null,
        addBelow: false,
        canEdit: true,
        canRemove: true,
        canMove: false,
      },
      {
        aifid: "4",
        lineType: AibLineType.centerOnly,
        left: null,
        center: "",
        right: null,
        addBelow: undefined,
        canEdit: undefined,
        canRemove: undefined,
        canMove: undefined,
      },
    ];

    const output = updateLineDisplayVersion(input);

    expect(output).toEqual(expectedOutput);
  });

  test("Blank AifBlockLine", () => {
    const inData = [
      {
        aifid: "10",
        left: false,
        center: "Title",
        right: false,
      },
    ];
    const expectedOutput: AibBlockLine<string>[] = [
      {
        aifid: "10",
        lineType: AibLineType.centerOnly,
        left: null,
        center: "Title",
        right: null,
        addBelow: undefined,
        canEdit: undefined,
        canRemove: undefined,
        canMove: undefined,
      },
    ];
    expect(updateLineDisplayVersion(inData as unknown as AibBlockLine<string>[])).toEqual(
      expectedOutput,
    );
  });
});
