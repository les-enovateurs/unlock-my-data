import fs from "fs";
import path from "path";
import Image from "next/image";
import { Metadata } from 'next';

// Ajout des métadonnées statiques
export const metadata: Metadata = {
  title: 'Détails Entreprise',
  description: 'Informations détaillées sur l\'entreprise',
};

const entreprise_data = "maj_data/entreprise/entreprise.json"

export async function generateStaticParams() {
  try {
    // Lire le fichier JSON
    const filePath = path.join(
      process.cwd(),
      entreprise_data
    );
    const jsonData = fs.readFileSync(filePath, "utf8");
    const entreprises: EntrepriseData[] = JSON.parse(jsonData);

    // Debug: afficher les routes générées
    const params = entreprises.map((entreprise) => ({
      name: normalizeCompanyName(entreprise.Nom),
    }));
    console.log("Routes générées:", params);

    return params;
  } catch (error) {
    console.error("Erreur dans generateStaticParams:", error);
    // En cas d'erreur, retourner au moins un paramètre vide pour éviter l'erreur de build
    return [{ name: "default" }];
  }
}

const EXCLUDED_FIELDS = [
  "Nom",
  "Logo (lien)",
  "Permissions (autorisations)",
  "Export de la demande de droit"
];

type EntrepriseData = {
  Nom: string;
  "Logo (lien)": string;
  [key: string]: string; // pour les autres propriétés dynamiques
};

type Props = {
  params: {
    name: string;
  };
};

function normalizeCompanyName(name: string): string {
  // Normalisation plus stricte
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Enlève tous les caractères spéciaux
    .replace(/\s+/g, "");
}

async function getEntrepriseData(name: string): Promise<EntrepriseData | null> {
  try {
    // Lire le fichier JSON
    const filePath = path.join(
      process.cwd(),
      entreprise_data
    );
    const jsonData = fs.readFileSync(filePath, "utf8");
    const entreprises: EntrepriseData[] = JSON.parse(jsonData);

    // Rechercher l'entreprise en ignorant la casse et les espaces
    const normalizedSearchName = normalizeCompanyName(name);
    return (
      entreprises.find(
        (entreprise) =>
          normalizeCompanyName(entreprise.Nom) === normalizedSearchName
      ) || null
    );
  } catch (error) {
    console.error("Erreur lors de la lecture des données:", error);
    return null;
  }
}

export default async function EntreprisePage({ params }: Props) {
  const entreprise = await getEntrepriseData(params.name);
  if (!entreprise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h1 className="text-2xl text-red-600 mb-2">Entreprise non trouvée</h1>
          <p>
            L&apos;entreprise &quot;{params.name}&quot; n&apos;existe pas dans
            notre base de données.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
   
      <div className=" my-16 rounded-lg shadow-sm">
        <div className="flex rounded-lg flex-col items-center mb-8 mx-auto max-w-2xl w-full">
          {entreprise["Logo (lien)"] && (
            <div className="mb-4 relative w-48 h-48">
              <Image
                src={entreprise["Logo (lien)"]}
                alt={`Logo ${entreprise.Nom}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-center text-gray-800">
            {entreprise.Nom}
          </h1>
        </div>

        <div className="space-y-8">
          {Object.entries(entreprise).map(
            ([key, value]) =>
              !EXCLUDED_FIELDS.includes(key) && (
                <div key={key} className="flex rounded-lg flex-col shadow-lg  pb-4  mx-auto max-w-4xl w-full">
                  <div className="border-b  bg-gradient-to-r from-gray-50 to-white  flex-1 py-4 font-semibold text-black text-center">{key}</div>
                  <div className="py-4 flex-1 mt-1 text-black bg-white text-center">
                    {value || "Non spécifié"}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}