"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Printer,
    Building2,
    Database,
    ShieldAlert,
    Sparkles,
    Smartphone,
    Search,
    Lightbulb,
    ExternalLink,
    BookOpen,
} from "lucide-react";

/**
 * Guide contributeur — version web imprimable, bilingue.
 * Contenu source: guide v0.2, 27 juillet 2026 (FR). Traduction EN relue.
 * Toutes les chaînes vivent dans STR[lang] ; la structure JSX est partagée.
 */

const IMG = "/img/guide";

type Lang = "fr" | "en";

interface GuidePageProps {
    lang?: Lang;
}

// Petit lien externe homogène.
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
            style={{ color: "var(--indigo-700)" }}
        >
            {children}
            <ExternalLink className="w-[13px] h-[13px] guide-noprint-ic" />
        </a>
    );
}

// Encart « astuce ».
function Tip({ children }: { children: React.ReactNode }) {
    return (
        <div className="guide-tip">
            <Lightbulb className="w-[18px] h-[18px]" style={{ flexShrink: 0, color: "var(--amber-600, #b45309)" }} />
            <div>{children}</div>
        </div>
    );
}

// Figure avec légende.
function Figure({ src, alt, caption }: { src: string; alt: string; caption?: React.ReactNode }) {
    return (
        <figure className="guide-fig">
            <Image
                src={src}
                alt={alt}
                width={920}
                height={600}
                className="guide-fig-img"
                style={{ width: "100%", height: "auto" }}
            />
            {caption && <figcaption className="guide-fig-cap">{caption}</figcaption>}
        </figure>
    );
}

interface TocEntry {
    id: string;
    n: string;
    label: string;
}

interface GuideStrings {
    back: string;
    heroTitle: string;
    heroLead: string;
    print: string;
    fillForm: string;
    tocTitle: string;
    toc: TocEntry[];
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    credits: React.ReactNode;
    body: React.ReactNode;
}

