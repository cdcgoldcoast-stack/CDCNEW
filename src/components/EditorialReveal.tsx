import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";

const EditorialReveal = () => {
  const [opacity, setOpacity] = useState(1);
  const [blackOverlay, setBlackOverlay] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { assets, ready } = useSiteAssets();
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

  // Mobile: 3 columns simple grid
  if (isMobile) {
    return (
      <section ref={sectionRef} className="py-8 overflow-hidden">
        <div className="grid grid-cols-3 gap-2 -mx-8">
          {/* Row 1 */}
          {mobileImages.slice(0, 3).map((img, i) => (
            <div key={i} className="aspect-[2/3] overflow-hidden bg-muted">
              {img.src && (
                <ResponsiveImage
                  src={shouldLoadImages ? img.src : null}
                  alt=""
                  width={800}
                  height={1200}
                  sizes="33vw"
                  className={`w-full h-full object-cover ${img.objPos}`}
                  loading="lazy"
                  decoding="async"
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
                  alt=""
                  width={800}
                  height={1200}
                  sizes="33vw"
                  className={`w-full h-full object-cover ${img.objPos}`}
                  loading="lazy"
                  decoding="async"
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
        <div className="grid grid-cols-4 gap-3 -mx-4">
          {/* Row 1 */}
          {tabletImages.filter((_, i) => i % 2 === 0).map((img, i) => (
            <div key={i} className="aspect-[2/3] overflow-hidden bg-muted">
              {img.src && (
                <div 
                  className={`w-full h-full bg-cover ${img.bgPos} bg-muted`}
                  style={{ backgroundImage: shouldLoadImages && img.src ? `url(${img.src})` : "none" }}
                />
              )}
            </div>
          ))}
          {/* Row 2 */}
          {tabletImages.filter((_, i) => i % 2 === 1).map((img, i) => (
            <div key={i + 4} className="aspect-[2/3] overflow-hidden bg-muted">
              {img.src && (
                <div 
                  className={`w-full h-full bg-cover ${img.bgPos} bg-muted`}
                  style={{ backgroundImage: shouldLoadImages && img.src ? `url(${img.src})` : "none" }}
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
      <div className="h-[60vh]" />
      
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
          {/* Column 1 - outer transform */}
          <div 
            className="flex-1 flex flex-col gap-[24px] items-center justify-center transition-transform duration-100 ease-out"
            style={{ transform: outerTransform }}
          >
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[0].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[0].src ? `url(${desktopImages[0].src})` : "none" }}
              />
            </div>
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[1].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[1].src ? `url(${desktopImages[1].src})` : "none" }}
              />
            </div>
          </div>
          
          {/* Column 2 - center transform */}
          <div 
            className="flex-1 flex flex-col gap-[24px] items-center justify-center transition-transform duration-100 ease-out"
            style={{ transform: centerTransform }}
          >
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[2].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[2].src ? `url(${desktopImages[2].src})` : "none" }}
              />
            </div>
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[3].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[3].src ? `url(${desktopImages[3].src})` : "none" }}
              />
            </div>
          </div>
          
          {/* Column 3 - outer transform */}
          <div 
            className="flex-1 flex flex-col gap-[24px] items-center justify-center transition-transform duration-100 ease-out"
            style={{ transform: outerTransform }}
          >
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[4].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[4].src ? `url(${desktopImages[4].src})` : "none" }}
              />
            </div>
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[5].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[5].src ? `url(${desktopImages[5].src})` : "none" }}
              />
            </div>
          </div>

          {/* Column 4 - center transform */}
          <div 
            className="flex-1 flex flex-col gap-[24px] items-center justify-center transition-transform duration-100 ease-out"
            style={{ transform: centerTransform }}
          >
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[6].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[6].src ? `url(${desktopImages[6].src})` : "none" }}
              />
            </div>
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[7].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[7].src ? `url(${desktopImages[7].src})` : "none" }}
              />
            </div>
          </div>

          {/* Column 5 - outer transform */}
          <div 
            className="flex-1 flex flex-col gap-[24px] items-center justify-center transition-transform duration-100 ease-out"
            style={{ transform: outerTransform }}
          >
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[8].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[8].src ? `url(${desktopImages[8].src})` : "none" }}
              />
            </div>
            <div className="relative w-full aspect-[2/3]">
              <div 
                className={`absolute inset-0 bg-cover bg-muted ${desktopImages[9].bgPos}`}
                style={{ backgroundImage: shouldLoadImages && desktopImages[9].src ? `url(${desktopImages[9].src})` : "none" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[60vh]" />
    </section>
  );
};

export default EditorialReveal;
