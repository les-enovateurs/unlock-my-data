import { buildFieldCommentEntries } from "../reviewComments";
import { ReviewItem, ReviewReply } from "../../../types/form";

describe("buildFieldCommentEntries", () => {
  test("merges reply and resolved state", () => {
    const review: ReviewItem[] = [
      {
        field: "name",
        message: "Fix the label",
        reviewer_name: "Alice",
        timestamp: "2026-02-25T10:00:00Z",
        resolved: false,
        replies: [
          {
            message: "Original reply",
            author: "moderator",
            timestamp: "2026-02-25T10:10:00Z"
          }
        ]
      },
      {
        field: "privacy_policy_quote",
        message: "Add a source",
        reviewer_name: "Bob",
        timestamp: "2026-02-25T10:20:00Z"
      }
    ];

    const repliesState: Record<string, ReviewReply[]> = {
      "service.1": [
        {
          message: "Here is the source",
          author: "reviewer",
          timestamp: "2026-02-25T10:30:00Z"
        }
      ]
    };

    const resolvedState: Record<string, boolean> = {
      "service.0": true
    };

    const entries = buildFieldCommentEntries({
      review,
      field: "name",
      slug: "service",
      replies: repliesState,
      resolvedComments: resolvedState
    });

    expect(entries).toHaveLength(1);
    expect(entries[0].comment.resolved).toBe(true);
    expect(entries[0].comment.replies).toHaveLength(1);
    expect(entries[0].comment.replies?.[0].message).toBe("Original reply");
  });

  test("keeps review indices for filtered comments", () => {
    const review: ReviewItem[] = [
      {
        field: "name",
        message: "Fix the label",
        reviewer_name: "Alice",
        timestamp: "2026-02-25T10:00:00Z"
      },
      {
        field: "privacy_policy_quote",
        message: "Add a source",
        reviewer_name: "Bob",
        timestamp: "2026-02-25T10:20:00Z"
      }
    ];

    const repliesState: Record<string, ReviewReply[]> = {
      "service.1": [
        {
          message: "Here is the source",
          author: "reviewer",
          timestamp: "2026-02-25T10:30:00Z"
        }
      ]
    };

    const entries = buildFieldCommentEntries({
      review,
      field: "privacy_policy_quote",
      slug: "service",
      replies: repliesState,
      resolvedComments: {}
    });

    expect(entries).toHaveLength(1);
    expect(entries[0].reviewIndex).toBe(1);
    expect(entries[0].comment.replies).toHaveLength(1);
    expect(entries[0].comment.replies?.[0].message).toBe("Here is the source");
  });
});
