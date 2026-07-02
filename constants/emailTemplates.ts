/**
 * Email templates for GDPR requests (deletion — Art. 17, access/copy — Art. 15)
 * Eco-conception: Centralized strings, easier to maintain and translate
 */

export const EMAIL_TEMPLATES = {
  fr: {
    subject: "Demande de suppression de données personnelles (RGPD - Art. 17)",
    body: (serviceName: string) => `Madame, Monsieur,

En application de l'article 17.1 du Règlement général sur la protection des données (RGPD), je vous prie d'effacer de vos fichiers les données personnelles suivantes me concernant :

Toutes les données personnelles associées à mon compte et mon utilisation de ${serviceName}.

Je demande que ces informations soient supprimées car :

Je n'utilise plus ce service et souhaite exercer mon droit à l'effacement.

Vous voudrez bien également notifier cette demande d'effacement de mes données aux organismes auxquels vous les auriez communiquées (article 19 du RGPD).

Enfin, je vous prie de m'informer de ces éléments dans les meilleurs délais et au plus tard dans un délai d'un mois à compter de la réception de ce courrier (article 12.3 du RGPD).

À défaut de réponse de votre part dans les délais impartis ou en cas de réponse incomplète, je saisirai la Commission nationale de l'informatique et des libertés (CNIL) d'une réclamation.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
  },
  en: {
    subject: "Request for deletion of personal data (GDPR - Art. 17)",
    body: (serviceName: string) => `Dear Sir or Madam,

Under Article 17.1 of the General Data Protection Regulation (GDPR), I request that you erase my personal data associated with my account on ${serviceName}.

I request deletion because I no longer use this service and wish to exercise my right to erasure.

Please also notify any third parties to whom you have disclosed my data (Article 19 GDPR).

Please inform me of the actions taken within one month of receipt of this request (Article 12.3 GDPR).

If you fail to respond or provide an incomplete response, I will file a complaint with the competent data protection authority.

Sincerely.`,
  },
};

// GDPR access / copy request (Article 15) — get a copy of your personal data.
export const COPY_EMAIL_TEMPLATES = {
  fr: {
    subject: "Demande d'accès à mes données personnelles (RGPD - Art. 15)",
    body: (serviceName: string) => `Madame, Monsieur,

En application de l'article 15 du Règlement général sur la protection des données (RGPD), je souhaite obtenir une copie de l'ensemble des données personnelles me concernant que vous traitez dans le cadre de mon compte et de mon utilisation de ${serviceName}.

Je vous remercie de me communiquer notamment :
- les catégories de données traitées et leur origine ;
- les finalités du traitement ;
- les destinataires ou catégories de destinataires des données ;
- la durée de conservation envisagée ;
- le cas échéant, les transferts de ces données en dehors de l'Union européenne.

Je vous prie de me transmettre ces informations dans un format structuré, couramment utilisé et lisible par machine (article 20 du RGPD).

Conformément à l'article 12.3 du RGPD, je vous remercie de répondre à cette demande dans les meilleurs délais et au plus tard dans un délai d'un mois à compter de sa réception.

À défaut de réponse dans les délais impartis ou en cas de réponse incomplète, je saisirai la Commission nationale de l'informatique et des libertés (CNIL) d'une réclamation.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
  },
  en: {
    subject: "Request to access my personal data (GDPR - Art. 15)",
    body: (serviceName: string) => `Dear Sir or Madam,

Under Article 15 of the General Data Protection Regulation (GDPR), I request a copy of all personal data concerning me that you process in connection with my account and my use of ${serviceName}.

In particular, please provide me with:
- the categories of data processed and their source;
- the purposes of the processing;
- the recipients or categories of recipients of the data;
- the envisaged retention period;
- where applicable, any transfers of this data outside the European Union.

Please send me this information in a structured, commonly used and machine-readable format (Article 20 GDPR).

In accordance with Article 12.3 GDPR, please respond to this request as soon as possible and at the latest within one month of receipt.

If you fail to respond within the time limit or provide an incomplete response, I will file a complaint with the competent data protection authority.

Sincerely.`,
  },
};

export type EmailKind = "delete" | "copy";

export function getEmailTemplate(lang: string, serviceName: string, kind: EmailKind = "delete") {
  const source = kind === "copy" ? COPY_EMAIL_TEMPLATES : EMAIL_TEMPLATES;
  const template = source[lang as keyof typeof source] || source.fr;
  return {
    subject: template.subject,
    body: template.body(serviceName),
  };
}

export interface WebmailLink {
  name: string;
  href: string;
}

/**
 * Pre-filled web compose URLs for the main webmail providers.
 * Open in a new tab so they don't replace the Unlock My Data window.
 */
export function webmailLinks(to: string, subject: string, body: string): WebmailLink[] {
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  const r = encodeURIComponent(to);
  return [
    { name: "Gmail", href: `https://mail.google.com/mail/?view=cm&fs=1&to=${r}&su=${s}&body=${b}` },
    { name: "Outlook", href: `https://outlook.live.com/mail/0/deeplink/compose?to=${r}&subject=${s}&body=${b}` },
  ];
}

