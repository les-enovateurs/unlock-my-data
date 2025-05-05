"use client";
import { useEffect, useState } from "react";
// import { useWindowSize } from "@/tools/useWindowSize";
import Image from "next/image";
import socialNetworks from "@/app/config/socialNetworks";
import { ListeTypeApp } from "@/app/config/listeTypeApp";

// Interfaces pour les permissions et trackers
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

// Ajouter la fonction convertExodusToJson
const convertExodusToJson = (content: string) => {
  // Extraire le handle et le nom de l'application
  const handleRegex = /Report for ([\w.]+)/;
  const handleMatch = content.match(handleRegex);
  const handle = handleMatch ? handleMatch[1] : null;

  const appNameRegex = /<h1 class="main-title">\s*([^<]+)\s*<\/h1>/;
  const appNameMatch = content.match(appNameRegex);
  const appName = appNameMatch ? appNameMatch[1].trim() : null;

  // Extraire les trackers
  const trackerRegex = /<a class="link black" href="\/fr\/trackers\/(\d+)\/">/g;
  const trackers = [...content.matchAll(trackerRegex)].map(match => parseInt(match[1]));

  // Extraire toutes les permissions
  const permissionRegex = /data-original-title="([^"]+)"/g;
  const permissions = [...content.matchAll(permissionRegex)]
    .map(match => match[1])
    .filter(perm => perm.startsWith('android.permission.') || perm.startsWith('com.'));

  return [{
    handle,
    app_name: appName,
    trackers,
    permissions
  }];
};

function handleHtmlToJson() {
  const html = document.querySelector('textarea')?.value;
  const json = convertHtmlToJson(html);
  console.log(json);
}

// Fonction utilitaire pour convertir le nom du pays en drapeau
function getCountryFlagUrl(countryName: string): {
  url: string;
  formattedName: string;
} {
  const countryISOCodes: { [key: string]: { code: string; name: string } } = {
    france: { code: "fr", name: "France" },
    "united states": { code: "us", name: "United States" },
    china: { code: "cn", name: "China" },
    "south korea": { code: "kr", name: "South Korea" },
    japan: { code: "jp", name: "Japan" },
    russia: { code: "ru", name: "Russia" },
    germany: { code: "de", name: "Germany" },
    brazil: { code: "br", name: "Brazil" },
    vietnam: { code: "vn", name: "Vietnam" },
    netherlands: { code: "nl", name: "Netherlands" },
    switzerland: { code: "ch", name: "Switzerland" },
    panama: { code: "pa", name: "Panama" },
    israel: { code: "il", name: "Israel" },
    india: { code: "in", name: "India" },
    "united kingdom": { code: "gb", name: "United Kingdom" },
    ireland: { code: "ie", name: "Ireland" },
    singapore: { code: "sg", name: "Singapore" },
  };

  const countryInfo = countryISOCodes[countryName.toLowerCase()];
  return {
    url: countryInfo
      ? `https://flagcdn.com/w20/${countryInfo.code}.png`
      : "/images/globe-icon.png",
    formattedName: countryInfo ? countryInfo.name : "Unknown",
  };
}

// Ajouter la fonction fileToBase64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
};

