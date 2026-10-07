import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FieldWithComments from "@/components/review/FieldWithComments";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>
}));

jest.mock("@/components/tools/t", () => {
  return function Translator() {
    return {
      t: (key: string) => key
    };
  };
});

describe("FieldWithComments", () => {
  it("updates text fields directly", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <FieldWithComments
        field="name"
        fieldLabel="Service name"
        fieldValue=""
        onValueChange={onValueChange}
        onAddReply={jest.fn()}
        onMarkResolved={jest.fn()}
        lang="en"
      />
    );

    const input = screen.getByPlaceholderText("Service name");
    await act(async () => {
      await user.type(input, "New");
    });

    // The component calls onValueChange on each keystroke
    expect(onValueChange).toHaveBeenCalled();
    // Check that at least one call contains the text we typed
    const allCalls = onValueChange.mock.calls.map(call => call[0]);
    expect(allCalls.some((call: string) => call.includes("N"))).toBe(true);
  });

  it("toggles the add comment form", async () => {
    const user = userEvent.setup();

    render(
      <FieldWithComments
        field="name"
        fieldLabel="Service name"
        fieldValue="Old"
        onValueChange={jest.fn()}
        onAddComment={jest.fn()}
        onAddReply={jest.fn()}
        onMarkResolved={jest.fn()}
        lang="en"
      />
    );

    // Initially, the comment textarea should not be visible
    expect(screen.queryByPlaceholderText("commentPlaceholder")).not.toBeInTheDocument();

    // Find the toggle button by title attribute (more specific than name)
    const toggleButton = screen.getByTitle("addComment");
    await act(async () => {
      await user.click(toggleButton);
    });

    // Now the textarea should be visible
    expect(screen.getByPlaceholderText("commentPlaceholder")).toBeInTheDocument();

    // Find all cancel buttons and click the one in the form
    const cancelButtons = screen.getAllByText("cancel");
    // The second cancel button is in the form (the first is the toggle button after clicking)
    await act(async () => {
      await user.click(cancelButtons[cancelButtons.length - 1]);
    });

    // Textarea should be hidden again
    expect(screen.queryByPlaceholderText("commentPlaceholder")).not.toBeInTheDocument();
  });
});
