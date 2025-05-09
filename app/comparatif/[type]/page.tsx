import ComparatifComponent from "@/components/ComparatifComponent";
// import socialNetworks from "@/app/config/socialNetworks";
// import { fetchData } from "@/app/config/fetchData";
import { ListeTypeApp } from "@/app/configComparatif/listeTypeApp";

interface Permission {
  name: string;
  description: string;
  label: string;
  protection_level: string;
}

interface AppPermissions {
  handle: string;
  app_name: string;
  permissions: string[];
  trackers: number[];
}

interface PermissionsState {
  [key: string]: AppPermissions;
}

interface Tracker {
  id: number;
  name: string;
  country: string;
}

// Interfaces pour les cas et services
interface Case {
  id: string;
  url: string;
  title: string;
}

interface ServicePoint {
  title: string;
  case: {
    title: string;
    localized_title: string;
    classification: "bad" | "neutral" | "good" | "blocker";
  };
  status: string;
}

interface ServiceData {
  id: number;
  name: string;
  rating: string;
  logo: string;
  points: ServicePoint[];
}

interface ServicesState {
  [key: string]: ServiceData;
}


interface PageProps {
  params: {
    type: string;
  };
}

export async function generateStaticParams() {
  return [
    { type: "applications" }, // Route requise
    ...Object.values(ListeTypeApp).map((type) => ({
      type: type.url, // Convertir en minuscules
    })),
  ];
}

export default async function Page({ params }: PageProps) {
  const {type} = await params;
  const typeInfo = Object.entries(ListeTypeApp).find(
    ([_, value]) => value.url === type
  )?.[1];


  // Si trouvé, on a accès à name et file
  const name = typeInfo?.name ;
  const file = typeInfo?.file;
  if (!name || !file) {
    return <div>Erreur : Type d'application non trouvé</div>;
  }

  return <ComparatifComponent name={name} file={file} />;
}
