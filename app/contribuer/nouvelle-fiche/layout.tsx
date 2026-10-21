import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Créer une fiche | Contribuer à Unlock My Data",
  description: "Ajoutez un service à Unlock My Data : accès aux données, contacts RGPD, sanctions, transferts et application mobile.",
  paths: { fr: "/contribuer/nouvelle-fiche", en: "/contribute/new-form" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
