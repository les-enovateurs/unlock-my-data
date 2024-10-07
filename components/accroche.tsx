export default function Accroche() {
  return (
    <section className="flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-2">
        Retrouvez votre e-liberté avec{" "}
        <span className="text-[#ff9900]">Unlock My Data</span>
      </h1>

      <p className="text-xl mb-2">
        L'Union Européenne a rendu le pouvoir aux internautes avec le RGPD.
        C'est le moment ou jamais de s'en servir !
      </p>

      <a href="https://example.com" className="bg-[#007bff] text-white rounded-sm p-2 font-bold mt-1 w-4/6 flex justify-center items-center text-xl hover:bg-[#0056b3]">
        Il est temps de reprendre le contrôle de nos données !
      </a>
      <div className="w-11/12 max-w-[800px] mt-4 bg-white rounded-sm shadow-sm shadow-gray-400 p-5">
        <div className="text-lg">
          <h2 className="text-2xl mb-1 text-center">Quel est le but de cette plateforme ?</h2>
          <p>
            Êtes-vous prêt à prendre le contrôle total de vos données
            personnelles en ligne ? Avec l'avènement du
            <span className="text-[#0626CD] font-bold"> RGPD</span> ,
            <span className="text-[#0626CD] font-bold"> l'Union Européenne </span>a renforcé les
            droits des utilisateurs sur leurs données. Chez
            <span className="text-[#0626CD] font-bold"> Unlock My Data</span>, nous mettons ce
            pouvoir entre vos mains. Notre plateforme vous guide pas à pas pour
            récupérer, exporter et supprimer vos données personnelles auprès des
            entreprises qui les détiennent. Il est temps de dire adieu à la
            surveillance de masse, aux publicités ciblées intrusives et aux
            risques de sécurité liés à la dispersion de vos informations
            personnelles.
          </p>
        </div>
        <div className="text-lg">
          <h2 className="text-2xl mb-1 text-center">Qui sommes-nous ?</h2> <img src="/les-enovateurs-logo.svg"alt="Logo Les E-novateurs" className="m-auto w-1/3"/>
          <p>
            Avec <span className="text-[#0626CD] font-bold"> Unlock My Data</span> , vous êtes
            entre de bonnes mains. Notre projet est porté par
            <span className="text-[#008C06] font-bold"> Les E-novateurs</span>, un média
            associatif engagé pour un Internet plus éthique et plus respectueux
            de la vie privée. Nous sommes hébergés en France, nous prenons soin
            de vos données et nous les cryptons pour assurer leur sécurité
            maximale. Rejoignez-nous dès aujourd'hui pour protéger votre vie
            privée en ligne et pour participer à la construction d'un Internet
            meilleur, plus sûr et plus respectueux de chacun.
          </p>
        </div>
      </div>
    </section>
  );
}
