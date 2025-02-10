"use client";

import Image from "next/image";
import { Data } from "../app/list/ListPageProps";

export default function Card(props: Data) {
  let country: string;
  if (props.country === "United States of America") {
    country = "USA";
  } else {
    country = props.country;
  }

  return (
    <article className="max-w-300 min-h-550 border-2 border-blue rounded-md p-2">
      <header className="flex items-center gap-4">

        <Image
          width={120}
          height={60}
          src={props.logo}
          alt={`Logo de ${props.name}`}
          className="w-full h-auto"
        />
        <div className="w-1/2">
          <p className="text-color3 font-semibold">{country}</p>
          <p className="font-semibold">
            <span className="text-color3 font-semibold">Score: </span>
            {props.score}

          </p>
        </div>
      </header>
      <div className="flex flex-col gap-2">
        <p className="font-semibold">
          <span className="text-color3 font-semibold">
            Note d'accessibilité de vos données {" "}
          </span>
          <div className="w-full font-semibold text-center">
          {props.accessibility}
          </div>
        </p>

        {props.last_update_breach && (
          <p className="font-semibold">
            <span className="text-color3 font-semibold">
              Dernière violation des données {" "}
            </span>

          <div className="w-full font-semibold text-center">
          {props.last_update_breach}
          </div>
        </p>



        )}
        {props.number_account_impact? (
        <p className="font-semibold">
          <span className="text-color3 font-semibold">

            Nombre de comptes impactés {" "}
          </span>
          <div className="w-full font-semibold text-center">
          {props.number_account_impact}
          </div>
        </p>

        ) : (
          <div className="w-full h-12 font-semibold text-center">
            {/* Aucune violation des données */}
          </div>
        )}
      </div>



      {props.contact_mail_delete && (
        <div className="flex flex-col">
          <p className="w-full text-color3 text-center text-xl font-bold mt-3 underline underline-offset-4">
            Email disponible :
          </p>

        <a
          href={`mailto:${props.contact_mail_delete}`}
          className="py-1 text-color3 font-semibold break-words"
        >
          Supprimer ou exporter vos données {" "}
          <span className="text-black hover:underline hover:underline-offset-4">
            {props.contact_mail_delete}
            </span>
          </a>
        </div>
      )}
      {props.url_delete && (
        <div className="flex flex-col">
          <p className="text-color3 text-xl font-bold mt-3 underline underline-offset-4">

          Adresse utile :
        </p>
        <a
          href={props.url_delete}
          className="py-1 text-color3 font-semibold break-words"
          target="_blank"
        >
          Comment supprimer ou récupérer vos données :{" "}
          {props.url_delete === null ? (
            ""
          ) : (
            <span className="flex gap-2 text-black hover:underline hover:underline-offset-4">
              <Image
                src="/icons/arrow-up-right-from-square-solid.svg"
                width={20}
                height={20}
                alt="icone sort du site"
              />
              Aller sur le site
            </span>
          )}
        </a>
        </div>
      )}
    </article>
  );
}

