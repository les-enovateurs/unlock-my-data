import fs from "fs";
import path from "path";
import { FORM_OPTIONS } from "@/constants/formOptions";

const MANUAL_DIR = path.join(process.cwd(), "public/data/manual");

// One value per array item, taken from the country referential: the form's
// multi-select, the map and the fiche all match on exact labels. #424 wrapped
// whole sentences ("Liste non exhaustive : États-Unis, ...") into one item,
// and every consumer then re-split them its own way.
describe("transfer destinations in the published fiches", () => {
  const fiches = fs
    .readdirSync(MANUAL_DIR)
    .filter((file) => file.endsWith(".json") && file !== "slugs.json")
    .map((file) => ({ file, fiche: JSON.parse(fs.readFileSync(path.join(MANUAL_DIR, file), "utf8")) }));

  const frLabels = new Set(FORM_OPTIONS.countries.map((c) => c.label));
  const enLabels = new Set(FORM_OPTIONS.countries.map((c) => c.country_name));

  it("only uses labels from the country referential", () => {
    const unknown = fiches.flatMap(({ file, fiche }) => [
      ...(fiche.transfer_destination_countries ?? []).filter((v: string) => !frLabels.has(v)).map((v: string) => `${file} fr: ${v}`),
      ...(fiche.transfer_destination_countries_en ?? []).filter((v: string) => !enLabels.has(v)).map((v: string) => `${file} en: ${v}`),
    ]);
    expect(unknown).toEqual([]);
  });
});
