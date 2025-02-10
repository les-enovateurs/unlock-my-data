import React, { useEffect, useRef, ReactDOM, useState } from "react";
import Image from "next/image";
import Container, { ContainerColumn } from "@/components/ui/Container";
import Title from "@/components/ui/Title";
import Border from "@/components/ui/Border";
// import Container2 from "@/components/ui/Container2";
export default function Transition1() {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const points = [
    { x: 0, y: 0 },
    { x: screenWidth / 2, y: 0 },
    { x: screenWidth / 2, y: 500 },
    { x: 0, y: 500 },
  ];
  const elementSize = 40;
  const gap = 3;
  return (
    <section
      id="transition1"
      className="relative bg-blue md:h-[10vh] min-h-[10vh]"
    >
      {/* <Container> */}
      <div className="w-full h-[20vh] flex items-end justify-end z-30">
        <div className="h-[20vh] bg-color4 w-1/2 text-white z-30">
          {/* AAAAA */}
          {/* <ShapeFiller points={points} elementSize={elementSize} gap={gap} /> */}
          {/* <RandomShapeFiller
            points={points}
            minSize={50}
            maxSize={100}
            gap={5}
            color="white"
            overflowTolerance={1}

          /> */}
          <RandomShapeFiller2
            points={points}
            minSize={50}
            maxSize={100}
            gap={5}
            color="white"
            startPoint={{ x: points[0].x, y: points[0].y }}
            overflowTolerance={0.3}
          />
        </div>
      </div>
      {/* </Container> */}
    </section>
  );
}

interface Point {
  x: number;
  y: number;
}

interface Props {
  points: Point[]; // Les points définissant la forme
  elementSize: number; // Taille des div à placer
  gap: number; // Espace entre les div
}

export function ShapeFiller({ points, elementSize, gap }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Vérifie si un point est dans le triangle
  const isPointInTriangle = (
    px: number,
    py: number,
    p1: Point,
    p2: Point,
    p3: Point
  ) => {
    const area =
      0.5 *
      (-p2.y * p3.x +
        p1.y * (-p2.x + p3.x) +
        p1.x * (p2.y - p3.y) +
        p2.x * p3.y);
    const s =
      (1 / (2 * area)) *
      (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * px + (p1.x - p3.x) * py);
    const t =
      (1 / (2 * area)) *
      (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * px + (p2.x - p1.x) * py);
    return s >= 0 && t >= 0 && 1 - s - t >= 0;
  };

  // Calcule les limites de la forme
  const getBounds = (points: Point[]) => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const bounds = getBounds(points);
    const elements: string[] = [];
    let doc;
    let z;
    // Parcours la grille
    for (let x = bounds.minX; x < bounds.maxX; x += elementSize + gap) {
      for (let y = bounds.minY; y < bounds.maxY; y += elementSize + gap) {
        // Vérifie si le centre du carré est dans le triangle
        if (
          isPointInTriangle(
            x + elementSize / 2,
            y + elementSize / 2,
            points[0],
            points[1],
            points[2]
          )
        ) {
          elements.push(
            `<div
              key={"${x}-${y}"}
              style="position: absolute;left: ${x}px;top: ${y}px;width: ${elementSize}px;height: ${elementSize}px;background-color: white;border-radius: 2px"
          
            >AA</div>
          `
          );
        }
      }
    }

    // Met à jour le contenu
    containerRef.current.innerHTML = "";
    // alert(elements.length);
    if (elements.length > 0) {
      elements.forEach((element) => {
        // var xmlString = "<div id='foo'><a href='#'>Link</a><span></span></div>";
        // doc = new DOMParser().parseFromString(element, "text/xml");
        z = document.createElement("div");
        z.innerHTML = element;
        containerRef.current?.appendChild(z);
      });
    }
  }, [points, elementSize, gap]);

  return (
    <div
      id="rrrr"
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    />
  );
}

