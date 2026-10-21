import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "en",
  title: "Create a service profile | Contribute to Unlock My Data",
  description: "Add a service to Unlock My Data: data access, GDPR contacts, sanctions, transfers and mobile app.",
  paths: { fr: "/contribuer/nouvelle-fiche", en: "/contribute/new-form" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
