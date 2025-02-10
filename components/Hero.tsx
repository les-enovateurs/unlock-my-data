"use client";
import Image from "next/image";
import Link from "next/link";
import datas_picture from "/public/pictures/datas_picture.png";
import { ContainerHero } from "@/components/ui/Container";
import Border from "@/components/ui/Border";
import { useEffect, useRef, useState } from "react";
// import logo from "../public/logoUMDshort.png"
export default function Hero() {
  const ref = useRef(null);
  return (
    <>
      <section id="hero" className="min-h-screen">
        <ContainerHero>
          <div className="bg-color2 relative inset-x-0 right-6 mx-auto ml-auto mt-12 h-fit max-w-md [--ui-shadow-border:var(--ui-border-color)] lg:absolute lg:inset-y-16 lg:mr-0 lg:mt-0">
            <div className="absolute -inset-20 z-[1] bg-gradient-to-b from-white via-transparent to-white sm:-inset-40 dark:from-white dark:via-transparent dark:to-white"></div>
            <div className="absolute -inset-20 z-[1] bg-gradient-to-r from-white via-transparent to-white sm:-inset-40 dark:from-white dark:via-transparent dark:to-white"></div>
            <div
              data-shade="glassy"
              className="absolute -inset-20 bg-[linear-gradient(to_right,var(--ui-border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border-color)_1px,transparent_1px)] bg-[size:24px_24px] [--ui-border-color:theme(colors.primary.200)] sm:-inset-40 dark:[--ui-border-color:theme(colors.primary.500/0.25)]"
            ></div>
            <div className="before:bg-ui before:tls-shadow-lg relative z-10 mt-4 before:rounded-card before:absolute before:inset-x-2 before:-bottom-1.5 before:top-0 before:shadow-gray-950/[0.03]">
              <div className="tls-shadow bg-ui rounded-card relative overflow-hidden shadow-gray-950/[0.05]">
                <Image
                  src={datas_picture}
                  alt="Illustration"
                  className={`mx-auto transition-all duration-2000 ease-in-out transform`}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
            <h2
              className={`text-color4 mt-10 text-balance text-5xl font-bold md:text-6xl xl:text-6xl`}
            >
              Unlock My Data vous montre le bon côté du RGPD.
            </h2>
            <p className="text-color4 text-body mt-8">
              Récupérez vos données facilement.
              <br />
              Vous avez accès à différentes informations, comme une note
              d’accessibilité de vos données allant de 1 à 5. 5 étant la
              meilleure note. Ou les adresses mail et page du site pour accéder
              à vos données: les récupérer ou faire une demande de suppression.
              <br />
              <br />
              Pour quelles raisons ?
              <br />
              Les données sont les nouvelles pépites d'or. Elles permettent
              d'apprendre énormément de choses sur vous&nbsp;:
            </p>
          </div>
          <Link
            ref={ref}
            href="/search"
            className="mt-4 bg-color1 relative w-1/2 mx-auto text-color4 inline-flex items-center justify-center    z-50 pb-4 pt-3 px-8 text-2xl font-bold hover:bg-yellow/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="z-20 text-center">
              C'est parti ! je veux récupérer mes données
            </span>
            {/* <Border ttype="bouton" rref={ref.current} /> */}
          </Link>
          
        </ContainerHero>
      </section>
    </>
  );
}

function BorderHero() {
  const elementRefs = useRef<HTMLElement[]>([]);
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);
  const elements: React.ReactNode[] = [];
  let murDimensions = { x: 0, y: 0 };
  let squareDim = [];

  let xInitial = 0;
  let yInitial = 0;

  const createBlockElement = (
    block: { x: number; y: number; width: number; height: number },
    index: number
  ) => (
    <div
      key={`${block.x}-${block.y}`}
      style={{
        position: "absolute",
        left: `${block.x}px`,
        top: `${block.y}px`,
        width: `${block.width}px`,
        height: `${block.height}px`,
        // backgroundColor: "blue",
        borderRadius: "2px",
        transition: "all 0.3s ease",
      }}
    >
      <div
        id={`AA${block.x}-${block.y}`}
        // ref={(el) => (elementRefs.current[index] = el as HTMLElement)}
        className="relative w-full h-full"
      >
        <Border
          // ttype="bouton"
          idparent={`AA${block.x}-${block.y}`}
          icone={false}
          rose={true}
          rref={elementRefs.current[index] as HTMLDivElement}
        />
      </div>
    </div>
  );

  useEffect(() => {
    let gap = 5;

    let blockWidth = 100;
    let blockHeight = 50;

    let blockNumberX = 0;
    let blockNumberY = 0;

    let currentBlockHeight = 0;
    let currentBlockWidth = 0;

    // let block1 = createBlockElement(
    //   { x: gap, y: gap, width: blockWidth, height: blockHeight },
    //   0
    // );
    // elements.push(block1);

    // squareDim.push({
    //   x: xInitial,
    //   y: yInitial,
    //   blockNumberY: blockNumberY,
    //   blockNumberX: blockNumberX,
    //   // xpos: xInitial,
    // });
    while (xInitial < window.innerWidth) {
      while (yInitial < window.innerHeight / 10) {
        currentBlockHeight = blockHeight * (1 + Math.random() * 0.3);
        currentBlockWidth = blockWidth * (1 + Math.random() * 0.1);

        squareDim.push({
          x: xInitial,
          y: yInitial,
          blockNumberY: blockNumberY,
          blockNumberX: blockNumberX,
          // xpos: xInitial,
        });

        murDimensions.y += currentBlockHeight;

        elements.push(
          createBlockElement(
            {
              x: xInitial,
              y: yInitial,
              width: currentBlockWidth,
              height: currentBlockHeight,
            },
            0
          )
        );

        yInitial = yInitial + currentBlockHeight + gap;
        blockNumberY++;
      }
      yInitial = 0;
      blockNumberY = 0;
      xInitial = xInitial + blockWidth + gap;
      murDimensions.x += blockWidth;
      blockNumberX++;
    }

    setShapes(elements);
    console.log(squareDim);
  }, []);

  return <>{shapes}</>;
}
