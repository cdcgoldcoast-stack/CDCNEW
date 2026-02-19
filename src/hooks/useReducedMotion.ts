import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    // Check if mobile or prefers reduced motion
    const isMobile = window.innerWidth < 768;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    setPrefersReducedMotion(mediaQuery.matches || isMobile);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches || window.innerWidth < 768);
    };

    mediaQuery.addEventListener("change", handler);
    
    // Also listen for resize
    const resizeHandler = () => {
      setPrefersReducedMotion(window.innerWidth < 768 || mediaQuery.matches);
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return prefersReducedMotion;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
