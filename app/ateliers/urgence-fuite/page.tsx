import React from 'react';
import Link from 'next/link';
import {
    ShieldAlert,
    AlertTriangle,
    Lock,
    Eye,
    ExternalLink,
    ArrowLeft,
    PenTool,
    Clock,
    ShieldCheck,
    MousePointerClick,
    Key,
    User,
    ArrowRight,
    Globe,
    BookOpenText
} from 'lucide-react';

export default function UrgenceFuitePage() {
    return (
        <div className="bg-base-100 text-base-content font-sans">
            {/* Header / Nav */}
            <div className="container mx-auto px-6 py-8">
                <Link href="/ateliers" className="btn btn-ghost gap-2 pl-0 hover:bg-transparent text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux ateliers
                </Link>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-6 max-w-4xl mb-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                        <div className="badge badge-info gap-2 text-white font-bold mb-4 p-4">
                            <ShieldCheck className="w-4 h-4" />
                            Atelier Pratique
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Mes données ont fuité ? <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                                Réagir et Sécuriser
                            </span>
                        </h1>
                        <p className="text-xl text-base-content/70 mb-8 leading-relaxed">
                            Ce guide interactif vous accompagne pas-à-pas pour sécuriser vos comptes. Que vous ayez reçu une alerte ou que vous souhaitiez simplement vérifier.
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm font-medium text-base-content/60">
                            <div className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-full">
                                <Clock className="w-4 h-4" />
                                Durée : 1h
                            </div>
                            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full border border-yellow-200">
                                <PenTool className="w-4 h-4" />
                                Pré-requis indispensable : Une feuille et un stylo
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STEP 1: IDENTIFICATION */}
            <section className="container mx-auto px-6 max-w-4xl mb-24">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xl shrink-0">
                        1
                    </div>
                    <h2 className="text-3xl font-bold">Identifier votre situation</h2>
                </div>

                <div className="space-y-8 mb-12">
                    {/* Scenario A */}
                    <div className="card bg-base-100 shadow-lg border border-base-200">
                        <div className="card-body p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl mb-2 text-primary flex items-center gap-2">
                                        <ShieldAlert className="w-5 h-5" />
                                        Situation A : J&apos;ai reçu une alerte
                                    </h3>
                                    <p className="text-base-content/70 mb-4">
                                        Vous avez reçu un email ou un SMS officiel vous informant d&apos;une fuite.
                                    </p>
                                    <div className="bg-base-200/50 p-4 rounded-lg text-sm border-l-4 border-error italic">
                                        <span className="font-bold not-italic block mb-1">Exemple de message :</span>
                                        &quot;Bonjour, nous avons détecté un accès non autorisé à nos systèmes. Vos données personnelles (Nom, Email) sont concernées...&quot;
                                    </div>
                                </div>
                                <div className="badge badge-error text-white font-bold p-3 h-auto">Cas Confirmé</div>
                            </div>
                        </div>
                    </div>

                    {/* Scenario B */}
                    <div className="card bg-base-100 shadow-lg border border-base-200">
                        <div className="card-body p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl mb-2 text-orange-500 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Situation B : J&apos;ai un doute
                                    </h3>
                                    <p className="text-base-content/70 mb-4">
                                        Pas d&apos;alerte officielle, mais vous voulez vérifier si votre email apparait dans des bases de données piratées.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-base-200 p-4 rounded-xl">
                                        <div className="flex-1 w-full">
                                            <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="btn btn-warning text-orange-500 btn-outline w-full gap-2">
                                                Vérifier sur Have I Been Pwned <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <p className="text-xs text-base-content/50 mt-2 italic">
                                                Service sécurisé de référence. Entrez votre email, le site vous dira si vos données ont déjà fuité.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="badge badge-warning font-bold p-3 h-auto">Vérification</div>
                            </div>
                        </div>
                    </div>

                    {/* Scenario C */}
                    <div className="card bg-base-100 shadow-lg border border-base-200">
                        <div className="card-body p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl mb-2 text-neutral flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        Situation C : Je m&apos;exerce
                                    </h3>
                                    <p className="text-base-content/70 mb-4">
                                        Rien à signaler ? C&apos;est le meilleur moment pour agir. Choisissez un service critique pour dérouler l&apos;atelier.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="badge badge-outline">Gmail</span>
                                        <span className="badge badge-outline">Facebook</span>
                                        <span className="badge badge-outline">Amazon</span>
                                    </div>
                                </div>
                                <div className="badge badge-neutral text-white font-bold p-3 h-auto">Exercice</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-base-200 p-6 rounded-xl border border-base-300">
                    <h4 className="font-bold flex items-center gap-2 mb-4 text-primary">
                        <PenTool className="w-5 h-5" />
                        Action : Préparez votre feuille de suivi
                    </h4>
                    <p className="text-sm mb-4 opacity-70">
                        Pour ne pas vous perdre, recopiez ce tableau. <br/>
                        En ligne 1, notez le service concerné (Scenario A & C) ou le <strong>résultat de votre recherche</strong> (Scenario B : notez le nom du site qui apparait en rouge, ou &quot;RAS&quot; si tout est vert).
                    </p>

                    <div className="overflow-x-auto bg-base-100 rounded-lg shadow-sm border border-base-300">
                        <table className="table w-full text-left">
                            <thead className="bg-base-200 text-base-content uppercase text-xs font-bold">
                            <tr>
                                <th className="p-3">Nom du Service / Résultat</th>
                                <th className="p-3 display-none md:table-cell">Risque</th>
                                <th className="p-3 text-center">Nouveau Mot de passe ? (Oui/Non)</th>
                                <th className="p-3">Date & Heure</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            <tr className="bg-blue-50/50 font-semibold border-b border-base-200">
                                <td className="p-3 text-primary font-bold">
                                    1. [SERVICE / RÉSULTAT Have I Been Pawned]
                                </td>
                                <td className="p-3 hidden md:table-cell">Origine</td>
                                <td className="p-3 text-center">
                                    <div className="border border-blue-300 w-6 h-6 mx-auto rounded bg-white"></div>
                                </td>
                                <td className="p-3 text-base-content/50 italic">.../... à ...h...</td>
                            </tr>
                            <tr className="border-b border-base-200">
                                <td className="p-3 font-medium">2. Email (Gmail/Outlook...)</td>
                                <td className="p-3 hidden md:table-cell">Critique</td>
                                <td className="p-3 text-center">
                                    <div className="border border-base-300 w-6 h-6 mx-auto rounded"></div>
                                </td>
                                <td className="p-3 text-base-content/50 italic">.../...</td>
                            </tr>
                             <tr className="border-b border-base-200">
                                <td className="p-3 font-medium">3. Autre compte avec mème mot de passe...</td>
                                <td className="p-3 hidden md:table-cell">Faible</td>
                                <td className="p-3 text-center">
                                    <div className="border border-base-300 w-6 h-6 mx-auto rounded"></div>
                                </td>
                                <td className="p-3 text-base-content/50 italic">.../...</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* STEP 2: COMPRENDRE */}
            <section className="container mx-auto px-6 max-w-4xl mb-24">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xl shrink-0">
                        2
                    </div>
                    <h2 className="text-3xl font-bold">Comprendre les risques</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Definition */}
                    <div className="card bg-base-200">
                        <div className="card-body">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <InfoIcon className="w-5 h-5" />
                                C&apos;est quoi une &quot;fuite&quot; ?
                            </h3>
                            <p className="text-sm opacity-80">
                                C&apos;est une perte, altération ou divulgation non autorisée de données personnelles.
                                Elle peut être <strong>accidentelle</strong> (panne serveur, erreur d&apos;envoi) ou <strong>malveillante</strong> (cyberattaque).
                            </p>
                        </div>
                    </div>

                    {/* How to know */}
                    <div className="card bg-base-200">
                        <div className="card-body">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <Eye className="w-5 h-5" />
                                Comment le savoir ?
                            </h3>
                            <p className="text-sm opacity-80">
                                Selon l&apos;article 34 du RGPD, l&apos;entreprise <strong>DOIT vous informer</strong> s&apos;il y a un risque élevé (Email, SMS, ou bandeau sur leur site).
                                L&apos;alerte doit préciser : nature de la fuite, conséquences et contact DPO.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Alert - Why it matters */}
                <div className="mt-8 bg-error/5 border border-error/20 rounded-xl p-6">
                    <h4 className="font-bold text-error mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Pourquoi c&apos;est grave ? (Stats CNIL / Harris 2024)
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-black text-error">41%</div>
                            <div className="text-xs uppercase tracking-wide opacity-70 mt-1">des français touchés</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-error">740€</div>
                            <div className="text-xs uppercase tracking-wide opacity-70 mt-1">préjudice moyen</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-error">915€</div>
                            <div className="text-xs uppercase tracking-wide opacity-70 mt-1">si fraude à l&apos;identité</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Comment un pirate exploite une liste identifiants */}
            <section className="container mx-auto px-6 max-w-4xl mb-24">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xl shrink-0">
                        <BookOpenText className="w-5 h-5"  />
                    </div>
                    <h2 className="text-3xl font-bold">Comment agit un pirate après une fuite</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="card bg-base-200">
                        <div className="card-body">
                            <h3 className="font-bold flex items-center gap-2 mb-2">Étapes </h3>
                            <ul className="list-decimal list-inside text-sm opacity-90 space-y-2">
                                <li>Le pirate récupère une liste email:motdepasse.</li>
                                <li>Il teste ces paires automatiquement sur beaucoup de sites (Amazon, banque, email).</li>
                                <li>Quand une paire marche, il prend le contrôle du compte (change le mot de passe).</li>
                                <li>Il cherche ensuite l&apos;email pour réinitialiser d&apos;autres comptes.</li>
                                <li>Enfin, il vend les comptes valides ou les utilise pour voler de l&apos;argent ou arnaquer vos contacts.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-base-200">
                        <div className="card-body">
                            <h3 className="font-bold flex items-center gap-2 mb-2">Pourquoi c&apos;est dangereux et que faire</h3>
                            <ul className="list-disc list-inside text-sm opacity-90 space-y-2">
                                <li>Un seul compte compromis peut permettre d&apos;accéder à beaucoup d&apos;autres.</li>
                                <li>Les attaques sont rapides et automatisées : il faut agir vite.</li>
                                <li>Priorisez : changez d&apos;abord votre email, puis la banque, impôts et santé.</li>
                                <li>Déconnectez tous les appareils et activez la double connexion (2FA).</li>
                                <li>Utilisez un coffre (gestionnaire de mots de passe) pour avoir des mots uniques.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* STEP 3: ACTIONS */}
            <section className="container mx-auto px-6 max-w-4xl mb-24">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xl shrink-0">
                        3
                    </div>
                    <h2 className="text-3xl font-bold">Checklist d&apos;actions</h2>
                </div>

                <div className="space-y-6">
                    {/* Action 1 */}
                    <div className="collapse collapse-plus bg-base-100 border border-base-200 shadow-sm">
                        <input type="checkbox" name="my-accordion-1" defaultChecked />
                        <div className="collapse-title text-xl font-medium flex items-center gap-4">
                            <Lock className="w-6 h-6 text-primary" />
                            1. Changez vos mots de passe
                        </div>
                        <div className="collapse-content">
                            <ul className="steps steps-vertical w-full">
                                <li className="step step-primary">Connectez-vous au site concerné par la fuite.</li>
                                <li className="step step-warning text-left py-2">
                                    <div className="w-full text-left">
                                        <div className="font-bold text-orange-600 uppercase">Changez le mot de passe</div>
                                        <div className="text-base font-normal mt-1">Action à réaliser dans la mesure du possible sur votre ordinateur ou téléphone connecté sur votre box internet.</div>
                                        <div className="text-base font-normal mt-1">Soit depuis votre compte en étant connecté soit avec la fonctionnalité de mot de passe oublié</div>
                                    </div>
                                </li>
                            </ul>

                            {/* Section Visuelle : Mot de passe oublié */}
                            <div className="bg-base-200/50 p-6 rounded-xl border border-base-300 mb-8">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <MousePointerClick className="w-5 h-5 text-primary" />
                                    L&apos;astuce &quot;Mot de passe oublié&quot;
                                </h4>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="text-sm space-y-3">
                                        <p>C&apos;est souvent le moyen le plus <strong>rapide</strong> et le plus <strong>sûr</strong> pour changer un mot de passe en urgence.</p>
                                        <ol className="list-decimal list-inside space-y-1 opacity-80">
                                            <li>Cliquez sur le lien &quot;Mot de passe oublié&quot; sur la page de connexion.</li>
                                            <li>Entrez votre email.</li>
                                            <li>Cliquez sur le lien reçu par email.</li>
                                            <li>Définissez le nouveau mot de passe.</li>
                                        </ol>
                                    </div>
                                    {/* Mockup Formulaire */}
                                    <div className="mockup-window border border-base-300 bg-base-100 shadow-sm max-w-xs mx-auto">
                                        <div className="flex flex-col justify-center px-4 py-8 bg-base-100">
                                            <div className="text-center font-bold mb-4">Connexion</div>
                                            <input type="text" placeholder="Email" className="input input-bordered input-sm w-full mb-2" disabled />
                                            <input type="password" placeholder="••••••••" className="input input-bordered input-sm w-full mb-2" disabled />
                                            <button className="btn btn-primary btn-sm w-full mb-2">Se connecter</button>
                                            <div className="text-xs text-blue-500 underline cursor-pointer hover:text-blue-700 font-bold decoration-2">
                                                Mot de passe oublié ?
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Visuelle : Gestionnaire de Mot de Passe */}
                            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">
                                    <Key className="w-5 h-5" />
                                    Comprendre le Gestionnaire de Mots de Passe
                                </h4>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    {/* Diagramme Visuel */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                        <div className="flex justify-center items-center gap-4 mb-4">
                                           <div className="flex flex-col items-center gap-2">
                                               <User className="w-8 h-8 text-base-content" />
                                               <span className="text-xs font-bold">Vous</span>
                                           </div>
                                           <ArrowRight className="w-4 h-4 text-gray-400" />
                                           <div className="flex flex-col items-center gap-2 p-3 bg-primary text-primary-content rounded-lg relative">
                                               <Lock className="w-6 h-6" />
                                               <span className="text-xs font-bold w-20">Coffre-fort (KeePass/Bitwarden)</span>
                                           </div>
                                           <ArrowRight className="w-4 h-4 text-gray-400" />
                                           <div className="flex flex-col gap-1">
                                               <div className="badge badge-outline text-[10px] w-20">Facebook</div>
                                               <div className="badge badge-outline text-[10px] w-20">Gmail</div>
                                               <div className="badge badge-outline text-[10px] w-20">Amazon</div>
                                           </div>
                                        </div>
                                        <p className="text-xs italic text-gray-500">
                                            Vous ne retenez qu&apos;<strong>UN SEUL</strong> mot de passe (celui du coffre). Le coffre retient tous les autres (qui sont très compliqués) pour vous.
                                        </p>
                                    </div>

                                    <div className="text-sm space-y-3">
                                        <p className="font-semibold">Pourquoi l&apos;utiliser ?</p>
                                        <ul className="list-disc list-inside opacity-80 space-y-1">
                                            <li>Plus besoin de retenir 50 mots de passe.</li>
                                            <li>Chaque site a un code impossible à deviner (ex: <code className="bg-base-200 px-1 rounded">Xy9#mP2$vL</code>).</li>
                                            <li>Si un site fuite, seul ce site est touché.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section : Stockage Navigateur */}
                            <div className="mt-6 bg-warning/10 p-6 rounded-xl border border-warning/30">
                                <h4 className="font-bold mb-3 flex items-center gap-2 text-warning-content">
                                    <Globe className="w-5 h-5" />
                                    Et si je garde mes mots de passe dans le navigateur ?
                                </h4>
                                <p className="text-sm mb-4">
                                    C&apos;est très pratique : le navigateur peut retenir vos mots de passe et remplir les formulaires. Mais c&apos;est moins sûr que d&apos;utiliser un vrai coffre. Voici pourquoi, et quoi faire.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-base-100 p-4 rounded-lg border border-base-200">
                                        <div className="font-bold text-red-600 mb-2 uppercase text-[11px] tracking-wide">Risques simples</div>
                                        <ul className="list-disc list-inside space-y-2 opacity-90">
                                            <li><strong>Quelqu&apos;un peut voir vos mots de passe</strong> si vous prêtez l&apos;ordinateur ou le laissez ouvert.</li>
                                            <li><strong>Un virus peut les voler</strong> et les envoyer à des pirates.</li>
                                            <li><strong>Si votre compte Google est piraté</strong> (pour Chrome), l&apos;attaquant voit tout ce qui est synchronisé.</li>
                                            <li><strong>Une extension mauvaise</strong> ou une faille peut aussi prendre vos mots de passe.</li>
                                        </ul>
                                    </div>

                                    <div className="bg-base-100 p-4 rounded-lg border border-base-200 flex flex-col justify-center">
                                        <div className="font-bold text-primary mb-2">En bref</div>
                                        <p className="opacity-90">Le navigateur est pratique pour les petits comptes. Pour les comptes importants, utilisez un coffre et activez la double connexion.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* New: 1bis - Comptes réutilisés & modus operandi hacker */}
                    <div className="collapse collapse-plus bg-base-100 border border-base-200 shadow-sm">
                         <input type="checkbox" name="my-accordion-1" />
                         <div className="collapse-title text-xl font-medium flex items-center gap-4">
                             <Lock className="w-6 h-6 text-primary" />
                             2. Comptes où vous avez utilisé le même mot de passe
                         </div>
                         <div className="collapse-content space-y-4">
                             <ol className="list-decimal list-inside space-y-2 text-sm opacity-90">
                                 <li><strong>Identifiez les comptes réutilisés</strong> sur votre feuille.</li>
                                 <li><strong>Changez</strong> le mot de passe sur les comptes critiques (email, banque, impôts, santé) en priorité (dans la mesure du possible sur votre ordinateur ou téléphone connecté sur votre box internet).</li>
                             </ol>

                            <div className="bg-base-100 p-4 rounded-lg border border-base-300">
                                <h5 className="font-bold mb-2">Petite liste exhaustives des services que vous utilisez peut-être</h5>
                                <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
                                    <li>Messagerie : Gmail, Outlook, Yahoo</li>
                                    <li>Banque / Paiement : accès banque en ligne, PayPal</li>
                                    <li>Impôts & services administratifs : impots.gouv.fr, Ameli, CAF</li>
                                    <li>Réseaux sociaux : Facebook, Instagram, X (Twitter), LinkedIn</li>
                                    <li>Commerce en ligne : Amazon, eBay, marketplaces</li>
                                    <li>Stockage et documents : Google Drive, Dropbox, iCloud</li>
                                    <li>Opérateurs télécom et messagerie mobile</li>
                                    <li>Services professionnels / payés : compte pro, plateforme RH, Pajemploi</li>
                                </ul>
                                <p className="text-sm mt-2 opacity-80">Écrivez ces services sur votre feuille et cochez-les une fois le mot de passe changé.</p>
                            </div>
                        </div>
                    </div>

                    {/* Action 2 */}
                    <div className="collapse collapse-plus bg-base-100 border border-base-200 shadow-sm">
                        <input type="checkbox" name="my-accordion-1" />
                        <div className="collapse-title text-xl font-medium flex items-center gap-4">
                            <Eye className="w-6 h-6 text-primary" />
                            3. Surveillance des comptes
                        </div>
                        <div className="collapse-content">
                            <div className="p-4 bg-base-200/50 rounded-lg space-y-4">
                                <div>
                                    <h4 className="font-bold">Fuite bancaire (IBAN/CB) ?</h4>
                                    <p className="text-sm">Surveillez vos comptes. Au moindre mouvement suspect : <span className="font-bold text-error">Opposition immédiate</span>. Informez votre banque de la fuite pour qu&apos;ils augmentent la vigilance.</p>
                                </div>
                                <div className="divider"></div>
                                <div>
                                    <h4 className="font-bold">Activité suspecte ?</h4>
                                    <p className="text-sm">Vérifiez l&apos;historique de connexion, les commandes récentes, ou les messages envoyés depuis votre compte.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action 3 */}
                    <div className="collapse collapse-plus bg-base-100 border border-base-200 shadow-sm">
                        <input type="checkbox" name="my-accordion-1" />
                        <div className="collapse-title text-xl font-medium flex items-center gap-4">
                            <ShieldAlert className="w-6 h-6 text-primary" />
                            4. Vigilance SPAM & Arnaques
                        </div>
                        <div className="collapse-content">
                            <p className="text-sm mb-4">
                                Après une fuite, vos données (email, tel) sont vendues à des escrocs. Vous allez recevoir des tentatives d&apos;arnaque &quot;crédibles&quot;.
                            </p>
                            <div className="alert alert-warning text-black">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Ne validez JAMAIS d&apos;opérations bancaires urgentes par téléphone. En cas de doute, raccrochez et rappelez le numéro officiel de votre banque.</span>
                            </div>
                        </div>
                    </div>

                    {/* NOUVEAU: Contribuer - Signaler la fuite à la communauté */}
                    <div className="collapse collapse-plus bg-base-100 border border-base-200 shadow-sm">
                        <input type="checkbox" name="my-accordion-1" />
                        <div className="collapse-title text-xl font-medium flex items-center gap-4">
                            <ExternalLink className="w-6 h-6 text-primary" />
                            Contribuer : Signaler la fuite à la communauté
                        </div>
                        <div className="collapse-content">
                            <p className="text-sm mb-4">
                                Si vous le pouvez, signalez cette fuite pour prévenir d&apos;autres personnes et aider la communauté à se protéger. Ne partagez jamais d&apos;informations sensibles (mot de passe, copie de pièce d&apos;identité) dans le signalement public.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex-1 text-sm opacity-80">
                                    <p>Le signalement nous permet de centraliser les incidents, d&apos;alerter d&apos;autres utilisateurs et d&apos;améliorer les ressources d&apos;aide.</p>
                                </div>
                                <div>
                                    <Link href="/contribuer/signaler-fuite/" className="btn btn-success text-white">
                                        Signaler une fuite
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STEP 3: BLINDAGE (Prevention) */}
            <section className="bg-primary text-primary-content py-20 rounded-t-3xl mt-12">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8" />
                        Ne plus subir : le Kit de Survie
                    </h2>
                    <p className="text-lg opacity-90 mb-12">Voici les réflexes à mettre en place dès maintenant pour que la prochaine fuite ait moins d&apos;impact.</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="card bg-base-100 text-base-content">
                            <div className="card-body">
                                <h3 className="card-title text-lg">1. Justificatifs sécurisés</h3>
                                <p className="text-sm">N&apos;envoyez plus jamais votre CNI ou RIB &quot;nus&quot;. Utilisez <span className="font-bold">Filigrane Facile</span> (service de l&apos;État) pour ajouter un filigrane de protection.</p>
                                <div className="card-actions justify-end mt-4">
                                    <a href="https://filigrane.beta.gouv.fr/" target="_blank" className="btn btn-primary btn-sm">Filigrane Facile</a>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 text-base-content">
                            <div className="card-body">
                                <h3 className="card-title text-lg">2. Hygiène des mots de passe</h3>
                                <p className="text-sm">Impossible de tout retenir ? C&apos;est normal. Utilisez un gestionnaire de mots de passe certifié par l&apos;ANSSI.</p>
                                <div className="flex gap-2 mt-2">
                                    <div className="badge badge-outline">KeePass</div>
                                    <div className="badge badge-outline">LockPass</div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 text-base-content">
                            <div className="card-body">
                                <h3 className="card-title text-lg">3. Paiements uniques</h3>
                                <p className="text-sm">Sur les sites de commerce, n&apos;enregistrez pas votre carte. Utilisez des <span className="font-bold">&quot;e-cartes bleues&quot;</span> (numéro virtuel à usage unique) proposées par votre banque.</p>
                            </div>
                        </div>

                         <div className="card bg-base-100 text-base-content">
                            <div className="card-body">
                                <h3 className="card-title text-lg">4. Double Authentification (2FA)</h3>
                                <p className="text-sm">Activez-la partout où c&apos;est possible. Même si votre mot de passe fuite, le pirate ne pourra pas entrer sans votre téléphone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* References Accordion */}
             <section className="bg-base-300 py-12">
                 <div className="container mx-auto px-6 max-w-4xl">
                     <div className="collapse collapse-arrow bg-base-200">
                         <input type="checkbox" />
                         <div className="collapse-title font-medium">
                             Sources et Références Officielles
                         </div>
                         <div className="collapse-content text-xs opacity-70">
                             <ul className="space-y-2 pt-2">
                                 <li>Règlement (UE) 2016/679 (RGPD) - Articles 33 & 34</li>
                                 <li>CNIL : Sondage &quot;Les Français, leurs données et le consentement&quot; (Harris Interactive, Déc 2024)</li>
                                 <li>ANSSI : Liste des produits certifiés</li>
                                 <li>Cybermalveillance.gouv.fr : Fiches réflexes fuite de données</li>
                                 <li>Usine Digitale & Communiqués officiels : FFF, France Travail (Oct 2025), Pajemploi (Nov 2025), Opérateurs télécom.</li>
                             </ul>
                         </div>
                     </div>
                 </div>
             </section>
        </div>
    );
}

function InfoIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
    )
}
