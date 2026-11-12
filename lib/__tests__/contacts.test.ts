import { contactComment, contactsFor, firstEmail, ServiceContact } from "../contacts";

const postal: ServiceContact = {
  type: "postal",
  value: "DPO Chronopost 3 Boulevard Romain Rolland 75014 PARIS",
  purposes: ["delete"],
};
const dpo: ServiceContact = {
  type: "email",
  value: "dpo@x.com",
  purposes: ["export", "delete"],
  comment_fr: "pour Parcoursup",
  comment_en: "for Parcoursup",
};

describe("contacts", () => {
  it("filters contacts by purpose, keeping their order", () => {
    const service = { contacts: [postal, dpo] };
    expect(contactsFor(service, "delete")).toEqual([postal, dpo]);
    expect(contactsFor(service, "export")).toEqual([dpo]);
  });

  it("returns the first email for a purpose, skipping postal contacts", () => {
    expect(firstEmail({ contacts: [postal, dpo] }, "delete")).toBe("dpo@x.com");
    expect(firstEmail({ contacts: [postal] }, "delete")).toBeUndefined();
  });

  it("tolerates a service without contacts", () => {
    expect(contactsFor({}, "export")).toEqual([]);
    expect(firstEmail(undefined, "export")).toBeUndefined();
  });

  it("picks the comment in the reader's language", () => {
    expect(contactComment(dpo, "en")).toBe("for Parcoursup");
    expect(contactComment(dpo, "fr")).toBe("pour Parcoursup");
  });
});
