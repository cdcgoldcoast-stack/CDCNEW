"use client";

import { useResolvedAsset } from "@/hooks/useSiteAssets";
import masterBuildersLogo from "@/assets/master-builders.webp";
import qbccLogo from "@/assets/qbcc.webp";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logo = useResolvedAsset("logo", { staticFirst: true, deferRemoteOverrides: true });

  const serviceLinks = [
    { label: "Kitchen Renovations", href: "/kitchen-renovations-gold-coast" },
    { label: "Bathroom Renovations", href: "/bathroom-renovations-gold-coast" },
    { label: "Whole-Home Renovations", href: "/whole-home-renovations-gold-coast" },
    { label: "All Services", href: "/renovation-services" },
  ];

  const locationLinks = [
    { label: "Broadbeach", href: "/broadbeach-renovations" },
    { label: "Burleigh", href: "/renovations/burleigh-heads" },
    { label: "Mermaid Beach", href: "/mermaid-beach-renovations" },
    { label: "Palm Beach", href: "/palm-beach-renovations" },
    { label: "Robina", href: "/robina-renovations" },
    { label: "Southport", href: "/southport-renovations" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Why CDC", href: "/why-cdc" },
    { label: "How We Work", href: "/how-we-work" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
    { label: "Before & After", href: "/before-after" },
    { label: "Renovation Blog", href: "/blog" },
    { label: "Our Projects", href: "/renovation-projects" },
    { label: "Gallery", href: "/renovation-gallery" },
    { label: "Life Stages", href: "/renovation-life-stages" },
    { label: "Referral Program", href: "/referral-program" },
    { label: "Contact Us", href: "/book-renovation-consultation" },
  ];

  return (
    <footer className="py-16 md:py-20 bg-background relative z-10">
      <div className="container-wide px-6 md:px-10 lg:px-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 lg:gap-12">
          
          {/* Column 1: Logo & Contact */}
          <div className="col-span-2 md:col-span-1">
            <ResponsiveImage
              src={logo}
              alt="Concept Design Construct"
              width={701}
              height={131}
              sizes="144px"
              loading="lazy"
              className="h-auto w-36 mb-5"
            />
            <p className="text-label text-primary mb-8">
              Gold Coast Renovations
            </p>
            
            {/* Contact */}
            <div className="space-y-4">
              <a
                href="tel:0413468928"
                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                0413 468 928
              </a>
              <a
                href="mailto:info@cdconstruct.com.au"
                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@cdconstruct.com.au
              </a>
              <div className="flex items-start gap-3 text-sm text-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <address className="not-italic">
                  1907/22 Surf Parade, Broadbeach
                </address>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.instagram.com/conceptdesignconstruct_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/conceptdesignconstruct"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <p className="text-label text-foreground/50 mb-6">Services</p>
            <nav aria-label="Footer services">
              <ul className="flex flex-col gap-4">
                {serviceLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Locations */}
          <div>
            <p className="text-label text-foreground/50 mb-6">Locations</p>
            <nav aria-label="Footer locations">
              <ul className="flex flex-col gap-4">
                {locationLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4: Company */}
          <div>
            <p className="text-label text-foreground/50 mb-6">Company</p>
            <nav aria-label="Footer company">
              <ul className="flex flex-col gap-4">
                {companyLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 5: Accreditation */}
          <div>
            <p className="text-label text-foreground/50 mb-6">Accreditation</p>
            <div className="flex flex-col gap-5">
              <ResponsiveImage
                src={qbccLogo}
                alt="QBCC Licensed"
                width={1080}
                height={1080}
                sizes="56px"
                loading="lazy"
                className="h-14 w-auto"
              />
              <ResponsiveImage
                src={masterBuildersLogo}
                alt="Master Builders"
                width={1080}
                height={1080}
                sizes="56px"
                loading="lazy"
                className="h-14 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Service areas */}
        <div className="mt-16 pt-8 border-t border-foreground/10">
          <p className="text-sm text-foreground/50 text-center">
            Serving: Broadbeach, Burleigh Heads, Mermaid Beach, Robina, Southport, Palm Beach, 
            Elanora, Helensvale, Hope Island & all Gold Coast suburbs
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-foreground/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs uppercase tracking-widest text-foreground/40" suppressHydrationWarning>
              &copy; {currentYear} Concept Design Construct
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/privacy-policy"
                className="text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms-conditions"
                className="text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
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
