import type { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";
import HomeRecentActivity from "@/components/home/HomeRecentActivity";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "https://unlock-my-data.com",
      "en-US": "https://unlock-my-data.com/en",
    },
  },
};

export default function Home() {
  return <HomePageContent lang="fr" recent={<HomeRecentActivity lang="fr" />} />;
}
