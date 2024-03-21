import Image from "next/image";

export default function GmailPrivacy() {
  return (
    <div className="container">
      <div className="fact">
        <div className="logo-container">
          <Image src="/G.svg" alt="Logo de Gmail" width={100} height={100} />
        </div>
        <h1 className="title" style={{ color: "white" }}> Découvrez la politique de confidentialité, des conseils pour protéger votre vie privée, et des liens pratiques pour réinitialiser, supprimer ou modifier vos données personnelles. Ensemble, engageons-nous vers un Internet plus sûr et plus durable !</h1>
      </div>

      <div className="block">
        <h2 className="block-title">Politique de confidentialité et protection de la vie privée :</h2>
        <p>Utilisez les paramètres de confidentialité pour limiter la collecte de données.</p>
        <p>Réinitialisez, supprimez ou modifiez vos données personnelles via les paramètres de votre compte Gmail.</p>
        <p>Utilisez des outils de navigation privée si nécessaire.</p>
      </div>

      <div className="block">
        <h2 className="block-title" style={{ color: "green" }}>Côté écologique :</h2>
        <p>Réduire la quantité de données partagées avec Google contribue à une utilisation plus durable des ressources numériques.</p>
        <p>Adopter des pratiques de confidentialité responsables encourage les entreprises à minimiser leur impact sur l'environnement.</p>
      </div>

      <div className="block">
        <h2 className="block-title">Données collectées par Gmail :</h2>
        <ul>
          <li>Adresse email</li>
          <li>Contacts</li>
          <li>Paramètres de compte Gmail</li>
          <li>Localisation (si activée)</li>
          <li>Utilisation des services Gmail</li>
        </ul>
      </div>

      <div className="block">
        <h2 className="block-title">Réinitialiser vos données Gmail :</h2>
        <p>Si vous souhaitez réinitialiser vos données Gmail, vous pouvez le faire en suivant ces étapes :</p>
        <ol>
          <li>Accédez à votre compte Google.</li>
          <li>Cliquez sur "Données et vie privée" à gauche.</li>
          <li>Faites défiler la page jusqu’à la section "Données des applis et services que vous utilisez".</li>
          <li>Sous "Télécharger ou supprimer vos données", cliquez sur "Supprimer un service Google".</li>
          <li>À côté de Gmail, cliquez sur "Supprimer".</li>
          <li>Saisissez une adresse e-mail existante (qui n’est pas une adresse Gmail) pour la validation.</li>
          <li>Validez votre nouvelle adresse en cliquant sur le lien reçu par e-mail.</li>
        </ol>
      </div>

      <div className="block">
        <h2 className="block-title">Supprimer vos données Gmail :</h2>
        <p>Si vous ne souhaitez plus accéder à votre adresse Gmail et à vos e-mails, vous pouvez les supprimer de votre compte Google. Voici comment procéder :</p>
        <ol>
          <li>Accédez à votre compte Google.</li>
          <li>Cliquez sur "Données et vie privée" à gauche.</li>
          <li>Faites défiler la page jusqu’à la section "Données des applis et services que vous utilisez".</li>
          <li>Sous "Télécharger ou supprimer vos données", cliquez sur "Supprimer un service Google".</li>
          <li>À côté de Gmail, cliquez sur "Supprimer".</li>
          <li>Saisissez une adresse e-mail existante (qui n’est pas une adresse Gmail) pour la validation.</li>
          <li>Validez votre nouvelle adresse en cliquant sur le lien reçu par e-mail.</li>
          <li>Remarque : Si vous utilisez l’application Gmail hors connexion, pensez également à vider le cache et à supprimer les cookies de votre navigateur.</li>
        </ol>
      </div>

      <div className="block">
        <h2 className="block-title">Modifier vos données Gmail :</h2>
        <p>Pour modifier vos données Gmail, accédez simplement à votre compte Google et explorez les options disponibles dans la section "Données et vie privée".</p>
      </div>

      <style >{`

        .container {
          background-color: #000;
          padding: 20px;
          border-radius: 8px;
          margin: 20px auto;
        
        }

        .fact {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-container {
            display: flex;
            justify-content: center;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .block {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .block-title {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        ul, ol {
          margin-left: 20px;
        }

        ol {
          list-style-type: decimal;
        }
      `}</style>
    </div>
  );
}
