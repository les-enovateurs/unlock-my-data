import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Alerter sur une faille connue | Contribuer à Unlock My Data",
  description: "Signalez une faille déjà rendue publique sur un service, et ce qu'il faut éviter pour s'en protéger.",
  paths: { fr: "/contribuer/signaler-vulnerabilite", en: "/contribute/report-vulnerability" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
