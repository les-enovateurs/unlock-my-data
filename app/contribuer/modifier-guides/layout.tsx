import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Modifier les guides | Contribuer à Unlock My Data",
  description: "Rédigez ou mettez à jour les guides d'un service : migration vers une alternative, poids des données, nettoyage du compte.",
  paths: { fr: "/contribuer/modifier-guides", en: "/contribute/update-guides" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
