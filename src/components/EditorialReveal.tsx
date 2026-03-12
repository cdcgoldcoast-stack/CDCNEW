import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";

const EditorialReveal = () => {
  const [opacity, setOpacity] = useState(1);
  const [blackOverlay, setBlackOverlay] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { assets } = useSiteAssets({ staticFirst: true, deferRemoteOverrides: true });
  const sectionRef = useRef<HTMLElement>(null);
  const shouldLoadImages = useInView(sectionRef, { margin: "200px 0px", once: true });

  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (isMobile || isTablet) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Define section boundaries
      const sectionStart = windowHeight * 0.5; // When editorial section enters view
      const sectionLength = windowHeight * 1.2; // Total scroll length of editorial section
      const sectionEnd = sectionStart + sectionLength;
      
      // Define phase boundaries within the section
      const phase1End = sectionStart + sectionLength * 0.3; // First 30%: black fade out
      const phase2End = sectionStart + sectionLength * 0.6; // Next 30%: fully clear
      // Final 40%: existing fade-out behavior
      
      let newOpacity = 1;
      let newBlackOverlay = 0;
      
      if (scrollY < sectionStart) {
        // Before section: 50% black overlay, full opacity
        newBlackOverlay = 0.5;
        newOpacity = 1;
      } else if (scrollY < phase1End) {
        // First 30%: fade black overlay from 50% to 0%
        const progress = (scrollY - sectionStart) / (phase1End - sectionStart);
        newBlackOverlay = 0.5 * (1 - progress);
        newOpacity = 1;
      } else if (scrollY < phase2End) {
        // Middle 30%: no overlay at all, fully bright
        newBlackOverlay = 0;
        newOpacity = 1;
      } else if (scrollY < sectionEnd) {
        // Final 40%: subtle fade-out (only fade to 70% opacity, not fully transparent)
        const progress = (scrollY - phase2End) / (sectionEnd - phase2End);
        newBlackOverlay = 0;
        newOpacity = 1 - (progress * 0.3); // Only fade to 0.7, not 0
      } else {
        // After section
        newBlackOverlay = 0;
        newOpacity = 0.7;
      }
      
      setOpacity(Math.max(0, Math.min(1, newOpacity)));
      setBlackOverlay(Math.max(0, Math.min(0.5, newBlackOverlay)));
      
      const sectionMidpoint = sectionStart + sectionLength * 0.5;
      const parallaxProgress = (scrollY - sectionMidpoint) / windowHeight;
      const offset = parallaxProgress * 15;
      setParallaxOffset(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, isTablet]);

  // Desktop: 5 columns x 2 rows = 10 images
  const desktopImages = [
    // Column 1 (outer)
    { src: assets["editorial-6"], bgPos: "bg-bottom" },
    { src: assets["editorial-5"], bgPos: "bg-top" },
    // Column 2 (center)
    { src: assets["editorial-3"], bgPos: "bg-bottom" },
    { src: assets["editorial-2"], bgPos: "bg-top" },
    // Column 3 (outer)
    { src: assets["editorial-4"], bgPos: "bg-bottom" },
    { src: assets["editorial-1"], bgPos: "bg-top" },
    // Column 4 (center)
    { src: assets["editorial-7"], bgPos: "bg-bottom" },
    { src: assets["editorial-8"], bgPos: "bg-top" },
    // Column 5 (outer)
    { src: assets["editorial-9"], bgPos: "bg-bottom" },
    { src: assets["editorial-10"], bgPos: "bg-top" },
  ];

  // Tablet: 4 columns x 2 rows = 8 images
  const tabletImages = [
    // Column 1 (outer)
    { src: assets["editorial-6"], bgPos: "bg-bottom" },
    { src: assets["editorial-5"], bgPos: "bg-top" },
    // Column 2 (center)
    { src: assets["editorial-3"], bgPos: "bg-bottom" },
    { src: assets["editorial-2"], bgPos: "bg-top" },
    // Column 3 (outer)
    { src: assets["editorial-4"], bgPos: "bg-bottom" },
    { src: assets["editorial-1"], bgPos: "bg-top" },
    // Column 4 (center)
    { src: assets["editorial-7"], bgPos: "bg-bottom" },
    { src: assets["editorial-8"], bgPos: "bg-top" },
  ];

  // Mobile: 3 columns x 2 rows = 6 images
  const mobileImages = [
    { src: assets["editorial-6"], objPos: "object-bottom" },
    { src: assets["editorial-3"], objPos: "object-bottom" },
    { src: assets["editorial-4"], objPos: "object-bottom" },
    { src: assets["editorial-5"], objPos: "object-top" },
    { src: assets["editorial-2"], objPos: "object-top" },
    { src: assets["editorial-1"], objPos: "object-top" },
  ];

  const outerTransform = `translateY(${-parallaxOffset}px)`;
  const centerTransform = `translateY(${80 + parallaxOffset}px)`;
  const editorialImageQuality = 50;
  const editorialResponsiveWidths = [200, 280, 360, 480, 640] as const;

  const objectPositionClass = (position?: string) =>
    position?.includes("top") ? "object-top" : "object-bottom";

  // Mobile: 3 columns simple grid
  if (isMobile) {
    return (
      <section ref={sectionRef} className="py-8 overflow-hidden">
        <p className="text-label text-foreground/50 text-xs uppercase tracking-[0.2em] mb-4 px-5">Our Recent Work</p>
        <div className="grid grid-cols-3 gap-2 -mx-8">
          {/* Row 1 */}
          {mobileImages.slice(0, 3).map((img, i) => (
            <div key={i} className="aspect-[2/3] overflow-hidden bg-muted">
              {img.src && (
                <ResponsiveImage
                  src={shouldLoadImages ? img.src : null}
                  alt={`Renovation inspiration editorial image ${i + 1}`}
                  width={800}
                  height={1200}
                  sizes="33vw"
                  className={`w-full h-full object-cover ${img.objPos}`}
                  loading="lazy"
                  decoding="async"
                  quality={editorialImageQuality}
                  responsiveWidths={editorialResponsiveWidths}
                />
              )}
            </div>
          ))}
          {/* Row 2 */}
          {mobileImages.slice(3, 6).map((img, i) => (
            <div key={i + 3} className="aspect-[2/3] overflow-hidden bg-muted">
              {img.src && (
                <ResponsiveImage
                  src={shouldLoadImages ? img.src : null}
                  alt={`Renovation inspiration editorial image ${i + 4}`}
                  width={800}
                  height={1200}
                  sizes="33vw"
                  className={`w-full h-full object-cover ${img.objPos}`}
                  loading="lazy"
                  decoding="async"
                  quality={editorialImageQuality}
                  responsiveWidths={editorialResponsiveWidths}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Tablet: 4 columns simple grid (no parallax for performance)
  if (isTablet) {
    return (
      <section ref={sectionRef} className="py-10 overflow-hidden">
        <p className="text-label text-foreground/50 text-xs uppercase tracking-[0.2em] mb-5 px-6">Our Recent Work</p>
        <div className="grid grid-cols-4 gap-3 -mx-4">
          {/* Row 1 */}
          {tabletImages.filter((_, i) => i % 2 === 0).map((img, i) => (
            <div key={i} className="aspect-[2/3] overflow-hidden bg-muted">
              {img.src && (
                <ResponsiveImage
                  src={shouldLoadImages ? img.src : null}
                  alt={`Renovation inspiration editorial image ${i + 1}`}
                  width={800}
                  height={1200}
                  sizes="25vw"
                  className={`w-full h-full object-cover ${objectPositionClass(img.bgPos)}`}
                  loading="lazy"
                  decoding="async"
                  quality={editorialImageQuality}
                  responsiveWidths={editorialResponsiveWidths}
                />
              )}
            </div>
          ))}
          {/* Row 2 */}
          {tabletImages.filter((_, i) => i % 2 === 1).map((img, i) => (
            <div key={i + 4} className="aspect-[2/3] overflow-hidden bg-muted">
              {img.src && (
                <ResponsiveImage
                  src={shouldLoadImages ? img.src : null}
                  alt={`Renovation inspiration editorial image ${i + 5}`}
                  width={800}
                  height={1200}
                  sizes="25vw"
                  className={`w-full h-full object-cover ${objectPositionClass(img.bgPos)}`}
                  loading="lazy"
                  decoding="async"
                  quality={editorialImageQuality}
                  responsiveWidths={editorialResponsiveWidths}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: 5 columns parallax scroll effect
  return (
    <section ref={sectionRef}>
      <div className="h-[60vh] relative">
        <p className="absolute bottom-8 left-8 text-label text-foreground/50 text-xs uppercase tracking-[0.2em] z-10">Our Recent Work</p>
      </div>
      
      <div 
        className="fixed inset-0 z-0 transition-opacity duration-300 ease-out overflow-hidden"
        style={{ opacity }}
      >
        {/* Black gradient overlay for hero→editorial transition */}
        <div 
          className="absolute inset-0 bg-black z-10 pointer-events-none"
          style={{ opacity: blackOverlay }}
        />
        <div className="h-full w-full flex gap-[24px]">
          {[
            { items: [desktopImages[0], desktopImages[1]], transform: outerTransform },
            { items: [desktopImages[2], desktopImages[3]], transform: centerTransform },
            { items: [desktopImages[4], desktopImages[5]], transform: outerTransform },
            { items: [desktopImages[6], desktopImages[7]], transform: centerTransform },
            { items: [desktopImages[8], desktopImages[9]], transform: outerTransform },
          ].map((column, columnIndex) => (
            <div
              key={`desktop-column-${columnIndex}`}
              className="flex-1 flex flex-col gap-[24px] items-center justify-center transition-transform duration-100 ease-out"
              style={{ transform: column.transform }}
            >
              {column.items.map((image, imageIndex) => (
                <div key={`desktop-image-${columnIndex}-${imageIndex}`} className="relative w-full aspect-[2/3] bg-muted">
                  <ResponsiveImage
                    src={shouldLoadImages ? image.src : null}
                    alt={`Renovation inspiration editorial image ${columnIndex * 2 + imageIndex + 1}`}
                    width={800}
                    height={1200}
                    sizes="20vw"
                    className={`absolute inset-0 w-full h-full object-cover ${objectPositionClass(image.bgPos)}`}
                    loading="lazy"
                    decoding="async"
                    quality={editorialImageQuality}
                    responsiveWidths={editorialResponsiveWidths}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-[60vh]" />
    </section>
  );
};

export default EditorialReveal;
