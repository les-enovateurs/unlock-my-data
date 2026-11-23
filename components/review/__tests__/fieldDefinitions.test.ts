import { REVIEW_BOOLEAN_FIELDS, REVIEW_MARKDOWN_FIELDS, getReviewFieldDefinition } from "../fieldDefinitions";

describe("review field definitions", () => {
  test("maps markdown fields correctly", () => {
    expect(REVIEW_MARKDOWN_FIELDS.has("sanction_details")).toBe(true);
    expect(getReviewFieldDefinition("sanction_details").type).toBe("markdown");
  });

  test("maps boolean fields correctly", () => {
    expect(REVIEW_BOOLEAN_FIELDS.has("belongs_to_group")).toBe(true);
    expect(getReviewFieldDefinition("belongs_to_group").type).toBe("checkbox");
  });

  test("maps select fields correctly", () => {
    expect(getReviewFieldDefinition("response_format_fr").type).toBe("select");
    expect(getReviewFieldDefinition("transfer_destination_countries").type).toBe("multiselect");
  });

  test("maps app field correctly", () => {
    expect(getReviewFieldDefinition("app").type).toBe("app");
  });
});
