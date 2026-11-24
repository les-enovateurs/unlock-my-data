import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/metadata";

type Lang = "fr" | "en";
type Entry = { q: string; a: string; link?: { href: string; label: string } };

const CNIL_COMPLAINT = "https://www.cnil.fr/fr/plaintes";

// Generic rules that hold for every service: nothing here may claim a fact about a specific company.
const T: Record<Lang, { heading: string; home: string; hub: string; entries: (name: string) => Entry[] }> = {
    fr: {
        heading: "Vos questions sur la suppression de vos données",
        home: "Accueil",
        hub: "Supprimer mes données",
        entries: (name) => [
            {
                q: `Désactiver ou supprimer mon compte ${name} : quelle différence ?`,
                a: "Désactiver met le compte en pause : vos données restent chez l'entreprise et vous pouvez revenir. Supprimer ferme le compte. Pour exiger que vos données personnelles soient effacées, demandez-le par écrit en citant le droit à l'effacement : c'est l'e-mail que nous préparons ci-dessus.",
            },
            {
                q: "Sur quel droit repose ma demande ?",
                a: "Sur l'article 17 du RGPD, le « droit à l'effacement ». Il s'applique dans de nombreux cas : quand l'entreprise n'a plus besoin de vos données, quand vous retirez votre accord ou quand vous refusez qu'elle s'en serve. La demande est gratuite.",
            },
            {
                q: "En combien de temps l'entreprise doit-elle répondre ?",
                a: "Dans un délai d'un mois après avoir reçu votre demande. Si la demande est complexe ou si elle en reçoit beaucoup, elle peut prolonger ce délai de deux mois, à condition de vous prévenir et de vous dire pourquoi avant la fin du premier mois.",
            },
            {
                q: "Et si l'entreprise ne répond pas ?",
                a: "Relancez-la par écrit en rappelant la date de votre première demande et gardez une copie de vos échanges. Sans réponse ou en cas de refus injustifié, vous pouvez porter plainte auprès de la CNIL, gratuitement et en ligne.",
                link: { href: CNIL_COMPLAINT, label: "Porter plainte auprès de la CNIL" },
            },
            {
                q: "J'ai créé ce compte quand j'étais mineur. Ça change quelque chose ?",
                a: "Oui. Le RGPD prévoit expressément l'effacement des données collectées par un service en ligne auprès d'un enfant sur la base de son accord (article 17, paragraphe 1, point f). Ce droit reste valable même si vous êtes majeur aujourd'hui.",
            },
            {
                q: "L'entreprise peut-elle garder certaines de mes données ?",
                a: "Oui, dans des cas limités : quand la loi l'oblige à les conserver (par exemple les factures, pour la comptabilité) ou quand elle en a besoin pour se défendre en justice. Si elle refuse d'effacer tout ou partie de vos données, elle doit vous expliquer pourquoi et vous dire que vous pouvez saisir la CNIL.",
            },
        ],
    },
    en: {
        heading: "Your questions about deleting your data",
        home: "Home",
        hub: "Delete my data",
        entries: (name) => [
            {
                q: `Deactivating or deleting my ${name} account: what's the difference?`,
                a: "Deactivating pauses the account: your data stays with the company and you can come back. Deleting closes the account. To require that your personal data be erased, ask in writing and cite the right to erasure: that is the email we prepare above.",
            },
            {
                q: "Which right does my request rely on?",
                a: "Article 17 of the GDPR, the \"right to erasure\". It applies in many cases: when the company no longer needs your data, when you withdraw your consent or when you object to its use. The request is free.",
            },
            {
                q: "How long does the company have to reply?",
                a: "One month from receiving your request. If the request is complex or it receives many, it can extend this by two more months, as long as it tells you, with the reason, before the first month is over.",
            },
            {
                q: "What if the company doesn't reply?",
                a: "Send a written reminder mentioning the date of your first request, and keep a copy of your exchanges. If there is still no answer, or an unjustified refusal, you can complain to your country's data protection authority, free of charge. In France, that is the CNIL.",
                link: { href: CNIL_COMPLAINT, label: "File a complaint with the CNIL (France)" },
            },
            {
                q: "I created this account when I was a minor. Does that change anything?",
                a: "Yes. The GDPR explicitly provides for erasing data that an online service collected from a child based on their consent (article 17(1)(f)). This right still applies if you are an adult today.",
            },
            {
                q: "Can the company keep some of my data?",
                a: "Yes, in limited cases: when the law requires it to keep them (invoices for accounting, for example) or when it needs them to defend itself in court. If it refuses to erase all or part of your data, it must tell you why and that you can complain to the data protection authority.",
            },
        ],
    },
};

export default function DeleteGuideFaq({ lang, name, slug }: { lang: Lang; name: string; slug: string }) {
    const t = T[lang];
    const entries = t.entries(name);
    const hubPath = lang === "fr" ? "/supprimer-mes-donnees/" : "/delete-my-data/";
    return (
        <section aria-labelledby="guide-faq-heading" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 id="guide-faq-heading" className="umd-heading-2 mb-6">{t.heading}</h2>
            <div className="space-y-3">
                {entries.map(({ q, a, link }) => (
                    <details key={q} className="umd-card group">
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-display font-bold text-umd-slate-900 [&::-webkit-details-marker]:hidden">
                            {q}
                            <span aria-hidden="true" className="text-umd-indigo-600 font-mono shrink-0 group-open:hidden">+</span>
                            <span aria-hidden="true" className="text-umd-indigo-600 font-mono shrink-0 hidden group-open:inline">−</span>
                        </summary>
                        <div className="px-5 pb-5 text-umd-slate-600 leading-relaxed">
                            <p className="m-0">{a}</p>
                            {link && (
                                <a href={link.href} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-outline umd-btn-sm mt-4">
                                    {link.label}
                                </a>
                            )}
                        </div>
                    </details>
                ))}
            </div>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: entries.map(({ q, a }) => ({
                    "@type": "Question",
                    name: q,
                    acceptedAnswer: { "@type": "Answer", text: a },
                })),
            }} />
            <JsonLd data={breadcrumbJsonLd([
                [t.home, lang === "fr" ? "/" : "/en/"],
                [t.hub, hubPath],
                [name, `${hubPath}${slug}/`],
            ])} />
        </section>
    );
}