const STR: Record<Lang, GuideStrings> = {
    fr: {
        back: "Toutes les façons de contribuer",
        heroTitle: "Guide du contributeur",
        heroLead:
            "Une aide pas à pas pour rédiger une fiche entreprise qui viendra alimenter la base de données d'Unlock My Data.",
        print: "Imprimer / PDF",
        fillForm: "Remplir une fiche",
        tocTitle: "Sommaire",
        toc: [
            { id: "ou-chercher", n: "I", label: "Où chercher l'information ?" },
            { id: "infos-generales", n: "II", label: "Informations générales" },
            { id: "acces-donnees", n: "III", label: "Accès aux données personnelles" },
            { id: "sanctions-transferts", n: "IV", label: "Sanctions et transferts de données" },
            { id: "alternatives", n: "V", label: "Alternatives recommandées" },
            { id: "application-mobile", n: "VI", label: "Application mobile" },
        ],
        ctaTitle: "Prêt·e à contribuer ?",
        ctaBody: "Gardez ce guide ouvert dans un onglet pendant que vous remplissez la fiche.",
        ctaButton: "Remplir une nouvelle fiche",
        credits: (
            <>
                Guide rédigé par <strong>dominique_usa</strong>, modifié et amélioré par{" "}
                <strong>Charlotte Leriche</strong>. Version 0.2 — 27 juillet 2026.
            </>
        ),
        body: (
            <>
                {/* I */}
                <section id="ou-chercher" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Search className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">I.</span> Où chercher l&apos;information ?</span>
                    </h2>
                    <p>
                        La majorité des informations recherchées se trouvent dans la{" "}
                        <strong>politique de confidentialité</strong> ou les{" "}
                        <strong>mentions légales</strong>{" "}du site internet de l&apos;entreprise. Le plus souvent, le
                        lien vers ces pages se trouve tout en bas de la page d&apos;accueil du site.
                    </p>
                    <p>
                        Prenons l&apos;exemple de <strong>BlaBlaCar</strong> : en faisant défiler le site{" "}
                        <Ext href="https://www.blablacar.fr/">blablacar.fr</Ext> vers le bas, vous retrouverez les
                        informations légales qui vous permettront de remplir la fiche entreprise.
                    </p>
                    <Figure
                        src={`${IMG}/blablacar-footer-legal.webp`}
                        alt="Bas de page du site BlaBlaCar avec les liens légaux"
                        caption="Les liens « Informations légales » et « Transparence » se trouvent en pied de page."
                    />
                </section>

                {/* II */}
                <section id="infos-generales" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Building2 className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">II.</span> Informations générales</span>
                    </h2>

                    <h3 className="guide-h3">a. Nom de l&apos;entreprise</h3>
                    <p>
                        Le nom de l&apos;entreprise ne doit pas être confondu avec le nom du <strong>groupe</strong>{" "}
                        auquel elle appartient, ni avec un simple établissement.
                    </p>
                    <p>
                        Exemple BlaBlaCar : c&apos;est un établissement possédant son propre numéro SIRET. Il faut
                        cependant faire apparaître qu&apos;il appartient à l&apos;entreprise <strong>COMUTO</strong>,
                        qui a un numéro SIREN et est moins connue.
                    </p>
                    <Tip>
                        Indiquez toujours le <strong>nom connu</strong> : sinon les utilisateurs auront plus de mal à
                        retrouver le service dans la liste.
                    </Tip>
                    <Figure
                        src={`${IMG}/form-infos-generales.webp`}
                        alt="Section Informations générales de la fiche, remplie pour BlaBlaCar"
                        caption="Concrètement : nom connu « Blabla Car », case « appartient à un groupe » cochée, groupe « COMUTO »."
                    />

                    <p>
                        <strong>Comment savoir s&apos;il s&apos;agit d&apos;un établissement appartenant à un groupe ?</strong>{" "}
                        Si le site est bien fait, l&apos;information figure dans les mentions légales ou la politique de
                        confidentialité. Pour BlaBlaCar, on retrouve Comuto dans la{" "}
                        <Ext href="https://legal.blablacar.com/fr-fr/privacy-policy/">politique de confidentialité</Ext> :
                    </p>
                    <blockquote className="guide-quote">
                        « Le responsable de traitement pour les trajets effectués en BlaBlaCar Bus est la société
                        Comuto Pro […], filiale à 100 % de Comuto SA, dont le siège social est situé au 84, avenue de
                        la République — 75011 Paris. »
                    </blockquote>
                    <p>
                        La mention d&apos;une filiale doit vous mettre la puce à l&apos;oreille. Vérifiez l&apos;information
                        via plusieurs sources :
                    </p>
                    <ul className="guide-ul">
                        <li><Ext href="https://annuaire-entreprises.data.gouv.fr/">Annuaire des entreprises (data.gouv.fr)</Ext></li>
                        <li><Ext href="https://www.dnb.com/business-directory.html">Dun &amp; Bradstreet</Ext> (en anglais)</li>
                        <li><Ext href="https://www.societe.com/">Societe.com</Ext></li>
                        <li><Ext href="https://wikipedia.com/">Wikipédia</Ext>, <Ext href="https://linkedin.com/">LinkedIn</Ext></li>
                    </ul>
                    <Figure
                        src={`${IMG}/wikipedia-blablacar.webp`}
                        alt="Page Wikipédia de BlaBlaCar mentionnant la société Comuto"
                        caption="La fiche Wikipédia confirme : BlaBlaCar est développé par la société française Comuto."
                    />

                    <h3 className="guide-h3">b. URL du logo</h3>
                    <p>Deux options :</p>
                    <ul className="guide-ul">
                        <li>Téléchargez l&apos;image sur votre ordinateur et insérez-la via « choisir un fichier » ;</li>
                        <li>ou copiez-collez l&apos;adresse de l&apos;image.</li>
                    </ul>
                    <Tip>
                        Faites un clic droit sur l&apos;image puis « <strong>Copier l&apos;adresse de l&apos;image</strong> ».
                        Attention à ne pas cliquer sur « Copier l&apos;image ».
                    </Tip>
                    <Figure
                        src={`${IMG}/copier-adresse-image.webp`}
                        alt="Menu contextuel du navigateur, option Copier l'adresse de l'image"
                        caption="Clic droit → « Copier l'adresse de l'image »."
                    />
                    <p>
                        <strong>Où trouver le logo ?</strong> Sur Wikipédia, Wikimédia ou{" "}
                        <Ext href="https://companieslogo.com/">companieslogo.com</Ext>. Prenez toujours la{" "}
                        <strong>dernière version</strong>{" "}du logo. Sur Wikipédia, vous trouverez parfois
                        l&apos;évolution de l&apos;identité visuelle :
                    </p>
                    <Figure
                        src={`${IMG}/wikipedia-logos.webp`}
                        alt="Évolution des logos de BlaBlaCar sur Wikipédia"
                        caption="Section « Identités visuelles » : choisissez le logo le plus récent."
                    />

                    <h3 className="guide-h3">c. Nationalité</h3>
                    <p>
                        La nationalité à indiquer est celle de la <strong>société mère</strong>{" "}(si l&apos;entreprise
                        appartient à un groupe) ou du <strong>siège social</strong>. Ne confondez pas le lieu d&apos;un
                        établissement avec celui du siège social.
                    </p>
                    <Tip>
                        Vérifiez l&apos;information via plusieurs sources : la politique de confidentialité peut ne pas
                        être à jour d&apos;un rachat. La <strong>date de dernière mise à jour</strong>{" "}de la page est un
                        bon indicateur.
                    </Tip>

                    <h3 className="guide-h3">d. Auteur·rice de la fiche</h3>
                    <p>
                        Indiquez votre prénom ou pseudo. Idéalement, le même pseudo que sur{" "}
                        <strong>Framateam</strong>{" "}: cela facilite les retours lors de la relecture par l&apos;équipe
                        Unlock et permet de connaître le nombre de fiches remplies par chacun·e.
                    </p>
                </section>

                {/* III */}
                <section id="acces-donnees" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Database className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">III.</span> Accès aux données personnelles</span>
                    </h2>

                    <h3 className="guide-h3">a. Email de contact pour l&apos;export</h3>
                    <p>
                        Indiquez l&apos;adresse mail pour exercer ses droits (accès, suppression, portabilité…) ou pour
                        toute question liée à la protection des données. On la trouve généralement dans la partie
                        « Droits des personnes » de la politique de confidentialité. Si l&apos;accès se fait via un
                        formulaire et qu&apos;aucune adresse de DPO (délégué à la protection des données) n&apos;est indiquée, laissez ce champ vide.
                    </p>

                    <h3 className="guide-h3">b. Facilité d&apos;accès aux données</h3>
                    <p>
                        Choisissez le niveau selon les documents demandés, les moyens d&apos;accès proposés et la
                        difficulté à les trouver.
                    </p>

                    <h3 className="guide-h3">c. Document(s) requis</h3>
                    <p>
                        Sélectionnez les documents requis. Si plusieurs documents sont demandés, choisissez
                        « <strong>Autre</strong> » et listez-les simplement.
                    </p>

                    <h3 className="guide-h3">d. Précision sur la demande</h3>
                    <p>Détaillez la marche à suivre, en restant concis. Par exemple :</p>
                    <ul className="guide-ul">
                        <li>Envoi d&apos;un mail à l&apos;adresse … ;</li>
                        <li>Remplir le formulaire de collecte (lien).</li>
                    </ul>

                    <h3 className="guide-h3">e. Délai de réponse</h3>
                    <p>
                        Choisissez le délai proposé. Si non mentionné et que vous n&apos;avez pas fait de demande
                        vous-même, n&apos;indiquez rien.
                    </p>

                    <h3 className="guide-h3">f. Format de réponse</h3>
                    <p>
                        Choisissez le format proposé. Si non mentionné et sans demande personnelle, n&apos;indiquez
                        rien.
                    </p>
                    <Tip>
                        Si vous avez reçu un fichier <strong>ZIP</strong>, n&apos;indiquez pas « ZIP » mais le format des
                        documents à l&apos;intérieur (Excel, Word, PDF…).
                    </Tip>

                    <h3 className="guide-h3">g. URL du site pour faire une demande</h3>
                    <p>
                        En cas de formulaire de demande en ligne, indiquez l&apos;URL de la page. Si la demande se fait
                        uniquement par mail ou voie postale, laissez vide.
                    </p>

                    <h3 className="guide-h3">h. Adresse postale pour faire une demande</h3>
                    <p>
                        Si une adresse postale est prévue pour la demande par courrier, indiquez l&apos;adresse
                        physique. Sinon, laissez le champ vide.
                    </p>
                </section>

                {/* IV */}
                <section id="sanctions-transferts" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><ShieldAlert className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">IV.</span> Sanctions et transferts de données</span>
                    </h2>

                    <h3 className="guide-h3">a. Sanction CNIL</h3>
                    <p>
                        Cochez la case si l&apos;entreprise a déjà été sanctionnée par la CNIL. Si une procédure est en
                        cours, cochez la case en précisant « Pas de sanction de la CNIL mais procédure en cours
                        (détailler) ».
                    </p>
                    <p>
                        <strong>Détail de la sanction :</strong> date, autorité, et manquement sanctionné. Soyez bref
                        (ex. : « manquement cookies », « manquement lié à la transparence »).
                    </p>
                    <p>Sites utiles :</p>
                    <ul className="guide-ul">
                        <li><Ext href="https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil">Sanctions prononcées par la CNIL</Ext></li>
                        <li>
                            <Ext href="https://www.legifrance.gouv.fr/search">Legifrance</Ext> : cliquez sur « Filtrer »
                            → « Par fonds » → cochez « CNIL » → « Par nature de délibération » → «&nbsp;Sanctions&nbsp;», puis
                            saisissez le nom de l&apos;entreprise.
                        </li>
                    </ul>
                    <Figure
                        src={`${IMG}/legifrance-recherche.webp`}
                        alt="Recherche filtrée sur Légifrance"
                        caption="Légifrance : filtrez par fonds « CNIL » et nature « Sanctions »."
                    />

                    <h3 className="guide-h3">b. Politique de transfert de données</h3>
                    <p>
                        Cochez la case si l&apos;entreprise mentionne que les données peuvent être transférées vers
                        d&apos;autres pays que la France. Cette partie est délicate : peu d&apos;entreprises indiquent
                        clairement leurs transferts et sous-traitants — ce qui révèle leur manque de transparence.
                    </p>
                    <p>
                        L&apos;information se trouve dans la politique de confidentialité, la politique de transfert (si
                        elle existe), les CGU ou la politique cookies. Souvent dispersée.
                    </p>
                    <Figure
                        src={`${IMG}/blablacar-transfert.webp`}
                        alt="Extrait de la politique de confidentialité BlaBlaCar sur les transferts"
                        caption="Exemple BlaBlaCar : mention de transfert vers des « Pays Tiers » dans la politique de confidentialité."
                    />
                    <Tip>
                        Si des transferts hors UE sont indiqués sans préciser les pays, laissez « Pays de destination »
                        vide et notez « Transferts de données hors UE sans précision des pays » dans les commentaires
                        additionnels. Vous pouvez aussi demander ces précisions au DPO.
                    </Tip>

                    <h3 className="guide-h3">c. Stockage hors U.E.</h3>
                    <p>
                        Cochez la case si les données peuvent être transmises hors Union Européenne. Souvent non
                        explicite : les entreprises évoquent des « partenaires » sans préciser leur localisation. En cas
                        de doute, cochez la case ou demandez à l&apos;équipe Unlock sur Framateam.
                    </p>

                    <h3 className="guide-h3">d. Pays de destination des transferts</h3>
                    <p>
                        Sélectionnez les pays mentionnés dans le document traitant du transfert et/ou la politique de
                        confidentialité.
                    </p>

                    <h3 className="guide-h3">e. URL de la politique de confidentialité</h3>
                    <p>
                        Indiquez l&apos;URL du document. <strong>Version anglaise :</strong> uniquement si elle existe
                        sur le site, sinon laissez vide.
                    </p>

                    <h3 className="guide-h3">f. Citation de la politique de confidentialité</h3>
                    <p>
                        Collez uniquement l&apos;extrait sur le <strong>transfert de données</strong>{" "}(5 lignes max).
                        Inutile de citer un paragraphe générique sur la collecte : cela n&apos;apporte rien à l&apos;analyse.
                    </p>
                    <Tip>
                        <strong>Version anglaise :</strong> utilisez la politique anglaise si elle existe, sinon un
                        traducteur type <Ext href="https://www.deepl.com/fr/translator">DeepL</Ext> — en relisant le résultat.
                    </Tip>
                </section>

                {/* V */}
                <section id="alternatives" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Sparkles className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">V.</span> Alternatives recommandées</span>
                    </h2>
                    <p>
                        Une alternative est une entreprise offrant sensiblement les mêmes services, mais plus
                        protectrice des données de ses usagers, plus souveraine ou plus libre.
                    </p>
                    <Figure
                        src={`${IMG}/exemples-alternatives.webp`}
                        alt="Exemples d'alternatives plus respectueuses des données"
                        caption="Exemples : Signal plutôt que WhatsApp, PeerTube plutôt que YouTube, Proton plutôt que Gmail…"
                    />
                </section>

                {/* VI */}
                <section id="application-mobile" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Smartphone className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">VI.</span> Application mobile</span>
                    </h2>

                    <h3 className="guide-h3">a. Nom de l&apos;application</h3>
                    <p>
                        Indiquez le nom tel qu&apos;il apparaît sur le Play Store ou l&apos;App Store. Pour BlaBlaCar :
                        « BlaBlaCar : Bus, Train, Covoit ».
                    </p>
                    <Figure
                        src={`${IMG}/playstore-blablacar.webp`}
                        alt="Fiche BlaBlaCar sur le Google Play Store"
                        caption="Reprenez le nom exact affiché sur le store."
                    />

                    <h3 className="guide-h3">b. Lien Play Store / App Store</h3>
                    <p>
                        Indiquez l&apos;adresse de l&apos;application. Clic droit sur le nom de l&apos;application →
                        « Copier l&apos;adresse du lien ». Pour BlaBlaCar :{" "}
                        <Ext href="https://play.google.com/store/apps/details?id=com.comuto">play.google.com/store/apps/details?id=com.comuto</Ext>.
                    </p>
                    <Figure
                        src={`${IMG}/playstore-copier-lien.webp`}
                        alt="Menu contextuel : Copier l'adresse du lien"
                        caption="Clic droit → « Copier l'adresse du lien »."
                    />
                </section>
            </>
        ),
    },

    en: {
        back: "All the ways to contribute",
        heroTitle: "Contributor guide",
        heroLead:
            "A step-by-step guide to writing a company entry for the Unlock My Data database.",
        print: "Print / PDF",
        fillForm: "Fill in an entry",
        tocTitle: "Contents",
        toc: [
            { id: "ou-chercher", n: "I", label: "Where to find the information?" },
            { id: "infos-generales", n: "II", label: "General information" },
            { id: "acces-donnees", n: "III", label: "Access to personal data" },
            { id: "sanctions-transferts", n: "IV", label: "Sanctions and data transfers" },
            { id: "alternatives", n: "V", label: "Recommended alternatives" },
            { id: "application-mobile", n: "VI", label: "Mobile application" },
        ],
        ctaTitle: "Ready to contribute?",
        ctaBody: "Keep this guide open in a tab while you fill in the entry.",
        ctaButton: "Fill in a new entry",
        credits: (
            <>
                Guide written by <strong>dominique_usa</strong>, edited and improved by{" "}
                <strong>Charlotte Leriche</strong>. Version 0.2 — 27 July 2026.
            </>
        ),
        body: (
            <>
                {/* I */}
                <section id="ou-chercher" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Search className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">I.</span> Where to find the information?</span>
                    </h2>
                    <p>
                        Most of the information you need is in the company&apos;s{" "}
                        <strong>privacy policy</strong> or <strong>legal notice</strong>. The link to these pages is
                        usually at the very bottom of the website&apos;s home page.
                    </p>
                    <p>
                        Take <strong>BlaBlaCar</strong> as an example: scrolling to the bottom of{" "}
                        <Ext href="https://www.blablacar.fr/">blablacar.fr</Ext> reveals the legal information you need
                        to fill in the company entry.
                    </p>
                    <Figure
                        src={`${IMG}/blablacar-footer-legal.webp`}
                        alt="Footer of the BlaBlaCar website with the legal links"
                        caption="The “Legal information” and “Transparency” links sit in the footer."
                    />
                </section>

                {/* II */}
                <section id="infos-generales" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Building2 className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">II.</span> General information</span>
                    </h2>

                    <h3 className="guide-h3">a. Company name</h3>
                    <p>
                        The company name should not be confused with the name of the <strong>group</strong> it belongs
                        to, nor with a single establishment.
                    </p>
                    <p>
                        BlaBlaCar example: it is an establishment with its own SIRET number. You must, however, show
                        that it belongs to the company <strong>COMUTO</strong>, which has a SIREN number and is less
                        well known.
                    </p>
                    <Tip>
                        Always use the <strong>well-known name</strong>: otherwise users will struggle to find the
                        service in the list.
                    </Tip>
                    <Figure
                        src={`${IMG}/form-infos-generales.webp`}
                        alt="General information section of the entry, filled in for BlaBlaCar"
                        caption="In practice: known name “Blabla Car”, “belongs to a group” checked, group “COMUTO”."
                    />

                    <p>
                        <strong>How do you know whether it is an establishment belonging to a group?</strong>{" "}
                        If the site is well built, the information appears in the legal notice or the privacy policy.
                        For BlaBlaCar, Comuto is mentioned in the{" "}
                        <Ext href="https://legal.blablacar.com/fr-fr/privacy-policy/">privacy policy</Ext>:
                    </p>
                    <blockquote className="guide-quote">
                        “The data controller for journeys made on BlaBlaCar Bus is Comuto Pro […], a wholly-owned
                        subsidiary of Comuto SA, whose registered office is at 84, avenue de la République — 75011
                        Paris.”
                    </blockquote>
                    <p>
                        A mention of a subsidiary should raise a flag. Check the information across several sources:
                    </p>
                    <ul className="guide-ul">
                        <li><Ext href="https://annuaire-entreprises.data.gouv.fr/">French company directory (data.gouv.fr)</Ext></li>
                        <li><Ext href="https://www.dnb.com/business-directory.html">Dun &amp; Bradstreet</Ext></li>
                        <li><Ext href="https://www.societe.com/">Société.com</Ext></li>
                        <li>Wikipedia, LinkedIn</li>
                    </ul>
                    <Figure
                        src={`${IMG}/wikipedia-blablacar.webp`}
                        alt="BlaBlaCar Wikipedia page mentioning the company Comuto"
                        caption="The Wikipedia entry confirms: BlaBlaCar is developed by the French company Comuto."
                    />

                    <h3 className="guide-h3">b. Logo URL</h3>
                    <p>Two options:</p>
                    <ul className="guide-ul">
                        <li>Download the image to your computer and insert it via “choose a file”;</li>
                        <li>or copy and paste the image address.</li>
                    </ul>
                    <Tip>
                        Right-click the image, then “<strong>Copy image address</strong>”. Be careful not to click
                        “Copy image”.
                    </Tip>
                    <Figure
                        src={`${IMG}/copier-adresse-image.webp`}
                        alt="Browser context menu, Copy image address option"
                        caption="Right-click → “Copy image address”."
                    />
                    <p>
                        <strong>Where to find the logo?</strong> On Wikipedia, Wikimedia or{" "}
                        <Ext href="https://companieslogo.com/">companieslogo.com</Ext>. Always use the{" "}
                        <strong>latest version</strong> of the logo. On Wikipedia you will sometimes find the evolution
                        of the visual identity:
                    </p>
                    <Figure
                        src={`${IMG}/wikipedia-logos.webp`}
                        alt="Evolution of the BlaBlaCar logos on Wikipedia"
                        caption="“Visual identities” section: pick the most recent logo."
                    />

                    <h3 className="guide-h3">c. Nationality</h3>
                    <p>
                        The nationality to enter is that of the <strong>parent company</strong> (if the company belongs
                        to a group) or of the <strong>registered office</strong>. Do not confuse the location of an
                        establishment with that of the registered office.
                    </p>
                    <Tip>
                        Check the information across several sources: the privacy policy may not be up to date after an
                        acquisition. The page&apos;s <strong>last-updated date</strong> is a good indicator.
                    </Tip>

                    <h3 className="guide-h3">d. Author of the entry</h3>
                    <p>
                        Enter your first name or nickname. Ideally the same nickname as on <strong>Framateam</strong>:
                        it makes feedback easier during review by the Unlock team and helps track how many entries each
                        person has filled in.
                    </p>
                </section>

                {/* III */}
                <section id="acces-donnees" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Database className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">III.</span> Access to personal data</span>
                    </h2>

                    <h3 className="guide-h3">a. Contact email for the export</h3>
                    <p>
                        Enter the email address used to exercise your rights (access, deletion, portability…) or for any
                        question related to data protection. It is usually in the “Your rights” section of the privacy
                        policy. If access is via a form and no DPO address is given, leave this field empty.
                    </p>

                    <h3 className="guide-h3">b. Ease of access to data</h3>
                    <p>
                        Choose the level based on the documents required, the access methods offered, and how hard they
                        are to find.
                    </p>

                    <h3 className="guide-h3">c. Required document(s)</h3>
                    <p>
                        Select the required documents. If several are requested, choose “<strong>Other</strong>” and
                        simply list them.
                    </p>

                    <h3 className="guide-h3">d. Details of the request</h3>
                    <p>Describe the procedure, keeping it concise. For example:</p>
                    <ul className="guide-ul">
                        <li>Send an email to … ;</li>
                        <li>Fill in the collection form (link).</li>
                    </ul>

                    <h3 className="guide-h3">e. Response time</h3>
                    <p>
                        Choose the time offered. If not stated and you have not made a request yourself, leave it
                        blank.
                    </p>

                    <h3 className="guide-h3">f. Response format</h3>
                    <p>Choose the format offered. If not stated and without a personal request, leave it blank.</p>
                    <Tip>
                        If you received a <strong>ZIP</strong> file, do not enter “ZIP” but the format of the documents
                        inside (Excel, Word, PDF…).
                    </Tip>

                    <h3 className="guide-h3">g. Website URL to make a request</h3>
                    <p>
                        For an online request form, enter the page URL. If the request is only by email or postal mail,
                        leave it empty.
                    </p>

                    <h3 className="guide-h3">h. Postal address to make a request</h3>
                    <p>
                        If a postal address is provided for requests by mail, enter the physical address. Otherwise,
                        leave the field empty.
                    </p>
                </section>

                {/* IV */}
                <section id="sanctions-transferts" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><ShieldAlert className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">IV.</span> Sanctions and data transfers</span>
                    </h2>

                    <h3 className="guide-h3">a. CNIL sanction</h3>
                    <p>
                        Check the box if the company has already been sanctioned by the CNIL (the French DPA). If a
                        procedure is ongoing, check the box and note “No CNIL sanction but ongoing procedure (detail)”.
                    </p>
                    <p>
                        <strong>Sanction details:</strong> date, authority, and the breach sanctioned. Be brief (e.g.
                        “cookies breach”, “transparency breach”).
                    </p>
                    <p>Useful sites:</p>
                    <ul className="guide-ul">
                        <li><Ext href="https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil">Sanctions issued by the CNIL</Ext></li>
                        <li>
                            <Ext href="https://www.legifrance.gouv.fr/search">Légifrance</Ext>: click “Filter” → “By
                            collection” → check “CNIL” → “By type of decision” → “Sanctions”, then enter the company
                            name.
                        </li>
                    </ul>
                    <Figure
                        src={`${IMG}/legifrance-recherche.webp`}
                        alt="Filtered search on Légifrance"
                        caption="Légifrance: filter by the “CNIL” collection and the “Sanctions” type."
                    />

                    <h3 className="guide-h3">b. Data transfer policy</h3>
                    <p>
                        Check the box if the company states that data may be transferred to countries other than France.
                        This part is tricky: few companies clearly state their transfers and sub-processors — which
                        reveals their lack of transparency.
                    </p>
                    <p>
                        The information is found in the privacy policy, the transfer policy (if any), the terms of use,
                        or the cookie policy. Often scattered.
                    </p>
                    <Figure
                        src={`${IMG}/blablacar-transfert.webp`}
                        alt="Excerpt from the BlaBlaCar privacy policy about transfers"
                        caption="BlaBlaCar example: a mention of transfers to “Third Countries” in the privacy policy."
                    />
                    <Tip>
                        If transfers outside the EU are stated without naming the countries, leave “Destination
                        countries” empty and note “Data transfers outside the EU, countries unspecified” in the
                        additional comments. You can also ask the DPO for these details.
                    </Tip>

                    <h3 className="guide-h3">c. Storage outside the EU</h3>
                    <p>
                        Check the box if data may be transferred outside the European Union. Often implicit: companies
                        mention “partners” without saying where they are. When in doubt, check the box or ask the Unlock
                        team on Framateam.
                    </p>

                    <h3 className="guide-h3">d. Transfer destination countries</h3>
                    <p>
                        Select the countries mentioned in the document covering transfers and/or the privacy policy.
                    </p>

                    <h3 className="guide-h3">e. Privacy policy URL</h3>
                    <p>
                        Enter the document URL. <strong>English version:</strong> only if it exists on the site,
                        otherwise leave it empty.
                    </p>

                    <h3 className="guide-h3">f. Privacy policy quote</h3>
                    <p>
                        Paste only the excerpt about <strong>data transfers</strong> (5 lines max). No need to quote a
                        generic paragraph about collection: it adds nothing to the analysis.
                    </p>
                    <Tip>
                        <strong>English version:</strong> use the English policy if it exists, otherwise a translator
                        such as DeepL — proofreading the result.
                    </Tip>
                </section>

                {/* V */}
                <section id="alternatives" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Sparkles className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">V.</span> Recommended alternatives</span>
                    </h2>
                    <p>
                        An alternative is a company offering substantially the same services, but more protective of its
                        users&apos; data, more sovereign or more free/open.
                    </p>
                    <Figure
                        src={`${IMG}/exemples-alternatives.webp`}
                        alt="Examples of more data-respectful alternatives"
                        caption="Examples: Signal over WhatsApp, PeerTube over YouTube, Proton over Gmail…"
                    />
                </section>

                {/* VI */}
                <section id="application-mobile" className="guide-sec">
                    <h2 className="guide-h2">
                        <span className="guide-h2-ic"><Smartphone className="w-[18px] h-[18px]" /></span>
                        <span><span className="guide-h2-num">VI.</span> Mobile application</span>
                    </h2>

                    <h3 className="guide-h3">a. Application name</h3>
                    <p>
                        Enter the name as it appears on the Play Store or App Store. For BlaBlaCar: “BlaBlaCar: Bus,
                        Train, Carpool”.
                    </p>
                    <Figure
                        src={`${IMG}/playstore-blablacar.webp`}
                        alt="BlaBlaCar listing on the Google Play Store"
                        caption="Use the exact name shown on the store."
                    />

                    <h3 className="guide-h3">b. Play Store / App Store link</h3>
                    <p>
                        Enter the application&apos;s address. Right-click the app name → “Copy link address”. For
                        BlaBlaCar:{" "}
                        <Ext href="https://play.google.com/store/apps/details?id=com.comuto">play.google.com/store/apps/details?id=com.comuto</Ext>.
                    </p>
                    <Figure
                        src={`${IMG}/playstore-copier-lien.webp`}
                        alt="Context menu: Copy link address"
                        caption="Right-click → “Copy link address”."
                    />
                </section>
            </>
        ),
    },
};

