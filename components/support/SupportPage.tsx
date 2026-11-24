import Link from "next/link";
import {
    ArrowRight, Building2, GraduationCap, HandCoins, Heart, Landmark, Megaphone, ShieldCheck, Users, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import DonationWidget from "./DonationWidget";

const JOIN_URL = "https://nousrejoindre.les-enovateurs.com/";
const CONTACT_EMAIL = "contact@unlock-my-data.com";

const T = {
    fr: {
        pill: "Soutenir",
        title: "Gardez Unlock My Data libre et gratuit",
        lead: "Unlock My Data est porté par l'association Les e-novateurs. Pas de publicité, pas de pisteur, pas de données revendues : le site vit grâce aux dons, aux bénévoles et aux structures qui nous font confiance.",
        whyTitle: "Pourquoi nous soutenir",
        why: [
            { title: "Indépendant", text: "Aucune entreprise analysée ne nous finance. Nos fiches disent ce que font les services, sans arrangement." },
            { title: "Ouvert", text: "Le code et les données sont publics et réutilisables. Chacun peut vérifier nos chiffres." },
            { title: "Respectueux", text: "Le site ne vous piste pas. Les e-mails de suppression partent de votre propre messagerie." },
        ],
        donateTitle: "Faire un don",
        donateText: "Un don mensuel, même de quelques euros, nous permet de prévoir : mettre à jour les fiches, suivre les sanctions, publier des études. Un don ponctuel aide aussi.",
        donateNote: "66 % de votre don est déductible de vos impôts : un don de 10 € par mois vous revient à 3,40 €. Le reçu fiscal est envoyé automatiquement par J'aime l'info, notre partenaire de gestion des dons. Don mensuel sans engagement, arrêt en un clic.",
        waysTitle: "Autres façons d'aider",
        ways: {
            member: { title: "Devenir adhérent", text: "Découvrez l'association, ses projets et comment la rejoindre, comme bénévole ou comme adhérent.", cta: "Nous rejoindre" },
            company: { title: "Mécénat d'entreprise", text: "Votre entreprise partage nos valeurs ? Soutenez un outil d'intérêt public. Nous refusons tout soutien d'un service que nous analysons.", cta: "Nous écrire" },
            grants: { title: "Fondations et appels à projets", text: "Votre fondation soutient le numérique responsable, la vie privée ou l'éducation aux médias ? Parlons-en.", cta: "Nous écrire" },
            workshop: { title: "Organiser un atelier", text: "Pour votre entreprise, votre école, votre médiathèque ou votre collectivité.", cta: "Voir les ateliers" },
            contribute: { title: "Donner de votre temps", text: "Analysez un service, relisez une fiche ou mettez à jour un guide. Aucune compétence technique requise.", cta: "Contribuer" },
            share: { title: "Faire connaître", text: "Parlez-en autour de vous ou affichez nos analyses sur votre site.", cta: "Intégrer nos analyses" },
        },
        mailSubjectCompany: "Mécénat Unlock My Data",
        mailSubjectGrants: "Appel à projets Unlock My Data",
        workshopsHref: "/ateliers",
        contributeHref: "/contribuer",
        embedHref: "/integrer",
    },
    en: {
        pill: "Support",
        title: "Keep Unlock My Data free and independent",
        lead: "Unlock My Data is run by the non-profit Les e-novateurs. No ads, no trackers, no data sold: the site lives on donations, volunteers and the organisations that trust us.",
        whyTitle: "Why support us",
        why: [
            { title: "Independent", text: "No company we analyse funds us. Our entries say what services do, with no arrangement." },
            { title: "Open", text: "The code and data are public and reusable. Anyone can check our figures." },
            { title: "Respectful", text: "The site does not track you. Deletion emails are sent from your own mailbox." },
        ],
        donateTitle: "Donate",
        donateText: "A monthly donation, even a few euros, lets us plan ahead: update entries, follow fines, publish studies. A one-off donation helps too.",
        donateNote: "For French taxpayers, 66% of your donation is tax-deductible: €10 a month costs you €3.40. The tax receipt is sent automatically by J'aime l'info, our donation partner. Monthly giving with no commitment, cancel in one click.",
        waysTitle: "Other ways to help",
        ways: {
            member: { title: "Become a member", text: "Discover the association, its projects and how to join, as a volunteer or a member.", cta: "Join us" },
            company: { title: "Corporate sponsorship", text: "Does your company share our values? Support a public-interest tool. We refuse support from any service we analyse.", cta: "Write to us" },
            grants: { title: "Foundations and grants", text: "Does your foundation support responsible tech, privacy or media literacy? Let's talk.", cta: "Write to us" },
            workshop: { title: "Book a workshop", text: "For your company, school, library or local authority.", cta: "See workshops" },
            contribute: { title: "Give your time", text: "Analyse a service, review an entry or update a guide. No technical skills needed.", cta: "Contribute" },
            share: { title: "Spread the word", text: "Tell people around you or show our analyses on your website.", cta: "Embed our analyses" },
        },
        mailSubjectCompany: "Unlock My Data sponsorship",
        mailSubjectGrants: "Unlock My Data grant",
        workshopsHref: "/workshops",
        contributeHref: "/contribute",
        embedHref: "/integrate",
    },
};

const mailto = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export default function SupportPage({ lang }: { lang: string }) {
    const t = T[lang === "en" ? "en" : "fr"];
    const ways: { icon: LucideIcon; title: string; text: string; cta: string; href: string }[] = [
        { icon: Users, ...t.ways.member, href: JOIN_URL },
        { icon: Building2, ...t.ways.company, href: mailto(t.mailSubjectCompany) },
        { icon: Landmark, ...t.ways.grants, href: mailto(t.mailSubjectGrants) },
        { icon: GraduationCap, ...t.ways.workshop, href: t.workshopsHref },
        { icon: Wrench, ...t.ways.contribute, href: t.contributeHref },
        { icon: Megaphone, ...t.ways.share, href: t.embedHref },
    ];

    return (
        <div className="bg-white text-umd-slate-900">
            <section className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white text-center">
                <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
                    <span className="umd-pill umd-pill-gold mb-6"><Heart aria-hidden="true" />{t.pill}</span>
                    <h1 className="umd-h-hero mb-5">{t.title}</h1>
                    <p className="umd-lead-text mx-auto max-w-2xl">{t.lead}</p>
                </div>
            </section>

            <section className="py-14">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="umd-heading-2 mb-8 text-center">{t.whyTitle}</h2>
                    <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
                        {t.why.map((w) => (
                            <li key={w.title} className="umd-card p-5">
                                <ShieldCheck className="mb-3 h-6 w-6 text-umd-indigo-700" aria-hidden="true" />
                                <h3 className="umd-heading-3 mb-2 !text-lg">{w.title}</h3>
                                <p className="m-0 text-[14.5px] leading-relaxed text-umd-slate-600">{w.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="border-y border-umd-slate-200 bg-umd-slate-50 py-14">
                <div className="mx-auto max-w-3xl px-6 text-center">
                    <HandCoins className="mx-auto mb-4 h-9 w-9 text-umd-indigo-700" aria-hidden="true" />
                    <h2 className="umd-heading-2 mb-4">{t.donateTitle}</h2>
                    <p className="umd-lead-text mx-auto mb-8 max-w-2xl">{t.donateText}</p>
                    <p className="m-0 mt-5 text-sm text-umd-slate-600">{t.donateNote}</p>
                    <DonationWidget lang={lang} />
                </div>
            </section>

            <section className="py-14">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="umd-heading-2 mb-8 text-center">{t.waysTitle}</h2>
                    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {ways.map(({ icon: Icon, title, text, cta, href }) => (
                            <li key={title} className="umd-card flex flex-col p-6">
                                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--umd-radius-md)] bg-umd-indigo-50 text-umd-indigo-700">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h3 className="umd-heading-3 mb-2 !text-lg">{title}</h3>
                                <p className="m-0 mb-5 flex-1 text-[14.5px] leading-relaxed text-umd-slate-600">{text}</p>
                                <a href={href} className="umd-btn umd-btn-outline umd-btn-sm self-start">
                                    {cta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
