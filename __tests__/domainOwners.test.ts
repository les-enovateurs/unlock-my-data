import OWNERS, { domainOwner, ownerReserve, rootDomain } from "../data/domainOwners";

describe("rootDomain", () => {
  it("reduces a host to its registrable domain", () => {
    expect(rootDomain("pagead2.googlesyndication.com")).toBe("googlesyndication.com");
    expect(rootDomain("googlesyndication.com")).toBe("googlesyndication.com");
  });

  it("keeps the composed suffixes whole", () => {
    expect(rootDomain("www.bbc.co.uk")).toBe("bbc.co.uk");
    expect(rootDomain("www.blablacar.co.th")).toBe("blablacar.co.th");
  });

  it("does not file Adjust's Indian endpoint under the suffix itself", () => {
    // `.net.in` is an Indian second level. Without it, the eleven `*.adjust.net.in`
    // addresses of six fiches grouped under `net.in` -- a suffix, not a company, and a
    // key no editorial table can ever carry.
    expect(rootDomain("gdpr.adjust.net.in")).toBe("adjust.net.in");
    expect(rootDomain("adjust.net.in")).toBe("adjust.net.in");
  });

  it("leaves a real two-label domain on a short TLD alone", () => {
    expect(rootDomain("p.applov.in")).toBe("applov.in");
    expect(rootDomain("mediation.goog")).toBe("mediation.goog");
  });
});

describe("domainOwner", () => {
  it("names the company, its country and its use", () => {
    expect(domainOwner("adyen.com", "fr")).toEqual({
      name: "Adyen",
      country: "Pays-Bas",
      usage: "Paiement",
      note: undefined,
    });
    expect(domainOwner("adyen.com", "en")).toMatchObject({ country: "Netherlands", usage: "Payments" });
  });

  it("returns null rather than a guess", () => {
    // Four fiches carry `spadsync.com` and nobody here knows whose it is. The card
    // shows the domain alone; that is the intended outcome, not a gap to fill.
    expect(domainOwner("spadsync.com", "fr")).toBeNull();
    expect(domainOwner("aritypmp.com", "fr")).toBeNull();
  });

  it("carries the fact that makes the country readable", () => {
    // Berlin is Adjust's seat and it is inside the EU; its owner is not.
    expect(domainOwner("adjust.com", "fr")).toMatchObject({
      country: "Allemagne",
      note: expect.stringContaining("AppLovin"),
    });
    expect(domainOwner("asnapieu.com", "fr")).toMatchObject({
      name: "Airship",
      country: "États-Unis",
      note: expect.stringContaining("européenne"),
    });
  });

  it("does not name the mailbox providers", () => {
    // These come from the e-mail validation lists baked into the binaries. Writing
    // "Google" next to `gmail.com` would read as a recipient.
    for (const d of ["gmail.com", "hotmail.fr", "yahoo.es", "orange.fr", "outlook.com"]) {
      expect(domainOwner(d, "fr")).toBeNull();
    }
  });

  it("does not name the first-party domains of the fiches themselves", () => {
    // `roocdn.com` is Deliveroo's own CDN. The block is titled "third-party
    // companies"; naming it would endorse its presence in that list.
    for (const d of ["roocdn.com", "owhealth.com", "grindr.com", "blablacar.com"]) {
      expect(domainOwner(d, "fr")).toBeNull();
    }
  });
});

describe("ownerReserve", () => {
  it("warns about hosts serving someone else's content", () => {
    expect(ownerReserve(["adyen.com", "cloudfront.net"], "fr")).toContain("hébergeur");
    expect(ownerReserve(["adyen.com", "gstatic.com"], "en")).toContain("host");
  });

  it("stays silent when no host is on screen", () => {
    expect(ownerReserve(["adyen.com", "adjust.com"], "fr")).toBeNull();
    expect(ownerReserve([], "fr")).toBeNull();
  });
});

describe("the table as a whole", () => {
  it("is keyed by root domains only", () => {
    // A key that is not its own root domain is unreachable: the block looks entries up
    // with `rootDomain(host)`, never with the host.
    const wrong = Object.keys(OWNERS).filter((d) => rootDomain(d) !== d);
    expect(wrong).toEqual([]);
  });
});
