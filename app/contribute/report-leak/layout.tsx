import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "en",
  title: "Report a data breach | Contribute to Unlock My Data",
  description: "Report a data breach affecting a service, so it can be linked to its profile on Unlock My Data.",
  paths: { fr: "/contribuer/signaler-fuite", en: "/contribute/report-leak" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
