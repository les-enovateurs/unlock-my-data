import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
  lang: "en",
  title: "Forms to review | Contribute to Unlock My Data",
  description: "Review the service profiles submitted by the community before they are published on Unlock My Data.",
  paths: { fr: "/contribuer/fiches-a-revoir", en: "/contribute/forms-to-review" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
