import Image from "next/image";
import Link from "next/link";

export default function Instagram() {
    return (
        <>
        <section className="container mx-auto max-w-screen-xl">
          <div className="flex flex-col md:flex-row gap-10 justify-center p-6 items-center">
            <Image src="/images/Instagram-logo.svg" alt="Logo Instagram" width={400} height={250} sizes="(max-with: 768px) 100%, 45%" className="md:w-1/3"/>
            <div className="md:w-1/2">
              <h1 className="font-bold text-4xl text-black">Instagram</h1>
              <h2 className="text-xl ">Le média social permettant de partager des photos et des vidéos.</h2>
            </div>
          </div>
        </section>
        <section className="bg-white py-10 px-6">
          <div className="container mx-auto max-w-screen-xl">
            <h3 className="font-bold text-2xl text-black mb-2">Les bonnes pratiques.</h3>
            <div className="flex flex-col gap-2 md:flex-row">
                <div className="border-t-4 border-purple-400 md:w-1/3 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                    <h3 className="font-medium text-lg text-center">Soyez conscient de vos partages</h3>
                    <p>
                    Réfléchissez avant de publier: ne publiez rien que vous ne voudriez pas que le monde entier voie.
                    </p>
                    <p>
                    Faites attention aux métadonnées: les photos et les vidéos peuvent contenir des informations cachées, comme votre localisation ou le modèle de votre appareil photo.
                    </p>
                    <p>
                    Utilisez des paramètres de confidentialité stricts: limitez qui peut voir vos publications et vos stories.
                    </p>
                </div>
              <div className="border-t-4 border-purple-400 md:w-1/3 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Restreignez la collecte de vos données:</h3>
                <p>
                Désactivez la personnalisation des publicités: accédez à Paramètres - Confidentialité - Publicités Personnalisation des publicités et désactivez l'option.
                </p>
                <p>
                Gérez vos activités hors Facebook: accédez à Paramètres - Confidentialité -Vos activités hors Facebook et déconnectez vos comptes Instagram d'autres applications.
                </p>
                <p>
                Désactivez la géolocalisation: accédez à Paramètres - Confidentialité - Compte - Localisation et désactivez l'option.
                </p>
              </div>
              <div className="border-t-4 border-purple-400 md:w-1/3 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Réduisez votre consommation d'Instagram</h3>
                    <p>
                    Passez moins de temps sur l'application: définissez des limites de temps ou utilisez des applications de suivi du temps d'écran.
                    </p>
                    <p>
                    Désactivez les notifications: vous ne serez pas notifié pour chaque nouvelle publication ou interaction, ce qui réduira le nombre de fois que vous ouvrez l'application.
                    </p>
                    <p>
                    Suivez moins de comptes: vous verrez moins de contenu et donc moins de publicités.
                    </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto max-w-screen-xl p-6 pb-2">
          <h2 className="font-bold text-2xl">Comment contrôler vos données sur Instagram ?</h2>
          <p>Pour garantir votre contrôle sur vos données, Instagram propose plusieurs options :</p>
                <ul className="max-w-md space-y-1 list-disc list-inside">
                  <li >Vous pouvez accéder à vos données et les télécharger à tout moment.</li>
                  <li>Vous pouvez choisir de ne pas partager certaines de vos données.</li>
                  <li>Vous pouvez désactiver la collecte de certaines données, comme votre localisation.</li>
                  <li>Vous pouvez supprimer votre compte Instagram.</li>
                </ul>
            <p>Pour obtenir davantage d'informations sur la manière dont Instagram collecte et utilise vos données, veuillez consulter sa politique de confidentialité.</p>
            <Link href={'https://www.clubic.com/tutoriels/article-893215-1-comment-connaitre-donnees-instagram-recoltees-profil.html'} prefetch={false} target="_blank" className="italic text-sm">https://www.clubic.com/tutoriels/article-893215-1-comment-connaitre-donnees-instagram-recoltees-profil.html</Link>
        </section>
        <section className="container mx-auto max-w-screen-xl p-6 pt-2">
          <h2 className="font-bold text-2xl">Où sont stocké nos données présentes sur Instagram ?</h2>
          <p>Instagram utilise une infrastructure cloud robuste et évolutive répartie dans plusieurs centres de données à travers le monde. Cette infrastructure est fournie par plusieurs acteurs majeurs du cloud computing, tels que :
          Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure. Ces données sont stockées hors Union Européenne.</p>
          
        </section>
        <section className="container mx-auto max-w-screen-xl p-6 pt-2">
          <h2 className="font-bold text-2xl">Instagram transfère t&apos;elle les données des utilisateurs ?</h2>
          <p>Oui, voici une citation provenant de la politique du site : </p>
          
            <blockquote cite="https://about.instagram.com/fr-fr/blog/announcements/instagram-community-data-policy">
            <p className="italic text-sm">Les informations contrôlées par Meta Platforms Ireland Limited seront transférées ou transmises, ou stockées et traitées dans :
            Des lieux où nous disposons d’infrastructures ou de data centers, notamment les États-Unis, l&apos;Irlande, le Danemark et la Suède
            Les pays où les Produits des entités Meta sont disponibles
            D&apos;autres pays où nos partenaires, fournisseurs, prestataires de service et d&apos;autres tiers sont situés, hors de votre pays de résidence, aux fins décrites dans la présente Politique
            </p>
            </blockquote>
            
        </section>
        <section className="bg-white py-10 px-6">
          <div className="container mx-auto max-w-screen-xl">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="border-t-4 border-purple-400 md:w-1/3 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Information de l&apos;utilisateur</h3>
                <div className="flex flex-col md:flex-row">
                  <ul className="md:w-1/2 md:inline-block">
                    <li>Nom et prénom</li>
                    <li>Date de naissance</li>  
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                    <li>Photo de profil</li>  
                    <li>Biographie</li>  
                  </ul>
                </div>
              </div>
              <div className="border-t-4 border-purple-400 md:w-1/4 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Données techniques collectées</h3>
                <ul>
                  <li>L'adresse IP de votre appareil</li>
                  <li>Le type d'appareil que vous utilisez (téléphone, ordinateur, etc.)</li>
                  <li>Le système d'exploitation de votre appareil</li>
                  <li>Les navigateurs web que vous utilisez</li>
                  <li>Votre activité sur d'autres applications Meta (Facebook, WhatsApp)</li>
                </ul>
              </div>
              <div className="border-t-4 border-purple-400 md:w-1/4 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Données basées sur votre utilisation</h3>
                <ul>
                  <li>Vos centres d'intérêt et vos habitudes de consommation</li>
                  <li>Votre localisation géographique</li>
                  <li>Vos interactions avec les publicités</li>
                  <li>Vos contacts téléphoniques (si vous autorisez Instagram à y accéder)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-screen-xl py-10 px-6 mb-4">
          <h2 className="font-bold text-2xl">Comment supprimer son compte Instagram ?</h2><br/>
          <p className="mb-5">Attenntion
                    <Image
                            src="/images/danger.svg"
                            height={25}
                            width={25}
                            alt=""
                            className={"inline"}
                    />
                </p>
          <p>
        Supprimer votre compte Instagram est une action irréversible.
        Toutes vos photos, vidéos, stories et messages seront définitivement supprimés.
        Vous ne pourrez plus vous connecter à votre compte ou récupérer vos données.
        Si vous êtes certain de vouloir supprimer votre compte Instagram, voici les étapes à suivre :

        Sur ordinateur:
          </p><br/>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-purple-500 text-white mx-auto rounded-full w-12 h-12">1</span></div>
              <h3 className="mt-3 font-medium text-xl">Se connecter à votre compte</h3>
              <Link href={'https://www.instagram.com/.'} prefetch={false} target="_blank" className="italic text-sm">https://www.instagram.com/.</Link>
            </div>
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-purple-500 text-white mx-auto rounded-full w-12 h-12">2</span></div>
              <h3 className="mt-3 font-medium text-xl">Cliquez sur votre photo de profil en haut à droite, puis sur Paramètres</h3>
            </div>
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-purple-500 text-white mx-auto rounded-full w-12 h-12">3</span></div>
              <h3 className="mt-3 font-medium text-xl">Dans confidentialité et sécurité, cliquez sur compte/informations personnelles</h3>
            </div>
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-purple-500 text-white mx-auto rounded-full w-12 h-12">4</span></div>
              <h3 className="mt-3 font-medium text-xl">Sous propriété et contrôle compte, cliquez sur désactivation ou suppression</h3>
            </div>
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-purple-500 text-white mx-auto rounded-full w-12 h-12">5</span></div>
              <h3 className="mt-3 font-medium text-xl">Cliquer sur &quot;Supprimer le compte&quot;</h3>
            </div>
          </div>
        </section>
    </>
    );
  }