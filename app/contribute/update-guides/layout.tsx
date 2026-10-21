import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "en",
  title: "Update guides | Contribute to Unlock My Data",
  description: "Write or update a service's guides: migrating to an alternative, data volume, cleaning up the account.",
  paths: { fr: "/contribuer/modifier-guides", en: "/contribute/update-guides" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
