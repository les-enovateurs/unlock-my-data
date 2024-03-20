
export default function Score() {
return (
<section className="my-section">
<div className="score-info">
    <h1 className="title">Guide des scores de notation</h1>



    <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-600">
            <div className="flex justify-center align-middle text-white  text-5xl">
                A
            </div>
        </div>
    <div className="col-span-2 border-2 border-blue-800 block px-3 py-2 w-full rounded">
        <div className="flex justify-center align-middle text-xl">
        L'entreprise ne collecte pas de données. Elle n'utilise pas de cookies. Son serveur est localisé en France. Elle n'est pas affiliée aux GAFAM.
        </div>
    </div>
    
    <div className="bg-green-300">
            <div className="flex justify-center align-middle text-white  text-5xl">
                B
            </div>
        </div>
    <div className="col-span-2 border-2 border-blue-800 block px-3 py-2 w-full rounded">
        <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte peu de données. Elle n'utilise pas de cookies. Son serveur est situé en France, ce qui exclut l'intervention des GAFAM. De plus, elle propose une interface web permettant de faire valoir ses droits.
        </div>
    </div>

    <div className="bg-lime-300">
            <div className="flex justify-center align-middle text-white  text-5xl">
                C
            </div>
        </div>
    <div className="col-span-2 border-2 border-blue-800 block px-3 py-2 w-full rounded">
        <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte peu de données. Elle n'utilise pas de cookies et n'a pas recours aux services des Gafam. Ses serveurs sont localisés en France. Les utilisateurs peuvent contacter l'entreprise par mail pour faire valoir leurs droits.
        </div>
    </div>

    <div className="bg-cyan-200">
            <div className="flex justify-center align-middle text-white  text-5xl">
                D
            </div>
        </div>
    <div className="col-span-2 border-2 border-blue-800 block px-3 py-2 w-full rounded">
        <div className="flex justify-center align-middle text-xl">
            
L'entreprise collecte peu de données. Les données sont stockées sur des serveurs en France. L'entreprise utilise également des serveurs fournis par les géants de la technologie (GAFAM). Les utilisateurs interagissent avec l'entreprise principalement via une interface web.
        </div>
    </div>

    <div className="bg-cyan-400">
            <div className="flex justify-center align-middle text-white  text-5xl">
                E
            </div>
        </div>
    <div className="col-span-2 border-2 border-blue-800 block px-3 py-2 w-full rounded">
        <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte une grande quantité de données. Ces données sont stockées sur un serveur situé dans l'Union européenne. Les GAFAM sont impliqués dans ce processus. Les informations de contact sont également obtenues via des adresses mail.
        </div>
    </div>

    <div className="bg-red-300">
            <div className="flex justify-center align-middle text-white  text-5xl">
                F
            </div>
        </div>
    <div className="col-span-2 border-2 border-blue-800 block px-3 py-2 w-full rounded">
        <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte une grande quantité de données. Le serveur utilisé se trouve en dehors de l'Union européenne. Les géants de la technologie, tels que les GAFAM, sont impliqués. Les coordonnées e-mail sont utilisées pour le contact. Il y a eu une fuite de données.
        </div>
    </div>

    <div className="bg-red-600">
            <div className="flex justify-center align-middle text-white  text-5xl">
                G
            </div>
        </div>
    <div className="col-span-2 border-2 border-blue-800 block px-3 py-2 w-full rounded">
        <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte une grande quantité de données. Le serveur est situé en dehors de l'Union européenne. Aucune information n'est disponible sur la manière de récupérer ces données en cas de besoin. De plus, il y a beaucoup de fuites de sécurité.
        </div>
    </div>

    </div>
</div>
<style>{`     
            .my-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                
            }

                .score-info {
                    width: 90%;
                    max-width: 1280px;
                    margin-top: 3%;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

            `}</style>

</section>
);
}
