import { computeInvItems } from "../policyReviewModel";

const META = { CATEGORY_ORDER: [], CATEGORY_META: {} };
const svc = (recipients: any[]) => ({
  data_inventory: {
    transfers: {
      outside_eu: "oui", countries: [], quote: "",
      hosting: [
        { provider: "Amazon Web Services", quote: "hébergé chez AWS, Thales et Google Cloud Platform", quote_verified: true },
        { provider: "Google Cloud Platform", quote: "hébergé chez AWS, Thales et Google Cloud Platform", quote_verified: true },
      ],
    },
    recipients,
  },
});

test("a host listed twice is one card, not two", () => {
  // doctolib: the model returns the same three companies in transfers.hosting
  // and in recipients as kind "hebergement", with the same citation.
  const items = computeInvItems(svc([
    { name: "Google Cloud Platform", kind: "hebergement", quote: "hébergé chez AWS, Thales et Google Cloud Platform" },
  ]), META);
  expect(items.filter((i) => i.label === "Google Cloud Platform")).toHaveLength(1);
  expect(items.find((i) => i.label === "Google Cloud Platform")!.key).toBe("hebergeur/1");
});

test("the same company in another role keeps its own card", () => {
  // Google hosts *and* advertises: two facts, two verdicts.
  const items = computeInvItems(svc([
    { name: "Google", kind: "publicite", quote: "publicités diffusées via Google" },
  ]), META);
  expect(items.some((i) => i.key === "dest/0")).toBe(true);
});

test("a recipient that is not a host is untouched", () => {
  const items = computeInvItems(svc([
    { name: "Stripe", kind: "paiement", quote: "paiements traités par Stripe" },
  ]), META);
  expect(items.some((i) => i.label === "Stripe")).toBe(true);
});
