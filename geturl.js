async function checkTosdrServices() {
    const maxId = 1000; // Limite supérieure à ajuster selon besoin
    const results = [];
  
    for (let id = 1; id <= maxId; id += 1) {
      try {
        const response = await fetch(`https://api.tosdr.org/service/v3/?id=${id}`);
        const data = await response.json();
        // console.log(data)
        // Si la réponse n'est pas "Service not found"
        if (data.detail !== "Service not found") {
          console.log(`ID ${id}: `);
        //   results.push({
        //     id: id,
        //     name: data.parameters?.name || 'Nom non disponible'
        //   });
        }
  
        // Petite pause pour ne pas surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 1000));
  
      } catch (error) {
        // console.error(`Erreur pour l'ID ${id}:`, error);
      }
    }
  
    // Afficher tous les résultats à la fin
    // console.log("\nRésultats trouvés :");
    // console.table(results);
    // console.log(`Total des services trouvés : ${results.length}`);
  }
  
  // Lancer la vérification
  checkTosdrServices();