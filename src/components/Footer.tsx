import { useResolvedAsset } from "@/hooks/useSiteAssets";
import masterBuildersLogo from "@/assets/master-builders.webp";
import qbccLogo from "@/assets/qbcc.webp";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logo = useResolvedAsset("logo");

  const mainLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Renovation Projects", href: "/renovation-projects" },
    { label: "Renovation Gallery", href: "/renovation-gallery" },
    { label: "Book Consultation", href: "/book-renovation-consultation" },
  ];

  const serviceLinks = [
    { label: "Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
    { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
    { label: "Whole-Home Renovations", href: "/whole-home-renovations-gold-coast" },
    { label: "All Services", href: "/renovation-services" },
  ];

  const locationLinks = [
    { label: "Broadbeach", href: "/broadbeach-renovations" },
    { label: "Burleigh Heads", href: "/renovations/burleigh-heads" },
    { label: "Mermaid Beach", href: "/mermaid-beach-renovations" },
    { label: "Palm Beach", href: "/palm-beach-renovations" },
    { label: "Robina", href: "/robina-renovations" },
    { label: "Southport", href: "/southport-renovations" },
  ];

  const featuredProjects = [
    { label: "Family Hub", href: "/renovation-projects/family-hub" },
    { label: "Light and Flow House", href: "/renovation-projects/light-and-flow-house" },
    { label: "The Elanora Residence", href: "/renovation-projects/the-elanora-residence" },
    { label: "View All Projects →", href: "/renovation-projects" },
  ];

  return (
    <footer className="py-10 md:py-14 bg-background relative z-10">
      <div className="container-wide px-6 md:px-10 lg:px-12">
        {/* Main footer grid - 5 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Logo & contact - spans 2 columns on mobile, 1 on desktop */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <ResponsiveImage
              src={logo}
              alt="Concept Design Construct Gold Coast renovation builders logo"
              width={701}
              height={131}
              sizes="(min-width: 768px) 176px, 144px"
              loading="lazy"
              className="h-auto w-36 md:w-44 mb-4"
            />
            <strong className="text-xs uppercase tracking-widest text-primary block mb-1">
              Gold Coast Renovations
            </strong>
            <span className="text-[10px] text-foreground/50 block mb-4">
              Based in Broadbeach
            </span>
            
            {/* Contact info */}
            <div className="space-y-2">
              <a
                href="tel:1300020232"
                className="flex items-center gap-2 text-xs text-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                1300 020 232
              </a>
              <a
                href="mailto:info@cdconstruct.com.au"
                className="text-xs text-foreground/80 hover:text-primary transition-colors block"
              >
                info@cdconstruct.com.au
              </a>
              <div className="flex items-start gap-2 text-xs text-foreground/70">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <address className="not-italic">
                  1907/22 Surf Parade<br />
                  Broadbeach, QLD 4218
                </address>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.instagram.com/conceptdesignconstruct_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/conceptdesignconstruct"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">Services</p>
            <nav aria-label="Footer services">
              <ul className="flex flex-col gap-2">
                {serviceLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-xs text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Locations */}
          <div className="col-span-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">Locations</p>
            <nav aria-label="Footer locations">
              <ul className="flex flex-col gap-2">
                {locationLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-xs text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Featured Projects */}
          <div className="col-span-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">Featured Projects</p>
            <nav aria-label="Footer projects">
              <ul className="flex flex-col gap-2">
                {featuredProjects.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`text-xs transition-colors ${
                        link.label.includes("View All") 
                          ? "text-primary hover:text-primary/80 font-medium" 
                          : "text-foreground/80 hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company & Accreditation */}
          <div className="col-span-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">Company</p>
            <nav aria-label="Footer company" className="mb-6">
              <ul className="flex flex-col gap-2">
                {mainLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-xs text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">Accreditation</p>
            <div className="flex items-center gap-3">
              <ResponsiveImage
                src={qbccLogo}
                alt="QBCC Licensed"
                width={1080}
                height={1080}
                sizes="48px"
                loading="lazy"
                className="h-10 w-auto"
              />
              <ResponsiveImage
                src={masterBuildersLogo}
                alt="Master Builders"
                width={1080}
                height={1080}
                sizes="48px"
                loading="lazy"
                className="h-10 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Service areas summary */}
        <div className="mt-8 pt-6 border-t border-foreground/10">
          <p className="text-[10px] text-foreground/50 text-center">
            Serving: Broadbeach, Burleigh Heads, Mermaid Beach, Robina, Southport, Palm Beach, 
            Elanora, Helensvale, Hope Island & all Gold Coast suburbs
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 border-t border-foreground/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-[10px] uppercase tracking-widest text-foreground/40" suppressHydrationWarning>
              &copy; {currentYear} Concept Design Construct
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/privacy-policy"
                className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms-conditions"
                className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
