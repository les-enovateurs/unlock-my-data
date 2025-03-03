import fetch from 'node-fetch';
import fs from 'fs';
//'http://127.0.0.1:8000/api/applications';
const apiUrl = 'http://127.0.0.1:8000/api/search/com.instagram.android/details';

//aler dans localhsot admin poru avoir le bon token
const authToken = 'c811ec871431d7be657b3295417a1ad35e76dd5f';

async function fetchData() {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(apiUrl, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sauvegarder les données dans un fichier JSON
		const indexEnd = apiUrl.lastIndexOf("/");
		const indexstart = apiUrl.indexOf("search");
		const fileName=apiUrl.substring(indexstart+7, indexEnd) + ".json";
		console.log(fileName)
        fs.writeFileSync(
            fileName, 
            JSON.stringify(data, null, 2),  // Le '2' ajoute une indentation pour plus de lisibilité
            'utf8'
        );
        
        console.log('Données reçues et sauvegardées dans api_results.json');
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

fetchData();
