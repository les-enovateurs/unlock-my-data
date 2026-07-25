import type { Reviewer } from "./reviewTypes";

export function creditContributor(
  reviewers: Reviewer[],
  name: string,
  date: string,
  action: string = "reviewed"
): Reviewer[] {
  const clean = (name || "").trim();
  if (!clean) return reviewers;
  const exists = reviewers.some(
    (r) => r.name === clean && r.action === action && r.date === date
  );
  if (exists) return reviewers;
  return [...reviewers, { name: clean, date, action }];
}
