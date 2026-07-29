import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FieldComment from "@/components/review/FieldComment";
import { ReviewItem } from "@/types/form";

jest.mock("@/components/tools/t", () => {
  return function Translator() {
    return {
      t: (key: string) => key
    };
  };
});

const comment = (overrides: Partial<ReviewItem> = {}): ReviewItem => ({
  field: "contact_mail_delete",
  message: "Is this address only used to withdraw consent?",
  reviewer_name: "gildas",
  timestamp: "2026-07-28T12:54:54.440Z",
  resolved: false,
  replies: [],
  ...overrides
});

describe("FieldComment resolve gate", () => {
  const originalFlag = process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION;

  afterEach(() => {
    process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION = originalFlag;
  });

  const renderComment = (item: ReviewItem, onMarkResolved = jest.fn()) => {
    render(
      <FieldComment
        comment={item}
        index={0}
        reviewerName="Bob"
        onAddReply={jest.fn()}
        onMarkResolved={onMarkResolved}
        lang="en"
      />
    );
    return onMarkResolved;
  };

  // Regression: closing a question used to be a bare toggle, so a reviewer
  // could bury a volunteer's question without writing a word.
  it("asks for an explanation before closing an unanswered comment", async () => {
    const user = userEvent.setup();
    const onMarkResolved = renderComment(comment());

    await user.click(screen.getByLabelText("markResolved"));

    expect(onMarkResolved).not.toHaveBeenCalled();
    expect(screen.getByText("resolutionNoteLabel")).toBeInTheDocument();
  });

  it("passes the explanation along once it is long enough", async () => {
    const user = userEvent.setup();
    const onMarkResolved = renderComment(comment());

    await user.click(screen.getByLabelText("markResolved"));
    await user.type(
      screen.getByPlaceholderText("resolutionNotePlaceholder"),
      "Confirmed by the service"
    );
    await user.click(screen.getByText("confirmResolve"));

    expect(onMarkResolved).toHaveBeenCalledWith(true, "Confirmed by the service");
  });

  it("keeps the confirm button disabled for a too-short explanation", async () => {
    const user = userEvent.setup();
    const onMarkResolved = renderComment(comment());

    await user.click(screen.getByLabelText("markResolved"));
    await user.type(screen.getByPlaceholderText("resolutionNotePlaceholder"), "ok");

    expect(screen.getByText("confirmResolve")).toBeDisabled();
    expect(onMarkResolved).not.toHaveBeenCalled();
  });

  it("closes straight away when the thread already holds a reply", async () => {
    const user = userEvent.setup();
    const answered = comment({
      replies: [{ message: "Answered", author: "dominique", timestamp: "2026-07-29T09:00:00.000Z" }]
    });
    const onMarkResolved = renderComment(answered);

    await user.click(screen.getByLabelText("markResolved"));

    expect(onMarkResolved).toHaveBeenCalledWith(true);
    expect(screen.queryByText("resolutionNoteLabel")).not.toBeInTheDocument();
  });

  it("skips the gate when the flag is disabled", async () => {
    process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION = "false";
    const user = userEvent.setup();
    const onMarkResolved = renderComment(comment());

    await user.click(screen.getByLabelText("markResolved"));

    expect(onMarkResolved).toHaveBeenCalledWith(true);
  });

  it("shows why a comment was closed once the resolved thread is expanded", async () => {
    const user = userEvent.setup();
    renderComment(
      comment({
        resolved: true,
        resolved_by: "dominique",
        resolved_note: "Confirmed by the service",
        resolved_at: "2026-07-29T09:00:00.000Z"
      })
    );

    // Resolved comments start collapsed.
    await user.click(screen.getByText("viewReplies"));

    expect(screen.getByText(/Confirmed by the service/)).toBeInTheDocument();
    expect(screen.getByText(/dominique/)).toBeInTheDocument();
  });

  it("offers no resolve control in read-only history mode", () => {
    renderComment(comment(), jest.fn());
    expect(screen.getByLabelText("markResolved")).toBeInTheDocument();

    render(
      <FieldComment
        comment={comment()}
        index={0}
        reviewerName="Bob"
        onAddReply={jest.fn()}
        onMarkResolved={jest.fn()}
        lang="en"
        readOnly
      />
    );

    // Only the first (editable) instance exposes the control.
    expect(screen.getAllByLabelText("markResolved")).toHaveLength(1);
  });
});
