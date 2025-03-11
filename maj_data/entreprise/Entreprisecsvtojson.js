const fs = require('fs');

if (process.argv.length < 4) {
    console.error('Usage: node script.js <chemin_vers_fichier_csv> <noms_entreprises>');
    console.error('Exemple: node script.js data.csv "IKEA,TikTok,alibaba"');
    process.exit(1);
}

const csvFilePath = process.argv[2];
const companiesArg = process.argv[3];
const LIGNE_CLE_ENTREPRISE = 4;

function normalizeCompanyName(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '');
}

function convertCsvToJson(csvData, selectedCompanies) {
    // Diviser le CSV en lignes
    const lines = csvData.split('\n');
    
    // Récupérer les noms d'entreprises de la ligne clé
    const companyNames = lines[LIGNE_CLE_ENTREPRISE - 1].split(',');
    
    // Créer un mapping des noms normalisés vers les noms originaux et leurs indices
    const companyMapping = {};
    companyNames.forEach((name, index) => {
        const normalizedName = normalizeCompanyName(name);
        companyMapping[normalizedName] = {
            originalName: name.trim(),
            index: index
        };
    });
    
    // Trouver les indices des colonnes pour les entreprises sélectionnées
    const columnIndices = selectedCompanies.split(',').map(company => {
        const normalizedCompany = normalizeCompanyName(company);
        const mappedCompany = companyMapping[normalizedCompany];
        
        if (!mappedCompany) {
            throw new Error(`Entreprise non trouvée : ${company}
Entreprises disponibles : ${Object.values(companyMapping).map(c => c.originalName).join(', ')}`);
        }
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
            const cells = lines[row].split(',');
            const characteristicName = cells[0].trim();
            const value = cells[colIndex] ? cells[colIndex].trim() : '';
            columnObj[characteristicName] = value;
        }
        
        // Ajouter l'objet au résultat
        result.push(columnObj);
    }
    
    return result;
}

try {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const jsonResult = convertCsvToJson(csvData, companiesArg);
    const outputFile = 'entreprise.json';
    
    fs.writeFileSync(outputFile, JSON.stringify(jsonResult, null, 2));
    console.log(`Conversion terminée. Résultat écrit dans ${outputFile}`);
    console.log(`Entreprises traitées : ${companiesArg}`);

} catch (error) {
    console.error('Erreur lors du traitement du fichier:', error.message);
    process.exit(1);
}