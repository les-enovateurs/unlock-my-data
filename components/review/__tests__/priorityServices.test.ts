import { PRIORITY_SLUGS, splitQueue } from "../priorityServices";

const row = (slug: string) => ({ slug, service_name: slug } as any);

test("the shortlist is ten services", () => {
  expect(PRIORITY_SLUGS).toHaveLength(10);
  expect(new Set(PRIORITY_SLUGS).size).toBe(10);
});

test("priority rows come out in curated order, not alphabetical", () => {
  // The queue arrives sorted by name — Action, Airbnb, Alibaba — which is
  // exactly the order that buries the services worth starting with.
  const rows = [...PRIORITY_SLUGS].sort().map(row);
  const { priority } = splitQueue(rows);
  expect(priority.map((r) => r.slug)).toEqual([...PRIORITY_SLUGS]);
});

test("every other service stays in the rest, in its original order", () => {
  const rows = [row("action"), row("zalando"), row("badoo")];
  const { priority, rest } = splitQueue(rows);
  expect(priority.map((r) => r.slug)).toEqual(["zalando"]);
  expect(rest.map((r) => r.slug)).toEqual(["action", "badoo"]);
});

test("a shortlisted slug absent from the index is skipped, not faked", () => {
  const { priority, rest } = splitQueue([row("action")]);
  expect(priority).toEqual([]);
  expect(rest.map((r) => r.slug)).toEqual(["action"]);
});

test("nothing is lost or duplicated between the two buckets", () => {
  const rows = [...PRIORITY_SLUGS.map(row), row("action"), row("badoo")];
  const { priority, rest } = splitQueue(rows);
  expect(priority.length + rest.length).toBe(rows.length);
  const seen = [...priority, ...rest].map((r) => r.slug);
  expect(new Set(seen).size).toBe(rows.length);
});
