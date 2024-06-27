"use client";

import Image from "next/image";
import logoLeak from "/public/images/data-leak.svg";
import logoDanger from "/public/images/danger.svg";
import logoAccount from "/public/images/account.svg";
import logoContactForm from "/public/images/formulaire-de-contact.svg";

export default function Carte(props: any) {
  return (
    <div
      className={`${props.score_color} p-3 text-black w-full max-w-[600px] mx-auto shadow-md ${props.shadow_color} rounded-md md:h-[550px]`}
    >
      <div className="flex items-center">
        <Image
          width={60}
          height={60}
          src={props.img_src}
          alt={`Logo de ${props.name}`}
        ></Image>
        <h1 className="text-blue ml-2 text-2xl font-medium">{props.name}</h1>
        <div className="flex flex-col ml-auto">
          <Image
            className="ml-auto"
            width={50}
            height={40}
            src={props.country_img}
            alt={props.country}
          />
          <p className="text-xl mt-1">Serveurs {props.servers_location}</p>
        </div>
      </div>
      <div className="flex flex-col my-1">
        <p className="text-2xl">
          Score:{" "}
          <span className={`font-bold ${props.text_score_color}`}>
            {props.score}
          </span>
        </p>
        <p
          className={`font-semibold text-xl ${
            props.is_gafam ? "" : "line-through"
          }`}
        >
          GAFAM
        </p>
        {props.is_easy_to_claim_data ? (
          <p className="text-xl">
            Démarches accessibles et faciles pour faire valoir ses droits
          </p>
        ) : (
          <p className="text-xl">
            Démarches difficiles pour faire valoir ses droits
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className={`${props.score_color} p-2 rounded-md bg-[#FEFEFE]`}>
          <h2 className="text-blue mb-2 text-xl font-medium">
            Informations importantes
          </h2>
          <div className="flex items-center">
            <Image
              src={logoLeak}
              height={30}
              width={30}
              alt="Nombre de vols de données"
            />
            <p className="text-xl ml-2">
              {props.data_leak_counter} vols de données {props.type_stolen_data}
            </p>
          </div>
          <div className="flex items-center">
            <Image src={logoDanger} height={30} width={30} alt="Attention" />
            <p className="text-xl ml-2">
              Dernier incident : {props.last_incident}
            </p>
          </div>
        </div>
        <div className={`${props.score_color} p-2 rounded-md bg-[#FEFEFE]`}>
          <h2 className="text-blue mb-2 text-xl font-medium">
            Actions possibles
          </h2>
          <div className="flex items-center">
            <Image src={logoAccount} height={30} width={30} alt="DPO" />
            <p className="text-xl ml-2">
              Contacter le chargé de protection des données par mail à
              l&apos;adresse&nbsp;: <br />
              <a
                href={`mailto:${props.dpo_contact}`}
                className="text-red-500 hover:text-black"
                target="blank"
              >
                {props.dpo_contact}
              </a>
            </p>
          </div>
          <div className="flex items-center">
            <Image src={logoContactForm} height={30} width={30} alt="DPO" />
            <p className="text-xl ml-2">
              Se rendre à l&apos;adresse suivante pour demander à exercer vos
              droits&nbsp;: <br />
              <a
                href={props.form_link}
                className="text-red-500 hover:text-black"
                target="blank"
              >
                {props.form_link}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
