import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy policy | Unlock My Data",
  description:
    "Unlock My Data privacy policy: what data we collect (anonymous usage only), how we use it to improve the service and how to contact us for any privacy questions.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