export default function GuidePage({ lang = "fr" }: GuidePageProps) {
    const s = STR[lang];
    const backHref = lang === "fr" ? "/contribuer" : "/contribute";
    const formHref = lang === "fr" ? "/contribuer/nouvelle-fiche" : "/contribute/new-form";

    const handlePrint = () => {
        if (typeof window !== "undefined") window.print();
    };

    return (
        <div
            className="min-h-screen guide-root"
            style={{ background: "var(--slate-50)", fontFamily: "var(--font-text)" }}
        >
            {/* Hero */}
            <section
                className="guide-hero"
                style={{
                    background: "linear-gradient(180deg, var(--indigo-50), #fff)",
                    borderBottom: "1px solid var(--slate-200)",
                }}
            >
                <div className="mx-auto" style={{ maxWidth: 880, padding: "36px 24px 32px" }}>
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-1.5 guide-noprint"
                        style={{
                            fontSize: 13.5,
                            color: "var(--indigo-700)",
                            textDecoration: "none",
                            marginBottom: 14,
                        }}
                    >
                        <ArrowLeft className="w-[15px] h-[15px]" />
                        {s.back}
                    </Link>

                    <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                        <span className="umd-acc-ic">
                            <BookOpen className="w-[18px] h-[18px]" />
                        </span>
                        <h1 className="umd-heading-2" style={{ margin: 0 }}>
                            {s.heroTitle}
                        </h1>
                    </div>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--fg2)", lineHeight: 1.6 }}>
                        {s.heroLead}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 guide-noprint" style={{ marginTop: 20 }}>
                        <button type="button" onClick={handlePrint} className="umd-btn umd-btn-primary">
                            <Printer className="w-4 h-4" />
                            {s.print}
                        </button>
                        <Link href={formHref} className="umd-btn umd-btn-outline">
                            <Building2 className="w-4 h-4" />
                            {s.fillForm}
                        </Link>
                    </div>
                </div>
            </section>

            <div className="mx-auto" style={{ maxWidth: 880, padding: "28px 24px 80px" }}>
                {/* Sommaire */}
                <nav className="umd-card guide-toc" style={{ padding: 20, marginBottom: 28 }}>
                    <h2
                        className="flex items-center gap-2"
                        style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "var(--fg1)" }}
                    >
                        <Search className="w-[18px] h-[18px]" style={{ color: "var(--indigo-700)" }} />
                        {s.tocTitle}
                    </h2>
                    <ol className="guide-toc-list">
                        {s.toc.map((entry) => (
                            <li key={entry.id}>
                                <a href={`#${entry.id}`}>
                                    <span className="guide-toc-num">{entry.n}</span>
                                    {entry.label}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                {s.body}

                {/* CTA + crédits */}
                <div className="umd-card guide-cta guide-noprint" style={{ padding: 24, marginTop: 8 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "var(--fg1)" }}>
                        {s.ctaTitle}
                    </p>
                    <p style={{ margin: "6px 0 16px", fontSize: 14, color: "var(--fg2)" }}>
                        {s.ctaBody}
                    </p>
                    <Link href={formHref} className="umd-btn umd-btn-primary">
                        <Building2 className="w-4 h-4" />
                        {s.ctaButton}
                    </Link>
                </div>

                <p className="guide-credits">{s.credits}</p>
            </div>

            <style jsx global>{`
                .guide-h2 {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 21px;
                    font-weight: 700;
                    color: var(--fg1);
                    margin: 0 0 14px;
                    scroll-margin-top: 24px;
                }
                .guide-sec {
                    margin-bottom: 40px;
                    scroll-margin-top: 24px;
                }
                .guide-h2-ic {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: var(--umd-radius-md, 10px);
                    background: var(--indigo-50);
                    color: var(--indigo-700);
                    flex-shrink: 0;
                }
                .guide-h2-num {
                    color: var(--indigo-700);
                    margin-right: 4px;
                }
                .guide-h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--fg1);
                    margin: 24px 0 8px;
                }
                .guide-sec p {
                    font-size: 15px;
                    line-height: 1.7;
                    color: var(--fg2);
                    margin: 0 0 12px;
                }
                .guide-ul {
                    margin: 0 0 12px;
                    padding-left: 22px;
                    font-size: 15px;
                    line-height: 1.7;
                    color: var(--fg2);
                    list-style: disc;
                }
                .guide-ul li {
                    margin-bottom: 4px;
                }
                .guide-quote {
                    border-left: 3px solid var(--indigo-300, #a5b4fc);
                    background: var(--slate-50);
                    margin: 0 0 14px;
                    padding: 12px 16px;
                    font-style: italic;
                    font-size: 14.5px;
                    line-height: 1.65;
                    color: var(--fg2);
                    border-radius: 0 8px 8px 0;
                }
                .guide-tip {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    background: var(--amber-50, #fffbeb);
                    border: 1px solid var(--amber-200, #fde68a);
                    border-radius: var(--umd-radius-md, 10px);
                    padding: 12px 14px;
                    margin: 0 0 16px;
                    font-size: 14.5px;
                    line-height: 1.6;
                    color: var(--fg1);
                }
                .guide-fig {
                    margin: 4px 0 18px;
                }
                .guide-fig-img {
                    border: 1px solid var(--slate-200);
                    border-radius: var(--umd-radius-md, 10px);
                    display: block;
                }
                .guide-fig-cap {
                    font-size: 13px;
                    color: var(--fg3, #64748b);
                    margin-top: 8px;
                    font-style: italic;
                    text-align: center;
                }
                .guide-toc-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: grid;
                    gap: 6px;
                }
                .guide-toc-list a {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 7px 10px;
                    border-radius: 8px;
                    font-size: 14.5px;
                    color: var(--fg1);
                    text-decoration: none;
                    transition: background 0.15s;
                }
                .guide-toc-list a:hover {
                    background: var(--indigo-50);
                }
                .guide-toc-num {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 26px;
                    height: 26px;
                    border-radius: 7px;
                    background: var(--indigo-50);
                    color: var(--indigo-700);
                    font-weight: 700;
                    font-size: 12.5px;
                }
                .guide-cta {
                    background: linear-gradient(180deg, var(--indigo-50), #fff);
                }
                .guide-credits {
                    margin-top: 28px;
                    padding-top: 18px;
                    border-top: 1px solid var(--slate-200);
                    font-size: 13px;
                    color: var(--fg3, #64748b);
                    text-align: center;
                }

                /* ---- Impression ---- */
                @media print {
                    .guide-noprint,
                    .guide-noprint-ic {
                        display: none !important;
                    }
                    .guide-root {
                        background: #fff !important;
                    }
                    .guide-hero {
                        background: #fff !important;
                        border-bottom: 1px solid #ddd !important;
                    }
                    .guide-toc {
                        break-after: page;
                    }
                    .guide-sec {
                        break-inside: avoid-page;
                    }
                    .guide-fig,
                    .guide-tip,
                    .guide-quote {
                        break-inside: avoid;
                    }
                    .guide-fig-img {
                        max-height: 320px;
                        width: auto !important;
                        margin: 0 auto;
                    }
                    a[href]:not([href^="#"])::after {
                        content: " (" attr(href) ")";
                        font-size: 11px;
                        color: #555;
                        word-break: break-all;
                    }
                }
            `}</style>
        </div>
    );
}
