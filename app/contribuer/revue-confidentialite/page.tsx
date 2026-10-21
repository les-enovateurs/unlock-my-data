import PolicyReviewPage from "@/components/PolicyReviewPage";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Relire les analyses de politiques | Contribuer à Unlock My Data",
  description: "Vérifiez, citation à l'appui, les analyses de politiques de confidentialité avant leur publication sur Unlock My Data.",
  paths: { fr: "/contribuer/revue-confidentialite", en: "/contribute/privacy-review" },
});

export default function Page() {
  return <PolicyReviewPage lang="fr" />;
}
