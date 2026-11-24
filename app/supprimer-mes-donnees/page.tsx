import SupprimerMesDonnees from "@/components/SupprimerMesDonnees";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
    lang: "fr",
    title: "Supprimer ses données personnelles : modèles d'e-mail RGPD | Unlock My Data",
    description: "Préparez vos demandes d'effacement RGPD (article 17) pour les services que vous voulez quitter, et envoyez-les depuis votre propre messagerie.",
    paths: { fr: "/supprimer-mes-donnees", en: "/delete-my-data" },
});

export default function Page() {
    return <SupprimerMesDonnees />;
}
