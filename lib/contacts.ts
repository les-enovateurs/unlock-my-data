export type ContactPurpose = "export" | "delete";

export interface ServiceContact {
  type: "email" | "postal";
  value: string;
  purposes: ContactPurpose[];
  comment_fr?: string;
  comment_en?: string;
}

type WithContacts = { contacts?: ServiceContact[] | null } | null | undefined;

export const contactsFor = (service: WithContacts, purpose: ContactPurpose): ServiceContact[] =>
  (service?.contacts ?? []).filter((contact) => contact.purposes?.includes(purpose));

export const firstEmail = (service: WithContacts, purpose: ContactPurpose): string | undefined =>
  contactsFor(service, purpose).find((contact) => contact.type === "email")?.value;

export const contactComment = (contact: ServiceContact, lang: string): string | undefined =>
  lang === "en" ? contact.comment_en : contact.comment_fr;
