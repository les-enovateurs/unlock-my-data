import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Fiches à relire | Contribuer à Unlock My Data",
  description: "Relisez les fiches proposées par la communauté avant leur publication sur Unlock My Data.",
  paths: { fr: "/contribuer/fiches-a-revoir", en: "/contribute/forms-to-review" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
