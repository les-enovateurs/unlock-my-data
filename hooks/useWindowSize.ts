import { useState, useEffect } from 'react';

interface WindowSize {
  width: number | undefined;
  isMobile: boolean;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    isMobile: false,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        isMobile: window.innerWidth < 768, // breakpoint md de Tailwind
      });
    }

    // Ajouter l'event listener
    window.addEventListener('resize', handleResize);
    
    // Appeler handleResize immédiatement pour définir la taille initiale
    handleResize();

    // Nettoyer l'event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
} 