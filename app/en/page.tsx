"use client";
import HomePageContent from "@/components/HomePageContent";
import HomeRecentActivity from "@/components/home/HomeRecentActivity";

export default function HomeEn() {
  return <HomePageContent lang="en" recent={<HomeRecentActivity lang="en" />} />;
}