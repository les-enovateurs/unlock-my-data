/**
 * Email templates for GDPR deletion requests
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

export function getEmailTemplate(lang: string, serviceName: string) {
  const template = EMAIL_TEMPLATES[lang as keyof typeof EMAIL_TEMPLATES] || EMAIL_TEMPLATES.fr;
  return {
    subject: template.subject,
    body: template.body(serviceName),
  };
}

