import { pressReleaseMetadata } from "../metadata";
import { PRESS_RELEASES } from "@/data/pressReleases";

describe("pressReleaseMetadata", () => {
  const release = PRESS_RELEASES[0];

  test("uses the release title and chapo in the requested language", () => {
    const meta = pressReleaseMetadata("en", release.slug);
    expect(meta.title).toBe(`${release.en.title} - Unlock My Data`);
    expect(meta.description).toBe(release.en.chapo);
    expect(meta.openGraph).toMatchObject({
      title: meta.title,
      url: `https://unlock-my-data.com/press/${release.slug}`,
      locale: "en_US",
    });
    expect(meta.alternates?.languages).toEqual({
      "fr-FR": `https://unlock-my-data.com/presse/${release.slug}`,
      "en-US": `https://unlock-my-data.com/press/${release.slug}`,
    });
  });

  test("an unknown slug falls back to the parent metadata", () => {
    expect(pressReleaseMetadata("fr", "does-not-exist")).toEqual({});
  });
});