// interface Props2 {
//   points: Point[];
//   minSize: number; // Taille minimum des éléments
//   maxSize: number; // Taille maximum des éléments
//   gap: number;
//   color?: string; // Couleur optionnelle
// }
// interface Props2 {
//   points: Point[];
//   minSize: number;
//   maxSize: number;
//   gap: number;
//   color?: string;
//   overflowTolerance?: number; // Pourcentage de la taille qui peut déborder (0 à 1)
// }

export function RandomShapeFiller({
  points,
  minSize,
  maxSize,
  gap,
  color = "white",
  overflowTolerance = 0.3, // 30% de débordement par défaut
}: Props2) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);

  const isPointInTriangle = (
    px: number,
    py: number,
    p1: Point,
    p2: Point,
    p3: Point
  ) => {
    const area =
      0.5 *
      (-p2.y * p3.x +
        p1.y * (-p2.x + p3.x) +
        p1.x * (p2.y - p3.y) +
        p2.x * p3.y);
    const s =
      (1 / (2 * area)) *
      (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * px + (p1.x - p3.x) * py);
    const t =
      (1 / (2 * area)) *
      (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * px + (p2.x - p1.x) * py);
    return s >= 0 && t >= 0 && 1 - s - t >= 0;
  };

  const getBounds = (points: Point[]) => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  };

  // Fonction pour générer une taille aléatoire
  const getRandomSize = () => {
    return Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  };

  // Vérifie si un nouveau rectangle chevauche les rectangles existants
  const isOverlapping = (
    newRect: { x: number; y: number; width: number; height: number },
    existingRects: { x: number; y: number; width: number; height: number }[]
  ) => {
    return existingRects.some((rect) => {
      return !(
        newRect.x + newRect.width + gap < rect.x ||
        newRect.x > rect.x + rect.width + gap ||
        newRect.y + newRect.height + gap < rect.y ||
        newRect.y > rect.y + rect.height + gap
      );
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const bounds = getBounds(points);
    const placedRects: {
      x: number;
      y: number;
      width: number;
      height: number;
    }[] = [];
    const elements: React.ReactNode[] = [];

    // Essaie de placer des rectangles jusqu'à un certain nombre de tentatives
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      const width = getRandomSize();
      const height = getRandomSize();
      const x =
        Math.random() * (bounds.maxX - bounds.minX - width) + bounds.minX;
      const y =
        Math.random() * (bounds.maxY - bounds.minY - height) + bounds.minY;

      // Vérifier si au moins (1 - overflowTolerance) du rectangle est dans le triangle
      const checkPoints = [
        { x: x + width * overflowTolerance, y: y + height * overflowTolerance },
        {
          x: x + width * (1 - overflowTolerance),
          y: y + height * overflowTolerance,
        },
        {
          x: x + width * overflowTolerance,
          y: y + height * (1 - overflowTolerance),
        },
        {
          x: x + width * (1 - overflowTolerance),
          y: y + height * (1 - overflowTolerance),
        },
      ];

      // Si au moins un point de contrôle est dans le triangle
      const isPartiallyInside = checkPoints.some((point) =>
        isPointInTriangle(point.x, point.y, points[0], points[1], points[2])
      );

      if (
        isPartiallyInside &&
        !isOverlapping({ x, y, width, height }, placedRects)
      ) {
        placedRects.push({ x, y, width, height });
        const index = elements.length;

        const element = (
          <div
            key={`${x}-${y}`}
            // ref={el => elementRefs.current[index] = el}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: "red",
              borderRadius: "2px",
              transition: "all 0.3s ease",
            }}
          >
            <div
              ref={(el) => (elementRefs.current[index] = el)}
              className="relative w-full h-full"
            >
              <Border ttype="bouton" rref={elementRefs.current[index]} />
            </div>
          </div>
        );

        elements.push(element);
      }

      attempts++;
    }

    // Après la boucle de placement initiale, optimisons la taille des carrés
    const optimizeShapes = () => {
      const growthStep = 1; // Pas d'agrandissement en pixels
      let madeChanges = true;

      while (madeChanges) {
        madeChanges = false;

        placedRects.forEach((rect, index) => {
          // Essayons d'agrandir dans toutes les directions
          const newRect = {
            x: rect.x - growthStep / 2,
            y: rect.y - growthStep / 2,
            width: rect.width + growthStep,
            height: rect.height + growthStep,
          };

          // Vérifie si le rectangle agrandi est toujours valide
          const checkPoints = [
            {
              x: newRect.x + newRect.width * overflowTolerance,
              y: newRect.y + newRect.height * overflowTolerance,
            },
            {
              x: newRect.x + newRect.width * (1 - overflowTolerance),
              y: newRect.y + newRect.height * overflowTolerance,
            },
            {
              x: newRect.x + newRect.width * overflowTolerance,
              y: newRect.y + newRect.height * (1 - overflowTolerance),
            },
            {
              x: newRect.x + newRect.width * (1 - overflowTolerance),
              y: newRect.y + newRect.height * (1 - overflowTolerance),
            },
          ];

          const isValidGrowth =
            // Vérifie si toujours dans le triangle
            checkPoints.every((point) =>
              isPointInTriangle(
                point.x,
                point.y,
                points[0],
                points[1],
                points[2]
              )
            ) &&
            // Vérifie pas de collision avec les autres rectangles
            !placedRects.some(
              (otherRect, otherIndex) =>
                index !== otherIndex && !isOverlapping(newRect, [otherRect])
            );

          if (isValidGrowth) {
            placedRects[index] = newRect;
            madeChanges = true;

            // Met à jour l'élément visuel
            elements[index] = (
              <div
                key={`${newRect.x}-${newRect.y}`}
                style={{
                  position: "absolute",
                  left: `${newRect.x}px`,
                  top: `${newRect.y}px`,
                  width: `${newRect.width}px`,
                  height: `${newRect.height}px`,
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  backgroundColor: "red",
                }}
              >
                <div
                  ref={(el) => (elementRefs.current[index] = el)}
                  className="relative w-full h-full"
                >
                  {/* <Border ttype="bouton" rref={elementRefs.current[index]} /> */}
                </div>
              </div>
            );
          }
        });
      }
    };

    optimizeShapes();
    setShapes(elements);
  }, [points, minSize, maxSize, gap, color, overflowTolerance]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {shapes}
    </div>
  );
}

