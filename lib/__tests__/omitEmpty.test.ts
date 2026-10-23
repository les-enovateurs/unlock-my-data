import { omitEmpty } from "../omitEmpty";

describe("omitEmpty", () => {
  test("drops null, empty strings, arrays and objects, nested ones included", () => {
    expect(
      omitEmpty({
        name: "Kiabi",
        group_name: "",
        easy_access_data: null,
        review: [],
        app: { name: "", link: "" },
        leaks: [{ title: "x", details: "" }],
        exodus: { trackers: [] },
      }),
    ).toEqual({ name: "Kiabi", leaks: [{ title: "x" }] });
  });

  test("trims strings and drops whitespace-only ones", () => {
    expect(
      omitEmpty({ name: "Doctolib ", group_name: "  ", leaks: [{ type: " Emails\n" }] }),
    ).toEqual({ name: "Doctolib", leaks: [{ type: "Emails" }] });
  });

  test("keeps false, 0 and non-empty values", () => {
    const fiche = { need_id_card: false, easy_access_data: 0, tags: ["a"] };
    expect(omitEmpty(fiche)).toEqual(fiche);
  });
});
