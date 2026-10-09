import fs from "fs";
import path from "path";
import { parseTransferCountries } from "@/lib/map/country-coordinates";

const MANUAL_DIR = path.join(process.cwd(), "public/data/manual");

// Runs the parser on the real fiches, not fixtures: #424 turned every value
// into an array while the parser only read strings, and the CI stayed green
// with a blank transfer map on every service page.
describe("transfer destinations in the published fiches", () => {
  const listed = fs
    .readdirSync(MANUAL_DIR)
    .filter((file) => file.endsWith(".json") && file !== "slugs.json")
    .map((file) => JSON.parse(fs.readFileSync(path.join(MANUAL_DIR, file), "utf8")))
    .map((fiche) => fiche.transfer_destination_countries)
    .filter((value) => [value ?? []].flat().join("").trim());

  it("puts most of them on the map", () => {
    const mapped = listed.filter((value) => parseTransferCountries(value).length > 0);
    // ponytail: ratio floor, free-text values ("Non indiqué", "Europe") map to nothing; tighten once #371 settles the content
    expect(mapped.length / listed.length).toBeGreaterThan(0.5);
  });
});
