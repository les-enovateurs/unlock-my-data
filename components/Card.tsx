"use client";

import Image from "next/image";
import { Data } from "../app/list/ListPageProps";

export default function Card(props: Data) {
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
          <p className="text-blue font-semibold">{props.country}</p>
          <p className="font-semibold">
            <span className="text-blue font-semibold">Score: </span>
            {props.score}
          </p>
        </div>
      </header>
      <div className="flex flex-col gap-2">
        <p className="font-semibold">
          <span className="text-blue font-semibold">
            Note d'accessibilité de vos données :{" "}
          </span>
          {props.accessibility}
        </p>
        <p className="font-semibold">
          <span className="text-blue font-semibold">
            Dernière violation des données :{" "}
          </span>
          {props.last_update_breach}
        </p>
        <p className="font-semibold">
          <span className="text-blue font-semibold">
            Nombre de comptes impactés :{" "}
          </span>
          {props.number_account_impact}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-blue text-xl font-bold mt-3 underline underline-offset-4">
          Email disponible :
        </p>
        <a
          href={`mailto:${props.contact_mail_delete}`}
          className="py-1 text-blue font-semibold break-words"
        >
          Supprimer ou exporter vos données :{" "}
          <span className="text-black hover:underline hover:underline-offset-4">
            {props.contact_mail_delete}
          </span>
        </a>
      </div>
      <div className="flex flex-col">
        <p className="text-blue text-xl font-bold mt-3 underline underline-offset-4">
          Adresse utile :
        </p>
        <a
          href={props.url_delete}
          className="py-1 text-blue font-semibold break-words"
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
    </article>
  );
}