export default function ModifFichierConfig() {
  const [activeTab, setActiveTab] = useState<"config" | "upload">("config");
  const [fileContent, setFileContent] = useState("");
  const [status, setStatus] = useState("");
  const [invalidFiles, setInvalidFiles] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [nom, setNom] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [filesInPR, setFilesInPR] = useState<string[]>([]);
  const [fileType, setFileType] = useState<"app" | "web">("app");
  const [selectedConfigType, setSelectedConfigType] = useState<string>("");
  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigFile, setNewConfigFile] = useState("");
  const [newConfigUrl, setNewConfigUrl] = useState("");

  // Mettre à jour le contenu quand la sélection change
  useEffect(() => {
    if (selectedConfigType) {
      const configFile = ListeTypeApp[selectedConfigType]?.file;
      if (configFile) {
        import(`@/app/config/${configFile}`)
          .then((module) => {
            // Convertir l'objet en string formatté
            const content = `export const ${configFile} = ${JSON.stringify(module.default, null, 2)};`;
            setFileContent(content);
          })
          .catch((error) => {
            console.error("Erreur de chargement du fichier:", error);
            setStatus(`Erreur: Impossible de charger le fichier ${configFile}`);
          });
      }
    }
  }, [selectedConfigType]);

  // Modifier getInitialContent pour utiliser le fichier sélectionné
  const getInitialContent = () => {
    if (!selectedConfigType) return "";
    const configFile = ListeTypeApp[selectedConfigType]?.file;
    return configFile ? `export const ${configFile} = {};` : "";
  };

  // Modifier handleReset pour utiliser le fichier sélectionné
  const handleReset = () => {
    if (!selectedConfigType) {
      setStatus("Veuillez sélectionner un type de configuration");
      return;
    }
    
    if (confirm("Voulez-vous vraiment réinitialiser le contenu ?")) {
      const configFile = ListeTypeApp[selectedConfigType]?.file;
      import(`@/app/config/${configFile}`)
        .then((module) => {
          const content = `export const ${configFile} = ${JSON.stringify(module.default, null, 2)};`;
          setFileContent(content);
          setStatus("Contenu réinitialisé");
        })
        .catch((error) => {
          console.error("Erreur lors de la réinitialisation:", error);
          setStatus("Erreur lors de la réinitialisation");
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConfigType) {
      setStatus("Veuillez sélectionner un type de configuration");
      return;
    }

    const configFile = ListeTypeApp[selectedConfigType].file;
    setStatus("Création de la PR en cours...");

    try {
      // 1. Créer une nouvelle branche avec le nom du fichier
      const branchName = `update-${configFile}-${Date.now()}`;
      const mainRef = await getMainRef();
      await createBranch(branchName, mainRef);

      // 2. Mettre à jour le fichier dans la nouvelle branche
      await createOrUpdateFile({
        path: `app/config/${configFile}.ts`,  // Chemin mis à jour
        content: fileContent,
        branch: branchName,
        message: `Update ${configFile} configuration`,  // Message mis à jour
      });

      // 3. Créer la PR
      const response = await fetch(
        "https://api.github.com/repos/amapic/test/pulls",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `Update ${configFile} configuration`,  // Titre mis à jour
            body: `Mise à jour de la configuration ${ListeTypeApp[selectedConfigType].name}`,  // Description mise à jour
            head: branchName,
            base: "master",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la PR");
      }

      setStatus("PR créée avec succès !");
    } catch (error) {
      setStatus(`Erreur: ${error.message}`);
    }
  };

  const getMainRef = async () => {
    const response = await fetch(
      "https://api.github.com/repos/amapic/test/git/refs/heads/master",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur API GitHub: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.object.sha;
  };

  const createBranch = async (branchName: string, sha: string) => {
    await fetch("https://api.github.com/repos/amapic/test/git/refs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: sha,
      }),
    });
  };

  const createOrUpdateFile = async ({
    path,
    content,
    branch,
    message,
  }: {
    path: string;
    content: string;
    branch: string;
    message: string;
  }) => {
    // 1. D'abord, obtenir le SHA du fichier existant
    const fileResponse = await fetch(
      `https://api.github.com/repos/amapic/test/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    let sha = "";
    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      sha = fileData.sha;
    }

    // 2. Mettre à jour le fichier avec le SHA
    await fetch(`https://api.github.com/repos/amapic/test/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        branch,
        sha, // Ajout du SHA pour permettre la mise à jour
      }),
    });
  };

  const fetchFilesInPR = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/amapic/test/pulls?state=open",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des PRs");
      }

      const prs = await response.json();
      const filesInPRs: string[] = [];

      // Pour chaque PR, récupérer les fichiers modifiés
      for (const pr of prs) {
        const filesResponse = await fetch(pr.url + "/files", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (filesResponse.ok) {
          const files = await filesResponse.json();
          files.forEach((file: { filename: string }) => {
            if (file.filename.startsWith("data/app/")) {
              filesInPRs.push(
                file.filename.replace("data/app/", "").replace(".json", "")
              );
            }
          });
        }
      }

      setFilesInPR(filesInPRs);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des fichiers en PR:",
        error
      );
    }
  };

  const checkFiles = async () => {
    setIsChecking(true);
    setStatus('Vérification des fichiers...');
    await fetchFilesInPR();
    const invalidOnes: string[] = [];

    try {
      const contentMatch = fileContent.match(/export const socialNetworks = ({[\s\S]*});/);
      if (!contentMatch) {
        throw new Error('Format de fichier invalide');
      }
      
      const networks = JSON.parse(contentMatch[1]);
      
      for (const [key, network] of Object.entries(networks)) {
        const fileUrl = `/data/app/${network.name}.json`;
        try {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            invalidOnes.push(network.name);
          }
        } catch (error) {
          invalidOnes.push(network.name);
        }
      }

      setInvalidFiles(invalidOnes);
      
      if (invalidOnes.length === 0) {
        setStatus('Tous les fichiers sont valides !');
      } else {
        setStatus(`${invalidOnes.length} fichier(s) manquant(s)`);
      }
    } catch (error) {
      setStatus(`Erreur de vérification: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  // Style conditionnel pour le textarea avec highlighting
  const getStyledContent = () => {
    if (invalidFiles.length === 0 && filesInPR.length === 0) return fileContent;

    const contentLines = fileContent.split("\n");
    const styledLines = contentLines.map((line) => {
      const hasInvalidFile = invalidFiles.some((file) =>
        line.includes(`"file": "${file}"`)
      );
      const fileInPR = filesInPR.some((file) =>
        line.includes(`"file": "${file}"`)
      );

      if (hasInvalidFile) {
        return `<span class="text-red-500">${line}</span>`;
      } else if (fileInPR) {
        return `<span class="text-orange-500">${line}</span>`;
      }
      return line;
    });

    return styledLines.join("\n");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus('Création de la PR en cours...');

    try {
      const base64ContentApp = fileApp ? await fileToBase64(fileApp) : '';
      const base64ContentWeb = fileWeb ? await fileToBase64(fileWeb) : '';
      const branchName = `upload-${selectedNetwork}-${Date.now()}`;
      const mainRef = await getMainRef();
      await createBranch(branchName, mainRef);

      // Utiliser le nom approprié pour les fichiers
      const fileName = selectedNetwork === 'new' ? nom : socialNetworks[selectedNetwork].name;

      // Upload du fichier Exodus dans data/app
      await createOrUpdateFile({
        path: `data/app/${fileName}.json`,
        content: base64ContentApp,
        branch: branchName,
        message: `Upload fichier Exodus pour ${fileName}`
      });

      // Upload du fichier Web dans data/web
      await createOrUpdateFile({
        path: `data/web/${fileName}.json`,
        content: base64ContentWeb,
        branch: branchName,
        message: `Upload fichier Web pour ${fileName}`
      });

      const response = await fetch('https://api.github.com/repos/amapic/test/pulls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Upload fichiers pour ${fileName}`,
          body: `Upload des fichiers :\n- Exodus dans data/app/${fileName}.json\n- Web dans data/web/${fileName}.json`,
          head: branchName,
          base: 'master',
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la PR');
      }

      setUploadStatus('PR créée avec succès !');
      setSelectedNetwork('');
      setFileApp(null);
      setFileWeb(null);
      setNom('');
    } catch (error) {
      setUploadStatus(`Erreur: ${error.message}`);
      console.error('Erreur détaillée:', error);
    }
  };

  // Fonction pour obtenir le nom de la configuration actuelle
  const getCurrentConfigName = () => {
    if (selectedConfigType === "new") {
      return newConfigName || "Nouvelle configuration";
    }
    return selectedConfigType ? ListeTypeApp[selectedConfigType].name : "Aucune sélection";
  };

  const handleHtmlToJson = () => {
    try {
      const textarea = document.getElementById('coucou') as HTMLTextAreaElement;
      if (!textarea) {
        throw new Error("Textarea non trouvé");
      }

      const htmlContent = textarea.value;
      const jsonResult = convertExodusToJson(htmlContent);
      
      // Mettre à jour le textarea avec le résultat JSON formatté
      textarea.value = JSON.stringify(jsonResult, null, 2);
    } catch (error) {
      console.error("Erreur lors de la conversion:", error);
      setStatus("Erreur lors de la conversion HTML vers JSON");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Liste déroulante des configurations */}
      <div className="mb-6">
        <label htmlFor="configType" className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner le type de configuration
        </label>
        <select
          id="configType"
          value={selectedConfigType}
          onChange={(e) => setSelectedConfigType(e.target.value)}
          className="w-full p-2 border rounded shadow-sm"
        >
          <option value="">Choisir une configuration...</option>
          <option value="new" className="font-bold text-red-500">
            ➕ Nouvelle configuration
          </option>
          {Object.entries(ListeTypeApp).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name} ({config.file})
            </option>
          ))}
        </select>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        Modifier les configurations
      </h1>

      <div className="bg-gray-50 border rounded p-4 mb-6">
        <p className="text-gray-700">
          Cette interface permet de gérer les réseaux sociaux de l'application :
          <br />- <span className="font-semibold">Upload de fichier</span> :
          Ajouter ou mettre à jour un nouveau fichier d'analyse pour un réseau
          social
          <br />-{" "}
          <span className="font-semibold">Modifier la configuration</span> :
          Éditer la configuration globale des réseaux sociaux
        </p>
      </div>

      {/* Tabs existants */}
      <div className="mb-4">
        <div className="flex space-x-4 border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === "config"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("config")}
          >
            Configuration
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "upload"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload de fichiers
          </button>
        </div>
      </div>

      {activeTab === "upload" ? (
        <div className="space-y-4">
          <div className="bg-gray-50 border rounded-lg p-6 my-4 space-y-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3">
              Instructions pour l'ajout d'un nouveau rapport :
            </h3>
            <span className="font-bold text-lg text-gray-800 mb-3">Fichier exodus</span>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3 mt-1">
                  1
                </span>
                <div>
                  <p className="text-gray-700">
                    Aller sur la page Exodus de l'app à aspirer, par exemple :
                  </p>
                  <a
                    href="https://reports.exodus-privacy.eu.org/fr/reports/com.facebook.katana/latest/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-600 break-all font-mono text-sm mt-1 block"
                  >
                    https://reports.exodus-privacy.eu.org/fr/reports/com.facebook.katana/latest/
                  </a>
                  <p className="text-gray-700 mt-1">
                    et copier-coller l'intégralité du code HTML ci-dessous
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3 mt-1">
                  2
                </span>
                <div className="space-y-4">
                <textarea 
                  id="coucou" 
                  className="w-full p-2 border rounded" 
                  rows={10}
                  placeholder="Collez le code HTML ici..."
                ></textarea>
                <button 
                  onClick={handleHtmlToJson} 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Convertir HTML en JSON
                </button>
              </div>
              </div>

              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3 mt-1">
                  3
                </span>
                <div>
                  <p className="text-gray-700">
                    Enregistrer le code ci-dessus dans un fichier json et le charger ci-dessous
                  </p>
                </div>
              </div>

              {/* <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3 mt-1">4</span>
                    <div>
                      <p className="text-gray-700">
                        <strong className="text-gray-900">Important :</strong> Le nom du fichier doit correspondre à l'identifiant Google Play Store de l'application.
                        Ces identifiants sont listés dans le fichier React de la page comparatif.
                      </p>
                    </div>
                  </div> */}
            </div>

            <div className="font-bold text-lg text-gray-800  py-3 ">Fichier tosdr</div>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3 mt-1">
                  1
                </span>
                <div>
                  <p className="text-gray-700">
                    aller sur par exemple https://api.tosdr.org/service/v3/?id=32&lang=fr
                  </p>
                  
                  <p className="text-gray-700 mt-1">
                    et copier-coller l'intégralité du code json dans un fichier
                    txt.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full mr-3 mt-1">
                  2
                </span>
                <div>

                <div>
                  <p className="text-gray-700">
                    Uploader ce fichier ci-dessous
                  </p>
                </div>
             
                </div>
              </div>

              
            </div>
          </div>

          <p className="text-gray-700 w-full text-center bg-red-500 p-2 rounded-lg text-white">
            Il est obligatoire de charger les deux fichiers.
          </p>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label htmlFor="network" className="block mb-2">
                Réseau social
              </label>
              <select
                id="network"
                value={selectedNetwork}
                onChange={(e) => {
                  setSelectedNetwork(e.target.value);
                  setNom(e.target.value === 'new' ? '' : socialNetworks[e.target.value]?.name || '');
                }}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un réseau social</option>
                <option value="new" className="font-bold text-red-500">
                  ➕ Nouveau réseau social
                </option>
                {Object.entries(socialNetworks).map(([key, network]) => (
                  <option key={key} value={key}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedNetwork === 'new' && (
              <div className="mt-4">
                <label htmlFor="nom" className="block mb-2">
                  Nom du nouveau réseau social
                </label>
                <input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Ex: Mastodon"
                />
              </div>
            )}

            <div>
              <label className="block mb-2">Type de fichier</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="app"
                    checked={fileType === "app"}
                    onChange={(e) =>
                      setFileType(e.target.value as "app" | "web")
                    }
                    className="mr-2"
                  />
                  Fichier Exodus (data/app)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="web"
                    checked={fileType === "web"}
                    onChange={(e) =>
                      setFileType(e.target.value as "app" | "web")
                    }
                    className="mr-2"
                  />
                  Fichier Web (data/web)
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block mb-2">
                Fichier
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Créer la PR
            </button>

            {uploadStatus && (
              <p className={uploadStatus.includes('Erreur') ? 'text-red-500' : 'text-green-500'}>
                {uploadStatus}
              </p>
            )}
          </form>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              <span className="font-bold">Configuration actuelle :</span>{" "}
              {getCurrentConfigName()}
            </p>
          </div>

          {selectedConfigType === "new" ? (
            // Formulaire pour nouvelle configuration
            <form  className="space-y-4">
              <div>
                <label htmlFor="newConfigName" className="block mb-2">
                  Nom de la configuration
                </label>
                <input
                  type="text"
                  id="newConfigName"
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Ex: Applications Bancaires"
                  required
                />
              </div>
              <div>
                <label htmlFor="newConfigFile" className="block mb-2">
                  Nom du fichier (sans .ts)
                </label>
                <input
                  type="text"
                  id="newConfigFile"
                  value={newConfigFile}
                  onChange={(e) => setNewConfigFile(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Ex: bankApps"
                  required
                />
              </div>
              <div>
                <label htmlFor="newConfigUrl" className="block mb-2">
                  URL pour la route
                </label>
                <input
                  type="text"
                  id="newConfigUrl"
                  value={newConfigUrl}
                  onChange={(e) => setNewConfigUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Ex: bank-apps"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Créer la nouvelle configuration
              </button>
            </form>
          ) : (
            // Formulaire d'édition pour configurations existantes
            selectedConfigType && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="config" className="block mb-2">
                    Configuration ({ListeTypeApp[selectedConfigType].file}.ts)
                  </label>
                  <div
                    className="w-full h-[500px] p-2 border rounded font-mono overflow-auto bg-white"
                    style={{ whiteSpace: "pre" }}
                  >
                    <div
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: getStyledContent() }}
                      onInput={(e) => setFileContent(e.currentTarget.textContent || "")}
                      className="outline-none h-full"
                      spellCheck="false"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Créer une PR avec ces modifications
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Réinitialiser
                  </button>

                  <button
                    type="button"
                    onClick={checkFiles}
                    disabled={isChecking}
                    className={`px-4 py-2 rounded text-white ${
                      isChecking
                        ? "bg-yellow-500"
                        : invalidFiles.length > 0
                        ? "bg-red-500 hover:bg-red-600"
                        : filesInPR.length > 0
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {isChecking
                      ? "Vérification..."
                      : `Vérifier les fichiers ${
                          filesInPR.length > 0
                            ? `(${filesInPR.length} en attente)`
                            : ""
                        }`}
                  </button>
                </div>

                {status && (
                  <p
                    className={`
                    ${status.includes("Erreur") ? "text-red-500" : ""}
                    ${status.includes("manquant") ? "text-red-500" : ""}
                    ${status.includes("valides") ? "text-green-500" : ""}
                  `}
                  >
                    {status}
                  </p>
                )}
              </form>
            )
          )}
        </>
      )}
    </div>
  );
}
