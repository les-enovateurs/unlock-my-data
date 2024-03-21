export default function Accroche() {
  return (
    <section className="ma-page">
      <h1 className="title">
        Retrouvez votre e-liberté avec{" "}
        <span className="highlightB">Unlock My Data</span>
      </h1>

      <p className="description">
        L'Union Européenne a rendu le pouvoir aux internautes avec le RGPD.
        C'est le moment ou jamais de s'en servir !
      </p>

      <a href="https://example.com" className="bouton">
        Il est temps de reprendre le contrôle de nos données !
      </a>

      <div className="additional-info">
        <div className="additional-paragraph">
          <h2>Quel est le but de cette plateforme ?</h2>
          <p>
            Êtes-vous prêt à prendre le contrôle total de vos données
            personnelles en ligne ? Avec l'avènement du
            <span className="highlight"> RGPD</span> ,
            <span className="highlight"> l'Union Européenne </span>a renforcé les
            droits des utilisateurs sur leurs données. Chez
            <span className="highlight"> Unlock My Data</span>, nous mettons ce
            pouvoir entre vos mains. Notre plateforme vous guide pas à pas pour
            récupérer, exporter et supprimer vos données personnelles auprès des
            entreprises qui les détiennent. Il est temps de dire adieu à la
            surveillance de masse, aux publicités ciblées intrusives et aux
            risques de sécurité liés à la dispersion de vos informations
            personnelles.
          </p>
        </div>
        <div className="additional-paragraph">
          <h2>Qui sommes-nous ?</h2> <img src="/les-enovateurs-logo.svg"alt="Logo Les E-novateurs" className="logoenovateur"/>
          <p>
            Avec <span className="highlight"> Unlock My Data</span> , vous êtes
            entre de bonnes mains. Notre projet est porté par
            <span className="highlightgreen"> Les E-novateurs</span>, un média
            associatif engagé pour un Internet plus éthique et plus respectueux
            de la vie privée. Nous sommes hébergés en France, nous prenons soin
            de vos données et nous les cryptons pour assurer leur sécurité
            maximale. Rejoignez-nous dès aujourd'hui pour protéger votre vie
            privée en ligne et pour participer à la construction d'un Internet
            meilleur, plus sûr et plus respectueux de chacun.
          </p>
          
        </div>
      </div>

      <style>{`
                .ma-page {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    
                }


                .title {
                    font-size: 2.5vw;
                    color: #000;
                    font-weight: bold;
                    margin-bottom:1%
                }

                .highlightB {
                    color: #ff9900;
                }

                .description {
                    font-size: 1.5vw;
                    color: #000;
                    margin-bottom: 2%;
                }
                .highlight {
                    color: #0626CD;
                    font-weight: bold;
                }
                .highlightgreen {
                    color: #008C06;
                    font-weight: bold;
                }

                .additional-info {
                    width: 90%;
                    max-width: 800px;
                    margin-top: 3%;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .additional-paragraph {
                    font-size: 1.3vw;
                    color: #000;
                }

                h2 {
                    font-size: 2vw;
                    color: #000;
                    margin-bottom: 1%;
                    text-align: center;
                }

                .bouton {
                    font-size: 1.7vw;
                    display: inline-block;
                    padding: 1%;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 0.5%;
                    width: 70%;
                    text-align: center;
                }

                .bouton:hover {
                    background-color: #0056b3;
                }

                .logoenovateur {
                    display: block;
                    margin: auto;
                    width: 30%;
                }
                
            `}</style>
    </section>
  );
}
