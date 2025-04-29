import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";

type EntrepriseData = {
  Nom: string;
  "Logo (lien)": string;
  [key: string]: string;
};

const entreprise_data = "maj_data/entreprise/entreprise.json"

export default async function EntrepriseIndex() {
  
  const filePath = path.join(
    process.cwd(),
    entreprise_data
  );
  const jsonData = fs.readFileSync(filePath, "utf8");
  const entreprises: EntrepriseData[] = JSON.parse(jsonData);

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Liste des Entreprises</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {entreprises.map((entreprise) => (
          <Link
            href={`/entreprise_dynamique/${entreprise.Nom.trim().toLowerCase().replace(/[^a-z0-9]/g, "").replace(/\s+/g, "")}`}
            key={entreprise.Nom}
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col items-center">
              {entreprise["Logo (lien)"] && (
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={entreprise["Logo (lien)"]}
                    alt={`Logo ${entreprise.Nom}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold text-center">{entreprise.Nom}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 