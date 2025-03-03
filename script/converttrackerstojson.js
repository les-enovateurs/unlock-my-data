const fs = require('fs').promises;

// Fonction pour détecter le pays à partir de la description et du site web
function detectCountry(description = '', website = '') {
  const text = (description + ' ' + website).toLowerCase();
  
  // Dictionnaire des indices de pays
  const countryHints = {
    'france': ['france', '.fr', 'french', 'paris'],
    'united states': ['united states', 'us', '.com', 'san francisco', 'boston', 'new york', 'california', 'silicon valley', 'delaware'],
    'china': ['china', 'chinese', '.cn', 'beijing'],
    'south korea': ['korea', 'korean', '.kr'],
    'japan': ['japan', 'japanese', '.jp'],
    'russia': ['russia', 'russian', '.ru', 'moscow'],
    'germany': ['germany', 'german', '.de', 'berlin'],
    'brazil': ['brazil', 'brazilian', '.br'],
    'vietnam': ['vietnam', 'vietnamese', '.vn'],
    'netherlands': ['netherlands', 'dutch', '.nl'],
    'switzerland': ['switzerland', 'swiss', '.ch', 'suisse', 'zurich'],
    'panama': ['panama', 'panamanian', '.pa'],
    'israel': ['israel', 'israeli', '.il'],
    'india': ['india', 'indian', '.in'],
    'middle east': ['middle east', 'middle-east', 'dubai', 'uae'],
    'united kingdom': ['uk', 'britain', 'british', 'london', '.uk']
  };

  // Chercher les correspondances
  for (const [country, hints] of Object.entries(countryHints)) {
    if (hints.some(hint => text.includes(hint))) {
      return country;
    }
  }

  // Si le domaine est .com et aucun autre indice n'est trouvé, supposer US par défaut
  if (website.includes('.com') && !text.includes('acquired')) {
    return 'united states';
  }

  return 'unknown';
}

async function convertTrackersToJson() {
  try {
    // Lire le fichier source
    const data = await fs.readFile('script/output_tracker.txt', 'utf8');
    
    // Diviser en entrées de tracker
    const entries = data.split('\n').filter(entry => entry.trim());
    
    // Convertir chaque entrée
    const trackers = entries.map(entry => {
      // Extraire les champs avec une regex plus souple
      const lines = entry.trim().split('\t');
      if (lines.length >= 3) {
        const id = parseInt(lines[0]);
        const name = lines[1].trim();
        const description = lines[2] || '';
        const website = lines[3].trim();
        
        const country = detectCountry(description, website);
        
        return {
          id: id,
          name: name,
          country: country
        };
      }
      return null;
    }).filter(Boolean); // Supprimer les entrées null

    // Trier par ID
    trackers.sort((a, b) => a.id - b.id);

    // Écrire le fichier JSON
    await fs.writeFile(
      'trackers.json',
      JSON.stringify(trackers, null, 2),
      'utf8'
    );

    console.log('Conversion terminée avec succès !');
    console.log(`${trackers.length} trackers convertis.`);
    
    // Afficher les statistiques par pays
    const countryStats = trackers.reduce((acc, tracker) => {
      acc[tracker.country] = (acc[tracker.country] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nStatistiques par pays :');
    Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([country, count]) => {
        console.log(`${country}: ${count} trackers (${((count/trackers.length)*100).toFixed(1)}%)`);
      });

  } catch (error) {
    console.error('Erreur lors de la conversion:', error);
  }
}

// Exécuter la conversion
convertTrackersToJson();