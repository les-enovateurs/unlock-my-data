import fs from "fs";
import path from "path";
import { FORM_OPTIONS } from "@/constants/formOptions";
import { toTransferCode } from "@/lib/map/country-coordinates";

const MANUAL_DIR = path.join(process.cwd(), "public/data/manual");

// One value per array item, taken from the country referential: the form's
// multi-select, the map and the fiche all match on exact values. #424 wrapped
// whole sentences ("Liste non exhaustive : États-Unis, ...") into one item,
// and every consumer then re-split them its own way.
describe("transfer destinations in the published fiches", () => {
  const fiches = fs
    .readdirSync(MANUAL_DIR)
    .filter((file) => file.endsWith(".json") && file !== "slugs.json")
    .map((file) => ({ file, fiche: JSON.parse(fs.readFileSync(path.join(MANUAL_DIR, file), "utf8")) }));

  // Codes are the target format (#367); labels stay valid until every fiche is migrated.
  const codes = new Set(FORM_OPTIONS.transferDestinations.map((c) => c.value));

  it("only uses codes or labels from the country referential", () => {
    const unknown = fiches.flatMap(({ file, fiche }) =>
      (fiche.transfer_destination_countries ?? [])
        .filter((v: string) => !codes.has(toTransferCode(v)))
        .map((v: string) => `${file}: ${v}`),
    );
    expect(unknown).toEqual([]);
  });
});
