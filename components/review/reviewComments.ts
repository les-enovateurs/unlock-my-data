import { ReviewItem, ReviewReply } from "../../types/form";

export interface FieldCommentEntry {
  comment: ReviewItem;
  reviewIndex: number;
}

interface BuildFieldCommentEntriesParams {
  review: ReviewItem[];
  field: string;
  slug: string;
  replies: Record<string, ReviewReply[]>;
  resolvedComments: Record<string, boolean>;
}

export const buildFieldCommentEntries = ({
  review,
  field,
  slug,
  replies,
  resolvedComments
}: BuildFieldCommentEntriesParams): FieldCommentEntry[] => {
  return review
    .map((comment, reviewIndex) => {
      const key = `${slug}.${reviewIndex}`;
      const mergedReplies = replies[key] ?? comment.replies ?? [];
      const mergedResolved = resolvedComments[key];

      return {
        reviewIndex,
        comment: {
          ...comment,
          replies: mergedReplies,
          resolved: mergedResolved ?? comment.resolved ?? false
        }
      };
    })
    .filter((entry) => entry.comment.field === field);
};
