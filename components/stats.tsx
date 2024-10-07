export default function Stats() {
  return (
    <section className="flex flex-col items-center">
      <div className="w-11/12 max-w-[1280px] mt-2 p-5 bg-white rounded-sm shadow-sm shadow-gray-300">
        <h2 className="text-3xl text-center">Statistiques</h2>
        <div className="text-center p-5">
          <div className="text-9xl font-bold text-[#d23b3b]">7 600</div>
          <div className="text-2xl text-[#555]">
            Cas de phishing signalés par les utilisateurs au cours du dernier
            trimestre.
          </div>
          <br />
          <p>
            Le phishing expose les utilisateurs au risque de vol d'informations
            sensibles telles que les identifiants de connexion et les données
            financières, pouvant entraîner des conséquences financières et une
            violation de la vie privée.
          </p>
        </div>
        <h3 className="text-xl font-bold text-[#21568c]">
          Protégez Vos Informations Personnelles
        </h3>
        <br />
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-5">
            <div className="font-bold text-7xl text-[#21568c]">32M</div>
            <div className="stat-description">
              Utilisateurs protègent leurs mots de passe
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-center align-middle text-xl">
              <ul>
                <li>
                  Évitez de partager des informations sensibles, telles que
                  votre numéro de sécurité sociale, votre mot de passe ou vos
                  données bancaires, sur des sites Web non sécurisés ou avec des
                  personnes non autorisées.
                </li>
                <br />
                <li>
                  Utilisez des mots de passe forts et uniques pour chaque compte
                  en ligne, et envisagez d'activer l'authentification à deux
                  facteurs pour une sécurité supplémentaire.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <br />
        <h3 className="text-xl font-bold text-[#21568c]">
          <br />
          Gérez vos Paramètres de Confidentialité
        </h3>
        <br />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="flex justify-center align-middle text-xl">
              <ul>
                <li>
                  Revoyez et ajustez régulièrement vos paramètres de
                  confidentialité pour limiter la quantité d'informations
                  personnelles partagées publiquement.
                </li>
                <br />
                <li>
                  Soyez conscient des autorisations que vous accordez aux
                  applications et aux services en ligne, et révisez les
                  applications tierces qui ont accès à vos données.
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex justify-around items-center mb-5">
              <div className="text-center p-5">
                <div className="font-bold text-7xl text-[#21568c]">15%</div>
                <div className="text-base text-[#555]">
                  Personnes vérifient les politiques de confidentialité avant de
                  partager des données
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
