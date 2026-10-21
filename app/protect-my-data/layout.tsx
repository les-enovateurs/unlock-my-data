import ProtectDataRouteProvider from "@/components/protect-my-data/ProtectDataRouteProvider";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "en",
  title: "Protect my data | Unlock My Data",
  description:
    "Take stock of your apps: a quick check-up of your habits or a detailed analysis of the services you use. Everything stays in your browser.",
  paths: { fr: "/proteger-mes-donnees", en: "/protect-my-data" },
});

export default function ProtectDataLayout({ children }: { children: React.ReactNode }) {
  return <ProtectDataRouteProvider lang="en">{children}</ProtectDataRouteProvider>;
}
