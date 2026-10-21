import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "en",
  title: "Update a service profile | Contribute to Unlock My Data",
  description: "Update a service profile: data access, GDPR contacts, sanctions, transfers and mobile app.",
  paths: { fr: "/contribuer/modifier-fiche", en: "/contribute/update-form" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
