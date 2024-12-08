import React from "react";
import Image from "next/image";
import Container, {ContainerColumn} from "@/components/ui/Container";
import Title from "@/components/ui/Title";
// import Container2 from "@/components/ui/Container2";
export default function News() {
  return (
    <section className="bg-blue h-screen">
      <ContainerColumn>
        {/* Les dernières News */}
        {/* <Title>Les dernières News</Title> */}
        <h2 className="title-section-white">Les dernières News</h2>
        <article className="mx-auto">
          <div className="flex flex-col items-center justify-center">
            <span className="px-6 py-12">
              <img
                src="/banniere.png"
                alt="banniere justice"
                className="w-auto rounded-xl"
              />
            </span>
            <div className="flex items-center justify-center">
              <div>
                <img
                  style={{ width: "120px" }}
                  src="/stakeholders/lesenovateurs/les-enovateurs.webp"
                  alt="Les e-novateurs"
                  className="rounded-full w-[10%]"
                />
              </div>
              <div className="flex flex-col ml-8 items-center">
                <h3 className="text-blue font-semibold text-3xl">
                  Ils en parlent
                </h3>
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
      </ContainerColumn>
    </section>
  );
}
