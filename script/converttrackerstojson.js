const fs = require('fs').promises;

async function convertTrackersToJson() {
    try {
        // Lire le fichier source
        const data = await fs.readFile('trackers.json', 'utf8');
        
        // Diviser en lignes et filtrer les lignes vides
        const lines = data.split('\n').filter(line => line.trim());
        
        // Convertir chaque ligne
        const trackers = lines.map(line => {
            // Utiliser une regex pour extraire l'ID et le nom
            const match = line.match(/(\d+)\s*\|\s*(.+)/);
            if (match) {
                return {
                    id: parseInt(match[1]),
                    name: match[2].trim()
                };
            }
            return null;
        }).filter(tracker => tracker !== null);

        // Trier par ID
        trackers.sort((a, b) => a.id - b.id);

        // Écrire le nouveau fichier
        await fs.writeFile(
            'trackers_new.json',
            JSON.stringify(trackers, null, 2),
            'utf8'
        );

        console.log('Conversion terminée avec succès !');
        console.log(`${trackers.length} trackers convertis.`);

    } catch (error) {
        console.error('Erreur lors de la conversion:', error);
    }
}

// Exécuter la conversion
convertTrackersToJson();