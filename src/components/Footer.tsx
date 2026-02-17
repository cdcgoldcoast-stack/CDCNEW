import { useResolvedAsset } from "@/hooks/useSiteAssets";
import masterBuildersLogo from "@/assets/master-builders.webp";
import qbccLogo from "@/assets/qbcc.webp";
import { Facebook, Instagram } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { FOOTER_SITELINK_TARGETS } from "@/config/seo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logo = useResolvedAsset("logo");

  const navLinks = FOOTER_SITELINK_TARGETS.map((target) => ({
    label: target.label,
    href: target.path,
  }));

  const projectLinks = [
    { label: "Everyday Ease", href: "/renovation-projects/everyday-ease" },
    { label: "Family Hub", href: "/renovation-projects/family-hub" },
    { label: "Light and Flow House", href: "/renovation-projects/light-and-flow-house" },
    { label: "Seamless Bathroom", href: "/renovation-projects/seamless-bathroom" },
    { label: "Stone and Light", href: "/renovation-projects/stone-and-light" },
    { label: "Terrazzo Retreat", href: "/renovation-projects/terrazzo-retreat" },
    { label: "The Calm Edit", href: "/renovation-projects/the-calm-edit" },
    { label: "The Elanora Residence", href: "/renovation-projects/the-elanora-residence" },
    { label: "Warm Minimal Bathroom", href: "/renovation-projects/warm-minimal-bathroom" },
  ];

  return (
    <footer className="py-12 md:py-16 lg:py-20 bg-background relative z-10">
      <div className="container-wide px-6 md:px-10 lg:px-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Logo & tagline */}
          <div className="md:col-span-3 flex flex-col">
            <ResponsiveImage
              src={logo}
              alt="Concept Design Construct Gold Coast renovation builders logo"
              width={701}
              height={131}
              sizes="(min-width: 768px) 176px, 144px"
              loading="lazy"
              className="h-auto w-36 md:w-44"
            />
            <strong className="text-xs uppercase tracking-widest text-primary mt-3">
              Gold Coast Renovations
            </strong>
            <span className="text-[10px] text-primary/50 mt-1">
              Serving Gold Coast
            </span>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Navigate</p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3">
              {navLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              </ul>
            </nav>
          </div>

          {/* Project case studies */}
          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Gold Coast Renovation Projects</p>
            <nav aria-label="Footer projects">
              <ul className="flex flex-col gap-3">
              {projectLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              </ul>
            </nav>
          </div>

          {/* Contact & certifications */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Contact</p>
              <a
                className="text-xs uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-colors duration-300 block mb-3"
                href="mailto:info@cdconstruct.com.au"
              >
                info@cdconstruct.com.au
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/conceptdesignconstruct_"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Concept Design Construct on Instagram"
                  className="text-foreground/60 hover:text-primary transition-colors duration-300 inline-flex items-center"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/conceptdesignconstruct"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Concept Design Construct on Facebook"
                  className="text-foreground/60 hover:text-primary transition-colors duration-300 inline-flex items-center"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Accreditation</p>
              <div className="flex items-center gap-4">
                <ResponsiveImage
                  src={qbccLogo}
                  alt="QBCC Licensed Builder"
                  width={1080}
                  height={1080}
                  sizes="56px"
                  loading="lazy"
                  className="h-14 w-auto"
                />
                <ResponsiveImage
                  src={masterBuildersLogo}
                  alt="Master Builders Australia"
                  width={1080}
                  height={1080}
                  sizes="56px"
                  loading="lazy"
                  className="h-14 w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="border-t border-foreground/10 mt-12 md:mt-16 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs uppercase tracking-widest text-foreground/40">
              &copy; {currentYear} Concept Design Construct
            </p>
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-conditions"
                  className="text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors duration-300"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
