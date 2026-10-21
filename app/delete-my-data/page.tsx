import React from 'react';
import SupprimerMesDonnees from '../../components/SupprimerMesDonnees';
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
    lang: "en",
    title: "Delete my data | Unlock My Data",
    description: "Prepare GDPR erasure requests (article 17) for the services you want to leave, and send them from your own mailbox.",
    paths: { fr: "/supprimer-mes-donnees", en: "/delete-my-data" },
});

export default function Page() {
  return <SupprimerMesDonnees locale="en" />;
}
