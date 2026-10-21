import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Modifier une fiche | Contribuer à Unlock My Data",
  description: "Mettez à jour la fiche d'un service : accès aux données, contacts RGPD, sanctions, transferts et application mobile.",
  paths: { fr: "/contribuer/modifier-fiche", en: "/contribute/update-form" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
