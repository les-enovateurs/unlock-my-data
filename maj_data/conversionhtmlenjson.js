const fs = require('fs').promises;

async function parseExodusTxt(inputFile) {
    try {
        const content = await fs.readFile(inputFile, 'utf8');

        // Extraire le handle et le nom de l'application
        const handleRegex = /Report for ([\w.]+)/;
        const handleMatch = content.match(handleRegex);
        const handle = handleMatch ? handleMatch[1] : null;

        // Extraire le nom de l'app (après le handle dans le titre)
        const appNameRegex = /<h1 class="main-title">\s*([^<]+)\s*<\/h1>/;
        const appNameMatch = content.match(appNameRegex);
        const appName = appNameMatch ? appNameMatch[1].trim() : null;

        if (!handle || !appName) {
            throw new Error("Impossible de trouver l'identifiant ou le nom de l'application");
        }

        // Extraire les trackers
        const trackerRegex = /<a class="link black" href="\/fr\/trackers\/(\d+)\/">/g;
        const trackers = [...content.matchAll(trackerRegex)].map(match => parseInt(match[1]));

        // Extraire toutes les permissions
        const permissionRegex = /data-original-title="([^"]+)"/g;
        const permissions = [...content.matchAll(permissionRegex)]
            .map(match => match[1])
            .filter(perm => perm.startsWith('android.permission.') || perm.startsWith('com.'));

        // Créer l'objet résultat
        const result = [{
            handle,
            app_name: appName,
            trackers,
            permissions
        }];

        // Générer un nom de fichier basé sur l'application
        const outputFileName = `${handle.replace(/\./g, '_')}.json`;
        
        // Écrire le fichier JSON
        await fs.writeFile(outputFileName, JSON.stringify(result, null, 2));
        console.log(`Conversion terminée avec succès ! Résultat sauvegardé dans ${outputFileName}`);
        
        return result;

    } catch (error) {
        console.error('Erreur lors de la conversion :', error);
        throw error;
    }
}

// Version simplifiée qui retourne juste un objet
async function convertExodusToJson(content) {
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

    return {
        handle,
        app_name: appName,
        trackers,
        permissions
    };
}

// Exemple d'utilisation
async function main() {
    try {
        const inputFile = process.argv[2] || 'exodus.txt';
        const result = await parseExodusTxt(inputFile);
        console.log('Nombre de trackers trouvés :', result[0].trackers.length);
        console.log('Nombre de permissions trouvées :', result[0].permissions.length);
    } catch (error) {
        console.error('Erreur dans le programme principal :', error);
        process.exit(1);
    }
}

// Exécuter si appelé directement
if (require.main === module) {
    main();
}

module.exports = {
    parseExodusTxt,
    convertExodusToJson
};