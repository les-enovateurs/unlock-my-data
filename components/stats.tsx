export default function Stats() {
  return (
    <section className="sectionStats">
      <div className="backgroundstats">
        <h2 className="title">Statistiques</h2>
        <div className="stat-item stat-background-blue">
          <div className="main-stat-number">7 600</div>
          <div className="main-stat-description">
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
        <h3 className="text-xl font-bold item-h3">
          Protégez Vos Informations Personnelles
        </h3>
        <br />
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-item stat-background-blue">
            <div className="stat-number">32M</div>
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
        <h3 className="text-xl font-bold item-h3">
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
            <div className="stat-container">
              <div className="stat-item stat-background-blue">
                <div className="stat-number">15%</div>
                <div className="stat-description">
                  Personnes vérifient les politiques de confidentialité avant de
                  partager des données
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`     
            .sectionStats {
                display: flex;
                flex-direction: column;
                align-items: center;
                
            }

                .backgroundstats {
                    width: 90%;
                    max-width: 1280px;
                    margin-top: 3%;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .stat-container {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .stat-item {
                    text-align: center;
                    padding: 20px;
                }

                .main-stat-number {
                    font-size: 150px;
                    font-weight: bold;
                    color: #d23b3b;
                }

                .main-stat-description {
                    font-size: 24px;
                    color: #555;
                }

                .stat-number {
                    font-size: 75px;
                    font-weight: bold;
                    color: #21568c;
                }
                

                .stat-description {
                    font-size: 16px;
                    color: #555;
                }
                .item-h3 {
                    color: #21568c;
                }

            `}</style>
    </section>
  );
}
