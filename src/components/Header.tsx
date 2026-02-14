import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useResolvedAsset } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";

const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger hide/show

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Get logo with potential override
  const logoSrc = useResolvedAsset("logo");

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = currentScrollY - lastScrollY.current;

          // Only trigger if scroll exceeds threshold
          if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
            if (scrollDiff > 0 && currentScrollY > 80) {
              // Scrolling down & past header height - hide
              setIsVisible(false);
            } else if (scrollDiff < 0) {
              // Scrolling up - show
              setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          // Always show at top of page
          if (currentScrollY < 80) {
            setIsVisible(true);
          }

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const prefetchedRoutes = useRef<Set<string>>(new Set());
  const prefetchRoute = useCallback((href: string) => {
    if (typeof document === "undefined" || prefetchedRoutes.current.has(href)) return;
    prefetchedRoutes.current.add(href);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = href;
    document.head.appendChild(link);
  }, []);

  const getPrefetchHandlers = (href: string) => ({
    onMouseEnter: () => prefetchRoute(href),
    onTouchStart: () => prefetchRoute(href),
  });

  const baseLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Design Tools", href: "/design-tools" },
  ];
  const navLinks = isHome ? baseLinks : [{ label: "Home", href: "/" }, ...baseLinks];
  
  // Always use solid header (no transparent mode)
  const shouldBeTransparent = false;

  const ctaClass = `text-label px-5 py-2 transition-all duration-300 ${
    shouldBeTransparent 
      ? "bg-white text-foreground hover:bg-white/90" 
      : "bg-primary text-primary-foreground hover:opacity-90"
  }`;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 ease-out ${
        shouldBeTransparent ? "bg-transparent" : "bg-background shadow-sm"
      }`}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: isVisible ? "transform 500ms ease-out" : "transform 300ms ease-out",
      }}
    >
      <div className="w-[94%] lg:w-[84%] max-w-[1440px] mx-auto flex items-center justify-between h-[74px] md:h-[92px] gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center" aria-label="Concept Design Construct home">
          {logoSrc ? (
            <ResponsiveImage
              src={logoSrc}
              alt="Concept Design Construct"
              width={701}
              height={131}
              sizes="(min-width: 768px) 192px, 144px"
              loading="eager"
              priority
              className="h-auto w-36 md:w-48"
            />
          ) : (
            <div className="h-10 md:h-12 w-36 md:w-48 bg-muted animate-pulse" />
          )}
        </Link>

        {/* Tablet + Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-7 xl:gap-9 whitespace-nowrap">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              {...getPrefetchHandlers(link.href)}
              className={`text-label transition-all duration-300 hover:opacity-60 ${
                shouldBeTransparent ? "text-white" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/get-quote" {...getPrefetchHandlers("/get-quote")} className={`${ctaClass} whitespace-nowrap`}>
            Get Your Renovation Plan
          </Link>
          <a href="tel:1300020232" className={`${ctaClass} whitespace-nowrap`}>
            1300 020 232
          </a>
        </nav>

        {/* Mobile actions (phones only) */}
        <div className="md:hidden flex items-center gap-2">
          {!isHome && (
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest text-foreground border border-foreground/30 px-3 py-1 rounded-full"
            >
              Home
            </Link>
          )}
          <button
            className="p-2 flex flex-col gap-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px transition-all ${shouldBeTransparent ? "bg-white" : "bg-foreground"} ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`w-5 h-px transition-all ${shouldBeTransparent ? "bg-white" : "bg-foreground"} ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px transition-all ${shouldBeTransparent ? "bg-white" : "bg-foreground"} ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation (phones only) */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border/30">
          <div className="container-wide py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                {...getPrefetchHandlers(link.href)}
                className="text-label text-foreground hover:opacity-60 transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/get-quote"
              {...getPrefetchHandlers("/get-quote")}
              className="text-label bg-primary text-primary-foreground px-5 py-2 inline-block w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Your Renovation Plan
            </Link>
            <a
              href="tel:1300020232"
              className="text-label bg-primary text-primary-foreground px-5 py-2 inline-block w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              Call Now
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
