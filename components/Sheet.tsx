import React from "react";
import Image from "next/image";

export default function Sheet() {
  return (
    <article className="mx-auto">
      <div>
        <img
          src="/banniere.png"
          alt="banniere justice"
          className="w-auto my-2"
        />
        <div className="flex">
          <img
            src="/stakeholders/lesenovateurs/les-enovateurs.webp"
            alt="Les e-novateurs"
            className="rounded-full w-[10%]"
          />
          <div className="flex flex-col ml-3">
            <h3 className="text-blue font-semibold text-3xl">Ils en parlent</h3>
            <a
              href="https://les-enovateurs.com/adultes-ados-ensemble-reprenez-controle-sur-tiktok"
              target="_blank"
            >
              Reprenez le controle sur tiktok
            </a>
            <a href="https://les-enovateurs.com/breves/tiktok-protege-suffisamment-jeunes-utilisateurs-commission-europeenne-lance-enquete">
              La commission Européenne mène l'enquête
            </a>
            <a href="https://les-enovateurs.com/tiktok-jeunesse-sous-influence">
              Jeunesse sous influence
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
