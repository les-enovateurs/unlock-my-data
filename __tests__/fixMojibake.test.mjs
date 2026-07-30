import { demojibake, demojibakeTree } from "../scripts/fix-mojibake.mjs";

const mojibake = (s) => Buffer.from(s, "utf8").toString("latin1");

describe("demojibake", () => {
  it("repairs the aliexpress contact quote", () => {
    const src = "Telles que votre adresse ; le numéro de téléphone ; fax et adresse e-mail.";
    expect(demojibake(mojibake(src))).toBe(src);
  });
  it("repairs C1-invisible curly apostrophes", () => {
    const src = "l’accès à la Plateforme";
    expect(demojibake(mojibake(src))).toBe(src);
  });
  it("leaves already-correct French untouched", () => {
    const src = "Le numéro de téléphone à Singapour — l’adresse e-mail.";
    expect(demojibake(src)).toBe(src);
  });
  it("is idempotent", () => {
    const once = demojibake(mojibake("données à caractère personnel"));
    expect(demojibake(once)).toBe(once);
  });
  it("leaves ASCII and non-latin1 strings alone", () => {
    expect(demojibake("plain ascii")).toBe("plain ascii");
    expect(demojibake("Ã© mixed with 日本語")).toBe("Ã© mixed with 日本語");
  });
  it("refuses strings whose latin-1 bytes are not valid UTF-8", () => {
    expect(demojibake("Ã Ã Ã")).toBe("Ã Ã Ã");
  });
  it("leaves all-caps French alone (real twitch.json clause)", () => {
    const src = "SI VOUS AVEZ MOINS DE 13 ANS, OU L’ÂGE MINIMUM REQUIS DANS VOTRE RÉGION";
    expect(demojibake(src)).toBe(src);
  });
});

describe("demojibakeTree", () => {
  it("rewrites nested strings and counts them", () => {
    const tree = {
      slug: "aliexpress",
      data_inventory: {
        categories: { contact: { quote: mojibake("numéro de téléphone"), status: "oui", quote_verified: false } },
        legal_bases: [{ quote: mojibake("données à caractère personnel") }],
      },
    };
    expect(demojibakeTree(tree)).toBe(2);
    expect(tree.data_inventory.categories.contact.quote).toBe("numéro de téléphone");
    expect(tree.data_inventory.legal_bases[0].quote).toBe("données à caractère personnel");
    expect(tree.data_inventory.categories.contact.quote_verified).toBe(false);
  });
  it("counts nothing on clean data", () => {
    expect(demojibakeTree({ a: "propre", b: ["déjà bon"], c: { d: null, e: 3 } })).toBe(0);
  });
});
