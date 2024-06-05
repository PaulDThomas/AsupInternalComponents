import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { TestEditor, replaceTextInTestEditor } from "../../../__dummy__/TestEditor";
import { AibLineDisplay } from "./AibLineDisplay";
import { AibLineType } from "./interface";
import { ContextWindowStack } from "@asup/context-menu";

describe("AibLineDisplay", () => {
  const user = userEvent.setup();
  test("Basic render and update", async () => {
    const id = "line-id";
    const displayType = AibLineType.leftCenterAndRight;
    const left = "Left";
    const center = "Center";
    const right = "Right";
    const canEdit = true;
    const setLine = jest.fn();

    render(
      <AibLineDisplay
        id={id}
        displayType={displayType}
        left={left}
        center={center}
        right={right}
        canEdit={canEdit}
        setLine={setLine}
        Editor={TestEditor}
        replaceTextInT={replaceTextInTestEditor}
        blankT={""}
      />,
    );

    const leftInput = screen.queryByDisplayValue(left) as HTMLInputElement;
    expect(leftInput).toBeInTheDocument();
    const centerInput = screen.queryByDisplayValue(center) as HTMLInputElement;
    expect(centerInput).toBeInTheDocument();
    const rightInput = screen.queryByDisplayValue(right) as HTMLInputElement;
    expect(rightInput).toBeInTheDocument();

    expect(setLine).not.toHaveBeenCalled();
    await act(async () => {
      await user.clear(leftInput);
      await user.type(leftInput, "Left Updated");
      fireEvent.blur(leftInput);
      await user.clear(centerInput);
      await user.type(centerInput, "Center Updated");
      fireEvent.blur(centerInput);
      await user.clear(rightInput);
      await user.type(rightInput, "Right Updated");
      fireEvent.blur(rightInput);
    });
    expect(setLine).toHaveBeenCalledWith({
      left: "Left Updated",
      center: center,
      right: right,
      lineType: displayType,
      canEdit: canEdit,
      canChangeType: false,
    });
  });

  test("Check functions", async () => {
    const id = "line-id";
    const displayType = AibLineType.centerOnly;
    const left = "Left";
    const center = "Center";
    const right = "Right";
    const canEdit = true;
    const setLine = jest.fn();
    const addBelow = true;
    const canRemove = true;
    const canMove = true;
    const addLine = jest.fn();
    const removeLine = jest.fn();

    render(
      <ContextWindowStack>
        <AibLineDisplay
          id={id}
          displayType={displayType}
          left={left}
          center={center}
          right={right}
          canEdit={canEdit}
          setLine={setLine}
          Editor={TestEditor}
          blankT={""}
          replaceTextInT={replaceTextInTestEditor}
          canMove={canMove}
          addBelow={addBelow}
          canRemove={canRemove}
          addLine={addLine}
          removeLine={removeLine}
          externalSingles={[{ oldText: "e", newText: "E" }]}
        />
      </ContextWindowStack>,
    );
    expect(screen.queryByDisplayValue(left)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(center)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(right)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("LEft")).not.toBeInTheDocument();

    const centerInput = screen.queryByDisplayValue("cEntEr") as HTMLInputElement;
    expect(centerInput).not.toBeInTheDocument();

    await act(async () => await user.click(screen.getByLabelText("Add line")));
    expect(addLine).toHaveBeenCalled();
    await act(async () => await user.click(screen.getByLabelText("Remove line")));
    expect(removeLine).toHaveBeenCalled();
    await act(async () => await user.click(screen.getByLabelText("Options")));
    expect(screen.queryByText("Line options")).toBeInTheDocument();
    await act(async () => await user.click(screen.getByLabelText("Close window")));
    expect(screen.queryByText("Line options")).not.toBeInTheDocument();
  });
});
