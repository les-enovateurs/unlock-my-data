import Image from "next/image";
import Link from "next/link";

export default function Features() {
    return (
        <section className="features container mx-auto max-w-screen-xl">
            <h2 className="text-xl font-bold">Comment nous vous aidons ?</h2>
            <p className="italic">Découvrez les fonctionnalités que vous propose Unlock My Data et reprenez la main sur vos données !</p>
            <div className="flex flex-col gap-4 md:flex-row mt-5">
                <div className="md:w-1/3 feature rounded shadow-lg bg-white px-4 py-5 flex flex-col items-center content-center my-5 gap-2">
                    <Image alt="Icône de bâtiments" src="/list-entreprises.svg" width={'112'} height={'112'}/>
                    <h3 className="text-lg font-medium mt-2">Entreprises et datascore</h3>
                    <p className="text-center mb-2">Retrouvez une liste régulièrement mise à jour d’entreprises qui utilise potentiellement déjà vos données personnelles. Pour savoir en un coup d’oeil leur niveau de confiance en la gestion des données, chacune d’elles dispose d’un datascore basé sur l’utilisation des données des utilisateurs.</p>
                    <Link href={"/list"} className="bg-blue-800 border-2 border-blue-800 text-white block px-3 py-2 w-full text-center rounded font-medium">Voir la liste</Link>
                    <Link href={"/score"} className="border-2 border-blue-800 text-blue-800 block px-3 py-2 w-full text-center rounded font-medium">En savoir plus sur le datascore</Link>
                </div>
                <div className="md:w-1/3 feature rounded shadow-lg bg-white px-4 py-5 flex flex-col items-center content-center my-5 gap-2">
                    <Image alt="Icône illustrant une fuite de données" src="/data-leak.svg" width={'112'} height={'112'}/>
                    <h3 className="text-lg font-medium mt-2">Fuites de données</h3>
                    <p className="text-center mb-2">De nombreuses entreprises ont déjà fait l’objet d’une fuite de données, dû à un piratage ou une mauvaise gestion des données. Dans ces cas là, les entreprises ont l’obligation de faire une déclaration à la CNIL. Vous pouvez retrouvez ici les entreprises qui ont subies des fuites de données.</p>
                    <Link href={"/list"} className="bg-blue-800 border-2 border-blue-800 text-white block px-3 py-2 w-full text-center rounded font-medium">Voir la liste</Link>
                </div>
                <div className="md:w-1/3 feature rounded shadow-lg bg-white px-4 py-5 flex flex-col items-center content-center my-5 gap-2">
                    <Image alt="Icône illustrant un template d'email" src="/template-mail.svg" width={'112'} height={'112'}/>
                    <h3 className="text-lg font-medium mt-2">Exercer vos droits</h3>
                    <p className="text-center mb-2">Nous vous permettons de faciliter l’exercice de vos droits (d’accèder / supprimer les données que l’entreprise à sur vous par exemple. Générez un email en 3 clics, que vous pourrez envoyer directement au responsable de traitement des données visible sur les fiches entreprises.</p>
                    <Link href={"/modeles"} className="bg-blue-800 border-2 border-blue-800 text-white block px-3 py-2 w-full text-center rounded font-medium">Générer un email</Link>
                    <Link href={"https://www.cnil.fr/fr/mes-demarches/les-droits-pour-maitriser-vos-donnees-personnelles"} target="_blank" className="border-2 border-blue-800 text-blue-800 block px-3 py-2 w-full text-center rounded font-medium">En savoir plus sur mes droits</Link>
                </div>
            </div>
        </section>
    );
}
