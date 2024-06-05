import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { TestEditor } from "../../../__dummy__/TestEditor";
import { AibOptionsWindow } from "./AibOptionsWindow";
import { AibLineType } from "./interface";

describe("AibOptionsWindow tests", () => {
  const user = userEvent.setup();

  test("Basic render and update", async () => {
    const id = "line-id";
    const onClose = jest.fn();
    const displayType = AibLineType.centerOnly;
    const left = "Left";
    const center = "Center";
    const right = "Right";
    const canChangeType = true;
    const returnData = jest.fn();
    const canEdit = true;

    render(
      <AibOptionsWindow
        id={id}
        onClose={onClose}
        displayType={displayType}
        left={left}
        center={center}
        right={right}
        returnData={returnData}
        canChangeType={canChangeType}
        canEdit={canEdit}
        Editor={TestEditor}
      />,
    );

    const displaySelect = screen.queryByLabelText(/Line type/) as HTMLSelectElement;
    expect(displaySelect).toBeInTheDocument();
    const leftInput = screen.queryByDisplayValue(left) as HTMLInputElement;
    expect(leftInput).toBeInTheDocument();
    const centerInput = screen.queryByDisplayValue(center) as HTMLInputElement;
    expect(centerInput).toBeInTheDocument();
    const rightInput = screen.queryByDisplayValue(right) as HTMLInputElement;
    expect(rightInput).toBeInTheDocument();

    expect(returnData).not.toHaveBeenCalled();

    await act(async () => {
      await user.selectOptions(displaySelect, "Left only");
    });
    expect(returnData).toHaveBeenLastCalledWith({
      displayType: AibLineType.leftOnly,
    });
    await act(async () => {
      await user.clear(leftInput);
      await user.type(leftInput, "Left Updated");
      fireEvent.blur(leftInput);
    });
    expect(returnData).toHaveBeenLastCalledWith({
      left: "Left Updated",
    });
    await act(async () => {
      await user.clear(centerInput);
      await user.type(centerInput, "Center Updated");
      fireEvent.blur(centerInput);
    });
    expect(returnData).toHaveBeenLastCalledWith({
      center: "Center Updated",
    });
    await act(async () => {
      await user.clear(rightInput);
      await user.type(rightInput, "Right Updated");
      fireEvent.blur(rightInput);
    });
    expect(returnData).toHaveBeenLastCalledWith({
      right: "Right Updated",
    });
  });
});
