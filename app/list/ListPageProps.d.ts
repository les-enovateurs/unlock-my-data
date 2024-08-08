// export type Data = {
//   id: number;
//   name: string;
//   img_src: string;
//   country: string;
//   country_img: string;
//   data_leak_counter: number;
//   last_incident: string;
//   score: string;
//   score_color: string;
//   shadow_color: string;
//   cookies_counter: number;
//   data_counter: number;
//   servers_location: string;
//   is_gafam: boolean;
//   is_easy_to_claim_data: boolean;
//   dpo_contact: string;
//   form_link: string;
// };


export type Data = {
  id: number;
  name: string;
  logo: string;
  score: number;
  country: string;
  country_iso: string;
  accessibility: number;
  contact_mail_delete: string;
  contact_mail_export: string;
  url_export: string;
  url_delete: string;
  last_update_breach: string;
  number_account_impact: string | null;
  number_website_cookie: number;
};