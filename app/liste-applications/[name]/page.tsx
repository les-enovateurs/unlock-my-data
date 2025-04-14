import servicesData from "@/public/data/services.json";
import {normalizeCompanyName} from "@/components/company/manual";
import Manual from "@/components/company/manual";
import Oldway from "@/components/company/oldway";

type Props = {
  params: {
    name: string;
  };
};


export async function generateStaticParams() {
  try {
    // Générer les paramètres pour chaque entreprise
    return servicesData
      .filter(entreprise => entreprise.name && entreprise.name.trim() !== "")
      .map((entreprise) => ({
        name: normalizeCompanyName(entreprise.name)
        
}));
  } catch (error) {
    console.error("Erreur dans generateStaticParams:", error);
    // En cas d'erreur, retourner au moins un paramètre vide
    return [{ name: "default", isNew: 0 }];
  }
}

export default async function EntreprisePage({ params }: Props) {
  const entreprise = servicesData.find(
    (service) => normalizeCompanyName(service.name) === params.name);

  const isNew = entreprise && entreprise.accessibility == 0 &&
  entreprise.number_breach == 0 &&
  entreprise.number_permission == 0 &&
  entreprise.number_website == 1

  return isNew ? <Manual name={params.name} /> : <Oldway name={params.name} />;
}
