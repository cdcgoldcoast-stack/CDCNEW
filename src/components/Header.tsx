"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useResolvedAsset } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { HEADER_SITELINK_TARGETS } from "@/config/seo";

const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger hide/show
const RENOVATION_DROPDOWN_LINKS = [
  { label: "Renovation Projects", href: "/renovation-projects" },
  { label: "Renovation Gallery", href: "/renovation-gallery" },
] as const;
const RENOVATION_DROPDOWN_PATHS: ReadonlySet<string> = new Set(
  RENOVATION_DROPDOWN_LINKS.map((link) => link.href),
);

type DesktopNavItem =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; label: string; links: readonly { label: string; href: string }[] };

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
    link.href = href;
    document.head.appendChild(link);
  }, []);

  const getPrefetchHandlers = (href: string) => ({
    onMouseEnter: () => prefetchRoute(href),
    onTouchStart: () => prefetchRoute(href),
  });

  const baseLinks = HEADER_SITELINK_TARGETS.map((target) => ({
    label: target.label,
    href: target.path,
  }));
  const mobileNavLinks = isHome ? baseLinks : [{ label: "Home", href: "/" }, ...baseLinks];
  const desktopBaseLinks: DesktopNavItem[] = [];
  let hasInsertedRenovationsDropdown = false;

  for (const link of baseLinks) {
    if (RENOVATION_DROPDOWN_PATHS.has(link.href)) {
      if (!hasInsertedRenovationsDropdown) {
        desktopBaseLinks.push({
          type: "dropdown",
          label: "Renovations",
          links: RENOVATION_DROPDOWN_LINKS,
        });
        hasInsertedRenovationsDropdown = true;
      }
      continue;
    }

    desktopBaseLinks.push({ type: "link", ...link });
  }

  if (!hasInsertedRenovationsDropdown) {
    desktopBaseLinks.push({
      type: "dropdown",
      label: "Renovations",
      links: RENOVATION_DROPDOWN_LINKS,
    });
  }

  const desktopNavLinks: DesktopNavItem[] = isHome
    ? desktopBaseLinks
    : [{ type: "link", label: "Home", href: "/" }, ...desktopBaseLinks];
  
  // Always use solid header (no transparent mode)
  const shouldBeTransparent = false;

  const ctaClass = `text-label px-5 py-2 transition-all duration-300 ${
    shouldBeTransparent 
      ? "bg-white text-foreground hover:bg-white/90" 
      : "bg-primary text-primary-foreground hover:opacity-90"
  }`;

  const handleBookConsultationClick = () => {
    trackAnalyticsEvent({
      event_name: "book_consultation_click",
      cta_location: "header",
      lead_type: "consultation",
    });
  };

  const handleCallClick = () => {
    trackAnalyticsEvent({
      event_name: "click_call",
      cta_location: "header",
      lead_type: "phone",
    });
  };

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
      <div className="max-w-[1440px] mx-auto px-4 md:px-7 lg:px-8 flex items-center justify-between h-[74px] md:h-[100px]">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center mr-8" aria-label="Concept Design Construct home">
          {logoSrc ? (
            <ResponsiveImage
              src={logoSrc}
              alt="Concept Design Construct home page logo"
              width={701}
              height={131}
              sizes="(min-width: 1024px) 256px, (min-width: 768px) 224px, 176px"
              loading="lazy"
              fetchPriority="low"
              className="h-auto w-36 md:w-44 lg:w-52"
            />
          ) : (
            <div className="h-10 md:h-12 w-36 md:w-44 lg:w-52 bg-muted animate-pulse" />
          )}
        </Link>

        {/* Desktop Navigation - only shows when viewport is wide enough */}
        <nav className="hidden min-[1440px]:flex items-center gap-5 2xl:gap-7 whitespace-nowrap">
          {desktopNavLinks.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.label}
                to={item.href}
                {...getPrefetchHandlers(item.href)}
                className={`text-[11px] 2xl:text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:opacity-60 ${
                  shouldBeTransparent ? "text-white" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.links.forEach((link) => prefetchRoute(link.href))}
                onFocus={() => item.links.forEach((link) => prefetchRoute(link.href))}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  className={`text-[11px] 2xl:text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:opacity-60 ${
                    shouldBeTransparent ? "text-white" : "text-foreground"
                  }`}
                >
                  {item.label}
                </button>
                <div className="pointer-events-none absolute left-0 top-full pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0">
                  <div
                    className={`min-w-[220px] border py-2 ${
                      shouldBeTransparent
                        ? "bg-black/80 border-white/20"
                        : "bg-background border-border/40 shadow-lg"
                    }`}
                  >
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        {...getPrefetchHandlers(link.href)}
                        className={`block px-4 py-2 text-[11px] 2xl:text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:opacity-60 ${
                          shouldBeTransparent ? "text-white" : "text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ),
          )}
          <Link
            to="/book-renovation-consultation"
            {...getPrefetchHandlers("/book-renovation-consultation")}
            className={`${ctaClass} whitespace-nowrap flex-shrink-0 text-[11px] 2xl:text-xs`}
            onClick={handleBookConsultationClick}
          >
            Book A Renovation Consultation
          </Link>
          <a href="tel:1300020232" className={`${ctaClass} whitespace-nowrap flex-shrink-0 text-[11px] 2xl:text-xs`} onClick={handleCallClick}>
            1300 020 232
          </a>
        </nav>

        {/* Mobile/Tablet actions */}
        <div className="min-[1440px]:hidden flex items-center gap-2">
          {!isHome && (
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest text-foreground border border-foreground/30 px-3 py-1 rounded-full"
            >
              Back To Home
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

      {/* Mobile/Tablet Navigation */}
      {isMenuOpen && (
        <nav className="min-[1440px]:hidden absolute top-full left-0 right-0 bg-background border-t border-border/30">
          <div className="container-wide py-8 flex flex-col gap-6">
            {mobileNavLinks.map((link) => (
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
              to="/book-renovation-consultation"
              {...getPrefetchHandlers("/book-renovation-consultation")}
              className="text-label bg-primary text-primary-foreground px-5 py-2 inline-block w-fit"
              onClick={() => {
                handleBookConsultationClick();
                setIsMenuOpen(false);
              }}
            >
              Book A Renovation Consultation
            </Link>
            <a
              href="tel:1300020232"
              className="text-label bg-primary text-primary-foreground px-5 py-2 inline-block w-fit"
              onClick={() => {
                handleCallClick();
                setIsMenuOpen(false);
              }}
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
