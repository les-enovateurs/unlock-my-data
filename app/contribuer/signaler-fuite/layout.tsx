import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Signaler une fuite de données | Contribuer à Unlock My Data",
  description: "Signalez une fuite de données touchant un service, pour qu'elle soit rattachée à sa fiche sur Unlock My Data.",
  paths: { fr: "/contribuer/signaler-fuite", en: "/contribute/report-leak" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
