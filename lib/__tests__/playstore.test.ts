import { appFormValue, hasExodusReport, isValidAppLink, playstoreIdFromLink, withPlaystore } from "../playstore";

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
    expect(isValidAppLink("https://play.google.com/store/search?q=gemini")).toBe(false);
    expect(isValidAppLink("")).toBe(true);
  });
});

describe("withPlaystore", () => {
  const fiche = { name: "Qwant", playstore: { id: "com.qwant.liberty", name: "Qwant", name_en: "Qwant EN", exodus: true } };

  test("keeps name_en and the report of the same package", () => {
    const saved = withPlaystore(fiche, { name: "Qwant – Moteur", link: appFormValue(fiche).link });
    expect(saved.playstore).toEqual({ id: "com.qwant.liberty", name: "Qwant – Moteur", name_en: "Qwant EN", exodus: true });
    expect(hasExodusReport(saved)).toBe(true);
  });

  test("drops the report when the package changes, so the updater rescans", () => {
    const saved = withPlaystore(fiche, { name: "Qwant", link: "com.qwant.other" });
    expect(hasExodusReport(saved)).toBe(false);
  });

  test("removes the app when the link is cleared, and the edit-only `app` key", () => {
    expect(withPlaystore({ ...fiche, app: { name: "x", link: "" } }, { name: "x", link: "" })).toEqual({ name: "Qwant" });
  });
});
