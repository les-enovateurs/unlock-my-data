import fs from "fs";
import path from "path";
import Image from "next/image";

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
  return name.trim().toLowerCase().replace(/\s+/g, "");
}

async function getEntrepriseData(name: string): Promise<EntrepriseData | null> {
  try {
    // Lire le fichier JSON
    const filePath = path.join(
      process.cwd(),
      "maj_data/entreprise/entreprise.json"
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

export default async function   ({ params }: Props) {
  const entreprise = await getEntrepriseData(params.name);
  // alert("coucou");
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
      {/* <section className=" my-16 border rounded-lg shadow-sm"> */}
        {/* <div className="min-h-screen flex items-center justify-center bg-gray-50"> */}
          {/* <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full"> */}
          {/* <section > */}
      <div className=" my-16 border rounded-lg shadow-sm">
        <div className="flex flex-col items-center mb-8 mx-auto max-w-2xl w-full">
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

        <div className="space-y-4">
          {Object.entries(entreprise).map(
            ([key, value]) =>
              key !== "Nom" && key !== "Logo (lien)" && (
                <div key={key} className="border flex flex-col border-btnblue rounded-lg pb-4  mx-auto max-w-4xl w-full">
                  <div className="flex-1 font-semibold text-white  bg-btnblue text-center">{key}</div>
                  <div className="flex-1 mt-1 text-white bg-white text-center">
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
