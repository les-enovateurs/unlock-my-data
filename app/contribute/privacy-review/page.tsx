import PolicyReviewPage from "@/components/PolicyReviewPage";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "en",
  title: "Review policy analyses | Contribute to Unlock My Data",
  description: "Check privacy policy analyses against their quotes before they are published on Unlock My Data.",
  paths: { fr: "/contribuer/revue-confidentialite", en: "/contribute/privacy-review" },
});

export default function Page() {
  return <PolicyReviewPage lang="en" />;
}
