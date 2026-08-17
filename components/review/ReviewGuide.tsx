/**
 * What a volunteer is actually being asked to do.
 *
 * The tool answers "does this passage exist in the policy?" on its own, and a
 * badge says so on every card. Which raises the obvious question — if every
 * quote is already verified, what is left for a human? Without an answer, a
 * volunteer either rubber-stamps everything or gives up. So the screen says it
 * out loud, with real examples of quotes that are verbatim *and* wrong.
 *
 * French only, like reviewHints.ts and the axis labels: the material being
 * reviewed is French legal text, so the guidance stays in the reader's language
 * even in EN mode.
 */

const EXAMPLES: { wrong: string; quote: string; why: string }[] = [
  {
    wrong: "Finalité — Identité",
    quote: "Les données de paiement sont par exemple : numéro de carte, date d'expiration.",
    why: "Le passage existe, mot pour mot. Mais il définit la donnée, il ne dit pas à quoi elle sert. Ce n'est pas une finalité.",
  },
  {
    wrong: "Pays destinataire — États-Unis",
    quote: "Pinterest Inc., 635 High Street, Palo Alto, CA, USA",
    why: "Le pays est bien écrit dans la citation. Mais c'est l'adresse d'un siège social : rien n'y dit que des données partent là-bas.",
  },
  {
    wrong: "Signalement — Notation / score de solvabilité",
    quote: "Nous pouvons vérifier les informations que vous nous fournissez.",
    why: "Une vérification n'est pas un score. Le critère est plausible, le passage ne l'établit pas.",
  },
];

export default function ReviewGuide() {
  return (
    <details className="umd-card" style={{ padding: "14px 18px", marginBottom: 16 }}>
      <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
        Comment relire ? (2 min de lecture)
      </summary>

      <div style={{ fontSize: 12.5, color: "var(--slate-700)", lineHeight: 1.6, marginTop: 12 }}>
        <p style={{ margin: "0 0 10px" }}>
          <b>Ce que la machine a déjà fait :</b> elle a retrouvé chaque citation
          dans le texte de la politique, au caractère près. C'est ce que dit le
          badge « Passage retrouvé dans le texte ». Elle a aussi écarté toute
          seule les citations introuvables — celles-là ne te sont même pas
          montrées, parce qu'elles ne seront pas publiées.
        </p>

        <p style={{ margin: "0 0 10px" }}>
          <b>Ce qu'elle ne sait pas faire :</b> dire si le passage <i>prouve</i>{" "}
          ce qu'on lui fait dire. Un passage peut être parfaitement authentique
          et ne rien démontrer du tout.
        </p>

        <p style={{ margin: "0 0 6px", padding: "10px 12px", background: "var(--indigo-50)",
                    borderRadius: 8, border: "1px solid var(--indigo-200)" }}>
          <b>Ta seule question, pour chaque carte :</b> ce passage, <i>à lui
          seul</i>, établit-il ce qui est affirmé au-dessus ? Si tu dois
          interpréter, deviner ou compléter — c'est un rejet.
        </p>

        <p style={{ margin: "14px 0 8px" }}><b>Trois exemples réels, tous « vérifiés » :</b></p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 18 }}>
          {EXAMPLES.map((e) => (
            <li key={e.wrong} style={{ marginBottom: 10 }}>
              <b>{e.wrong}</b>
              <blockquote className="umd-quotebox" style={{ margin: "4px 0", fontSize: 12 }}>
                « {e.quote} »
              </blockquote>
              {e.why}
            </li>
          ))}
        </ul>

        <p style={{ margin: "0 0 8px" }}><b>Pourquoi rejeter :</b></p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 18 }}>
          <li><b>Citation absente</b> — tu ne retrouves pas le passage dans le texte de gauche.</li>
          <li><b>Hors sujet</b> — le passage existe, mais il ne dit pas ça. Le cas le plus fréquent.</li>
          <li><b>Mauvaise catégorie</b> — le passage dit bien quelque chose de vrai, mais pas rangé au bon endroit.</li>
        </ul>

        <p style={{ margin: 0, color: "var(--slate-600)" }}>
          On ne te propose que les points où la machine est faible : les
          signalements, les prestataires nommés pour la première fois, et les
          catégories sensibles. Le reste est replié sous « Voir le détail
          complet » — tu peux l'ignorer. Un prestataire que tu valides ici ne
          sera plus redemandé sur les autres services.
        </p>
      </div>
    </details>
  );
}
