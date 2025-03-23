const fs = require('fs');

if (process.argv.length < 3) {
    console.error('Usage: node script.js <chemin_vers_fichier_csv> [noms_entreprises]');
    console.error('Exemple: node script.js data.csv "IKEA,TikTok,alibaba"');
    console.error('Si noms_entreprises n\'est pas renseigné, toutes les entreprises seront traitées');
    process.exit(1);
}

const csvFilePath = process.argv[2];
const companiesArg = process.argv[3];
const LIGNE_CLE_ENTREPRISE = 4;
const outputFile = 'entreprise.json';

function normalizeCompanyName(name) {
    // console.log("name", name);
    return name.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '');
}

function convertCsvToJson(csvData, selectedCompanies = null) {
    // Diviser le CSV en lignes
    const lines = csvData.split('\n');
    
    // Récupérer les noms d'entreprises de la ligne clé
    let companyNames = lines[LIGNE_CLE_ENTREPRISE - 1].split(';');
    companyNames.splice(0,1);
    // Si aucune entreprise n'est sélectionnée, traiter toutes les entreprises
    if (!selectedCompanies) {
        selectedCompanies = companyNames.map(name => normalizeCompanyName(name)).join(',');
    }
    
    // Créer un mapping des noms normalisés vers les noms originaux et leurs indices
    const companyMapping = {};
    companyNames.forEach((name, index) => {
        const normalizedName = normalizeCompanyName(name);
        companyMapping[normalizedName] = {
            originalName: name.trim(),
            index: index
        };
    });
    // console.log(selectedCompanies)
    // Trouver les indices des colonnes pour les entreprises sélectionnées
    const columnIndices = selectedCompanies.split(',').map(company => {
        const normalizedCompany = normalizeCompanyName(company);
        const mappedCompany = companyMapping[normalizedCompany];
        
        if (!mappedCompany) {
            throw new Error(`Entreprise non trouvée : ${company}
Entreprises disponibles : ${Object.values(companyMapping).map(c => c.originalName).join(', ')}`);
        }
        console.log("couocu",company,mappedCompany.index)
        return mappedCompany.index;
    });
    
    const result = [];
    
    // Pour chaque colonne sélectionnée
    for (let colIndex of columnIndices) {
        const columnObj = {
            "Nom": companyNames[colIndex].trim()
        };
        
        // Pour chaque ligne
        for (let row = LIGNE_CLE_ENTREPRISE; row < 30 && row < lines.length; row++) {
            const cells = lines[row].split(';');
            const characteristicName = cells[0].trim();
            const value = cells[colIndex+1] ? cells[colIndex+1].trim() : '';
            columnObj[characteristicName] = value;
        }
        
        // Ajouter l'objet au résultat
        result.push(columnObj);
    }
    
    return result;
}

try {
    // Lecture avec encodage UTF-8
    const csvData = fs.readFileSync(csvFilePath, { encoding: 'utf8', flag: 'r' })
        .replace(/^\uFEFF/, ''); // Supprime le BOM s'il existe
    
    const newData = convertCsvToJson(csvData, companiesArg);
    
    // Lire le fichier existant s'il existe
    let existingData = [];
    if (fs.existsSync(outputFile)) {
        try {
            const fileContent = fs.readFileSync(outputFile, { encoding: 'utf8' });
            existingData = JSON.parse(fileContent);
        } catch (err) {
            console.warn('Le fichier existant est vide ou invalide. Création d\'un nouveau fichier.');
        }
    }

    // Fusionner les données en évitant les doublons basés sur le nom
    const mergedData = [...existingData];
    for (const newItem of newData) {
        // console.log(newd)
        const existingIndex = mergedData.findIndex(
            item => normalizeCompanyName(item.Nom) === normalizeCompanyName(newItem.Nom)
        );
        if (existingIndex >= 0) {
            mergedData[existingIndex] = newItem;
        } else {
            mergedData.push(newItem);
        }
    }
    
    // Écriture avec encodage UTF-8 explicite
    fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2), { encoding: 'utf8' });
    console.log(`Conversion terminée. Résultat écrit dans ${outputFile}`);
    console.log(`Entreprises traitées : ${companiesArg || 'Toutes les entreprises'}`);

} catch (error) {
    console.error('Erreur lors du traitement du fichier:', error.message);
    process.exit(1);
}