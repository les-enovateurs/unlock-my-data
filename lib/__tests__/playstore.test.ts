import { appFormValue, hasExodusReport, playstoreIdFromLink, withPlaystore } from "../playstore";

describe("playstoreIdFromLink", () => {
  test("reads the id of a product link, with or without extra params", () => {
    expect(playstoreIdFromLink("https://play.google.com/store/apps/details?id=com.qwant.liberty&hl=fr")).toBe("com.qwant.liberty");
    expect(playstoreIdFromLink(" com.qwant.liberty ")).toBe("com.qwant.liberty");
  });

  test("refuses developer pages, searches and the App Store", () => {
    expect(playstoreIdFromLink("https://play.google.com/store/apps/developer?id=La+Poste")).toBeUndefined();
    expect(playstoreIdFromLink("https://play.google.com/store/search?q=gemini")).toBeUndefined();
    expect(playstoreIdFromLink("https://apps.apple.com/fr/app/le-chat/id6740410176")).toBeUndefined();
    expect(playstoreIdFromLink("https://play.google.com/store/apps/details?hl=fr")).toBeUndefined();
  });
});

describe("withPlaystore", () => {
  const legacy = {
    name: "Qwant",
    app: { name: "Qwant", link: "https://play.google.com/store/apps/details?id=com.qwant.liberty" },
    exodus: "/data/compare/qwant.json",
  };

  test("moves app + exodus into playstore", () => {
    const fiche = withPlaystore(legacy, legacy.app);
    expect(fiche).toEqual({ name: "Qwant", playstore: { id: "com.qwant.liberty", name: "Qwant", exodus: true } });
    expect(hasExodusReport(fiche)).toBe(true);
    expect(appFormValue(fiche).link).toBe("https://play.google.com/store/apps/details?id=com.qwant.liberty");
  });

  test("keeps name_en and the exodus flag of an already migrated fiche", () => {
    const fiche = { name: "Qwant", playstore: { id: "com.qwant.liberty", name: "Qwant", name_en: "Qwant EN", exodus: true } };
    expect(withPlaystore(fiche, { name: "Qwant – Moteur", link: "com.qwant.liberty" }).playstore).toEqual({
      id: "com.qwant.liberty", name: "Qwant – Moteur", name_en: "Qwant EN", exodus: true,
    });
  });

  test("leaves a non-product link in app rather than losing it", () => {
    const app = { name: "La Poste", link: "https://play.google.com/store/apps/developer?id=La+Poste" };
    expect(withPlaystore({ name: "La Poste", app, exodus: "/data/compare/la-poste.json" }, app)).toEqual({
      name: "La Poste", app, exodus: "/data/compare/la-poste.json",
    });
  });
});
