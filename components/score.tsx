
export default function Score() {
return (
    <section>
    <h1 className="title">Guide des scores de notation</h1>

    <div className="card-container">
        <div className="card">
            <h2 className="card-title">A</h2>
            <p className="card-description">
                L'entreprise ne collecte pas de données / pas de cookies / Serveur en France - Pas GAFAM
            </p>
        </div>
        <div className="card">
            <h2 className="card-title">B</h2>
            <p className="card-description">
            L'entreprise collecte peu de données / pas de cookies / Serveur en France - Pas de Gafam / Interface web pour faire valoir ses droits
            </p>
        </div>
        <div className="card">
            <h2 className="card-title">C</h2>
            <p className="card-description">
            L'entreprise collecte peu de données / pas de cookies / Pas de Gafam / Serveur France / Contact mail pour faire valoir ses droits
            </p>
        </div>
        <div className="card">
            <h2 className="card-title">D</h2>
            <p className="card-description">
            L'entreprises collecte peu de données / Serveur France / Serveur Gafam /  interface web
            </p>
        </div>
        <div className="card">
            <h2 className="card-title">E</h2>
            <p className="card-description">
            L'entreprise collecte beaucoup de données / Serveur UE / Gafam / Contact mail
            </p>
        </div>
        <div className="card">
            <h2 className="card-title">F</h2>
            <p className="card-description">
            L'entreprise collecte beaucoup de données / Serveur hors UE / GAFAM / Contact mail / Fuite de données
            </p>
        </div>
        <div className="card">
            <h2 className="card-title">G</h2>
            <p className="card-description">
            L'entreprise collecte beaucoup de données / Serveur Hors UE / Pas d’information pour récupérer ses données + Bcp de fuite de sécurité
            </p>
        </div>
    
    </div>


    </section>
);
}
