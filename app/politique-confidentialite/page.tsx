export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Unlock My Data s'engage à protéger la vie privée des utilisateurs de notre plateforme. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
            <p className="mb-4">Nous collectons uniquement les données nécessaires au bon fonctionnement de notre service :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Données de navigation anonymes (pages visitées, temps passé sur le site)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Utilisation des données</h2>
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Améliorer notre service et votre expérience utilisateur</li>
              <li>Générer des statistiques anonymes d'utilisation</li>
              <li>Assurer la sécurité de notre plateforme</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Protection des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès, 
              modification, divulgation ou destruction non autorisés.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Vos droits</h2>
            <p className="mb-4">Conformément au RGPD, nous ne stockons pas de données personnelles, donc il n'y a pas de droits à exercer (accès, rectification, effacement, limitation, portabilité, opposition).</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, 
              vous pouvez nous contacter via notre formulaire de contact ou par email à : 
              <a href="mailto:contact@les-enovateurs.com" className="text-primary-600 hover:text-primary-800 ml-1">
                contact@les-enovateurs.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 