interface Props2 {
  points: Point[];
  minSize: number;
  maxSize: number;
  gap: number;
  color?: string;
  startPoint: Point; // Nouveau paramètre pour le point de départ
  overflowTolerance?: number;
}

export function RandomShapeFiller2({
  points,
  minSize,
  maxSize,
  gap,
  color = "white",
  startPoint,
  overflowTolerance = 0.3,
}: Props2) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);

  const isPointInTriangle = (
    px: number,
    py: number,
    p1: Point,
    p2: Point,
    p3: Point
  ) => {
    const area =
      0.5 *
      (-p2.y * p3.x +
        p1.y * (-p2.x + p3.x) +
        p1.x * (p2.y - p3.y) +
        p2.x * p3.y);
    const s =
      (1 / (2 * area)) *
      (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * px + (p1.x - p3.x) * py);
    const t =
      (1 / (2 * area)) *
      (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * px + (p2.x - p1.x) * py);
    return s >= 0 && t >= 0 && 1 - s - t >= 0;
  };

  const getBounds = (points: Point[]) => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  };

  // Fonction pour générer une taille aléatoire
  const getRandomSize = () => {
    return Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  };

  // Vérifie si un nouveau rectangle chevauche les rectangles existants
  const isOverlapping = (
    newRect: { x: number; y: number; width: number; height: number },
    existingRects: { x: number; y: number; width: number; height: number }[]
  ) => {
    return existingRects.some((rect) => {
      return !(
        newRect.x + newRect.width + gap < rect.x ||
        newRect.x > rect.x + rect.width + gap ||
        newRect.y + newRect.height + gap < rect.y ||
        newRect.y > rect.y + rect.height + gap
      );
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const bounds = getBounds(points);
    const placedRects: {
      x: number;
      y: number;
      width: number;
      height: number;
    }[] = [];
    const elements: React.ReactNode[] = [];

    // Fonction pour placer un nouveau bloc à côté d'un bloc existant
    const placeAdjacentBlock = (
      referenceRect: { x: number; y: number; width: number; height: number },
      layer: number
    ) => {
      const heightVariation = Math.random() * (maxSize - minSize) * 0.3; // 30% de variation de hauteur
      const widthVariation = Math.random() * (maxSize - minSize) * 0.5; // 50% de variation de largeur

      // Hauteur relativement constante par couche
      const baseHeight = minSize + (maxSize - minSize) * 0.7;
      const height = baseHeight + heightVariation;

      // Largeur plus variable
      const width = minSize + widthVariation;

      // Position à droite du bloc de référence
      const x = referenceRect.x + referenceRect.width + gap;
      const y = layer * (baseHeight + gap);

      return { x, y, width, height };
    };

    // Place le premier bloc près du point de départ
    const firstBlock = {
      x: startPoint.x,
      y: startPoint.y,
      width: minSize + Math.random() * (maxSize - minSize) * 0.5,
      height: minSize + Math.random() * (maxSize - minSize) * 0.3,
    };

    console.log("firstBlock",firstBlock);

    placedRects.push(firstBlock);

    const isPartiallyInTriangle = (
      rect: { x: number; y: number; width: number; height: number },
      points: Point[]
    ) => {
      // Points de contrôle aux coins du rectangle
      const checkPoints = [
        { x: rect.x + rect.width * overflowTolerance, y: rect.y + rect.height * overflowTolerance },
        { x: rect.x + rect.width * (1 - overflowTolerance), y: rect.y + rect.height * overflowTolerance },
        { x: rect.x + rect.width * overflowTolerance, y: rect.y + rect.height * (1 - overflowTolerance) },
        { x: rect.x + rect.width * (1 - overflowTolerance), y: rect.y + rect.height * (1 - overflowTolerance) }
      ];
    
      // Si au moins un point de contrôle est dans le triangle
      return checkPoints.some(point => 
        isPointInTriangle(point.x, point.y, points[0], points[1], points[2])
      );
    };

    // Construction par couches
    let currentLayer = 0;
    let maxLayers = Math.floor((bounds.maxY - bounds.minY) / (minSize + gap));

    while (currentLayer < maxLayers) {
      console.log("rr",currentLayer,maxLayers);
      let lastRect = placedRects[placedRects.length - 1];
      let layerWidth = 0;

      // Remplir la couche courante
      while (layerWidth < bounds.maxX - bounds.minX) {
        const newBlock = placeAdjacentBlock(lastRect, currentLayer);

        // Vérifier si le bloc est dans les limites et dans le triangle
        if (
          // isPartiallyInTriangle(newBlock, points) &&
          // !isOverlapping(newBlock, placedRects)
          1==1
        ) {
          placedRects.push(newBlock);
          elements.push(createBlockElement(newBlock, elements.length));

          lastRect = newBlock;
          layerWidth += newBlock.width + gap;
        } else {
          break; // Sortir si on ne peut plus placer de blocs
        }
      }

      currentLayer++;
    }

    setShapes(elements);
  }, [points, minSize, maxSize, gap, color, startPoint, overflowTolerance]);

  // Fonction helper pour créer l'élément visuel
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
        backgroundColor: color,
        borderRadius: "2px",
        transition: "all 0.3s ease",
      }}
    >
      <div
        ref={(el) => (elementRefs.current[index] = el)}
        className="relative w-full h-full"
      >
        <Border ttype="decor" rref={elementRefs.current[index]} />
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {shapes}
    </div>
  );
}

// Ajouter cette fonction avant ou après les autres fonctions utilitaires

