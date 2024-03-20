
export default function FAQ() {
    return (
        <section className="ma-page">
      <h1 className="title">FAQ Questions Fréquentes</h1>

      <div className="faq-item">
        <h2>Qu'est-ce que la protection des données personnelles ?</h2>
        <p>
          Les données personnelles incluent toutes les informations permettant
          d'identifier directement ou indirectement une personne physique,
          telles que le nom, l'adresse, l'adresse e-mail, etc. La protection
          des données personnelles vise à garantir que ces informations sont
          utilisées de manière légale, éthique et sécurisée. La protection des
          données personnelles est cruciale pour prévenir les violations de la
          vie privée, la fraude, le vol d'identité et d'autres formes d'abus.
        </p>
      </div>

      <div className="faq-item">
        <h2>Quels sont mes droits en matière de protection des données personnelles ?</h2>
        <p>
          Vous avez le droit d'être informé sur la manière dont vos données
          personnelles sont collectées, utilisées et traitées. Vous avez le
          droit d'accéder à vos propres données personnelles et de demander
          leur rectification ou leur suppression si elles sont incorrectes ou
          inappropriées. Vous avez également le droit à la portabilité de vos
          données, c'est-à-dire le droit de récupérer vos données personnelles
          dans un format structuré et couramment utilisé, afin de les
          transférer à un autre service.
        </p>
      </div>

      <div className="faq-item">
        <h2>Qu'est-ce que la protection des données personnelles ?</h2>
        <p>
          Les données personnelles incluent toutes les informations permettant
          d'identifier directement ou indirectement une personne physique,
          telles que le nom, l'adresse, l'adresse e-mail, etc. La protection
          des données personnelles vise à garantir que ces informations sont
          utilisées de manière légale, éthique et sécurisée. La protection des
          données personnelles est cruciale pour prévenir les violations de la
          vie privée, la fraude, le vol d'identité et d'autres formes d'abus.
        </p>
      </div>

      <style >{`
        .ma-page {
          display: flex;
          flex-direction: column;
        }

        .title {
          font-size: 2.5vw;
          color: #000;
          align-items: center;
        }

        .faq-item {
          width: 90%;
          max-width: 800px;
          margin-top: 3%;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          font-size: 2vw;
          color: #000;
          margin-bottom: 1%;
          align-items: center;
          font-weight: bold;
        }

        p {
          font-size: 1.3vw;
          color: #000;
          margin-bottom: 3%;
        }
      `}</style>
        </section>
    );
}
