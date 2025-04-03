"use client";

import Image from "next/image";
import { Data } from "@/app/liste-applications/page";
import Link from "next/link";

export default function Card(props: Data) {
  let country: string;
  if (props.country_name === "United States of America") {
    country = "USA";
  } else {
    country = props.country_name || "";
  }

  const isNew =
    props.accessibility == 0 &&
    props.number_breach == 0 &&
    props.number_permission == 0 &&
    props.number_website == 1;

  return (
    <Link prefetch={false} href={`/liste-applications/${props.slug}`}>
     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-32 h-16">
            <Image
              fill
              src={props.logo}
              alt={`Logo de ${props.name}`}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">{country}</span>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              props.risk_level >= 3 ? 'bg-red-100 text-red-700' :
              props.risk_level >= 1 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              Risque : {(props.risk_level) == -1 ? "N/A" : props.risk_level}
            </div>
          </div>
        </div>
      </div>

       {!isNew && (
           <div className="p-6 space-y-4">
             <div className="space-y-3">
               <div className="flex flex-col">
                 <span className="text-sm text-gray-500">Note d'accessibilité</span>
                 <span className="font-medium">{props.accessibility}</span>
               </div>

               {props.last_update_breach && (
                   <div className="flex flex-col">
                     <span className="text-sm text-gray-500">Dernière violation</span>
                     <span className="font-medium text-red-600">
                {new Date(props.last_update_breach).toLocaleDateString("fr-FR")}
              </span>
                   </div>
               )}

               {props.number_account_impact && (
                   <div className="flex flex-col">
                     <span className="text-sm text-gray-500">Comptes impactés</span>
                     <span className="font-medium">{props.number_account_impact}</span>
                   </div>
               )}
             </div>

             {(props.contact_mail_delete || props.url_delete) && (
                 <div className="mt-6 pt-4 border-t border-gray-100">
                   <p className="text-sm font-semibold text-gray-900 mb-3">
                     Gestion de vos données
                   </p>

                   {props.contact_mail_delete && (
                       <div className="mb-3">
                         <p
                             className="group flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                         >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                           </svg>
                           <span className="group-hover:underline underline-offset-2">
                    {props.contact_mail_delete}
                  </span>
                         </p>
                       </div>
                   )}

                   {props.url_delete && (
                       <p
                           className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors"
                       >
                         <span>Gérer mes données</span>
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                         </svg>
                       </p>
                   )}
                 </div>
             )}
           </div>
       )}
    </div>
    </Link>
)
}

