import ProtectDataRouteProvider from "@/components/protect-my-data/ProtectDataRouteProvider";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "fr",
  title: "Protéger mes données | Unlock My Data",
  description:
    "Faites le point sur vos applications : diagnostic express de vos habitudes ou analyse détaillée des services que vous utilisez. Tout reste dans votre navigateur.",
  paths: { fr: "/proteger-mes-donnees", en: "/protect-my-data" },
});

export default function ProtectDataLayout({ children }: { children: React.ReactNode }) {
  return <ProtectDataRouteProvider lang="fr">{children}</ProtectDataRouteProvider>;
}
