
export default function Score() {
return (
<section>
<h1 className="title">Guide des scores de notation</h1>



<div className="grid grid-cols-3 gap-4">
    <div className="bg-green-600">
        <div className="flex justify-center align-middle text-white  text-5xl">
             A
        </div>
    </div>
  <div className="col-span-2 bg-yellow-200">
    <div className="flex justify-center align-middle text-xl">
        L'entreprise ne collecte pas de données / pas de cookies / Serveur en France - Pas GAFAM
    </div>
  </div>
  
  <div className="bg-green-300">
        <div className="flex justify-center align-middle text-white  text-5xl">
             B
        </div>
    </div>
  <div className="col-span-2 bg-yellow-200">
    <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte peu de données / pas de cookies / Serveur en France - Pas de Gafam / Interface web pour faire valoir ses droits
    </div>
  </div>

  <div className="bg-lime-300">
        <div className="flex justify-center align-middle text-white  text-5xl">
            C
        </div>
    </div>
  <div className="col-span-2 bg-yellow-200">
    <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte peu de données / pas de cookies / Pas de Gafam / Serveur France / Contact mail pour faire valoir ses droits
    </div>
  </div>

  <div className="bg-cyan-200">
        <div className="flex justify-center align-middle text-white  text-5xl">
             D
        </div>
    </div>
  <div className="col-span-2 bg-yellow-200">
    <div className="flex justify-center align-middle text-xl">
        L'entreprises collecte peu de données / Serveur France / Serveur Gafam /  interface web
    </div>
  </div>

  <div className="bg-cyan-400">
        <div className="flex justify-center align-middle text-white  text-5xl">
            E
        </div>
    </div>
  <div className="col-span-2 bg-yellow-200">
    <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte beaucoup de données / Serveur UE / Gafam / Contact mail
    </div>
  </div>

  <div className="bg-red-300">
        <div className="flex justify-center align-middle text-white  text-5xl">
             F
        </div>
    </div>
  <div className="col-span-2 bg-yellow-200">
    <div className="flex justify-center align-middle text-xl">
    L'entreprise collecte beaucoup de données / Serveur hors UE / GAFAM / Contact mail / Fuite de données
    </div>
  </div>

  <div className="bg-red-600">
        <div className="flex justify-center align-middle text-white  text-5xl">
             G
        </div>
    </div>
  <div className="col-span-2 bg-yellow-200">
    <div className="flex justify-center align-middle text-xl">
        L'entreprise collecte beaucoup de données / Serveur Hors UE / Pas d’information pour récupérer ses données + Bcp de fuite de sécurité
    </div>
  </div>

</div>





    



</section>
);
}
