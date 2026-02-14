import { useResolvedAsset } from "@/hooks/useSiteAssets";
import masterBuildersLogo from "@/assets/master-builders.png";
import qbccLogo from "@/assets/qbcc.png";
import { Instagram } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logo = useResolvedAsset("logo");

  const navLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Life Stages", href: "/life-stages" },
    { label: "Design Tools", href: "/design-tools" },
  ];

  const projectLinks = [
    { label: "Everyday Ease", href: "/projects/everyday-ease" },
    { label: "Family Hub", href: "/projects/family-hub" },
    { label: "Light and Flow House", href: "/projects/light-and-flow-house" },
    { label: "Seamless Bathroom", href: "/projects/seamless-bathroom" },
    { label: "Stone and Light", href: "/projects/stone-and-light" },
    { label: "Terrazzo Retreat", href: "/projects/terrazzo-retreat" },
    { label: "The Calm Edit", href: "/projects/the-calm-edit" },
    { label: "The Elanora Residence", href: "/projects/the-elanora-residence" },
    { label: "Warm Minimal Bathroom", href: "/projects/warm-minimal-bathroom" },
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
              alt="Concept Design Construct"
              width={701}
              height={131}
              sizes="(min-width: 768px) 176px, 144px"
              loading="lazy"
              className="h-auto w-36 md:w-44"
            />
            <span className="text-xs uppercase tracking-widest text-primary mt-3">
              Gold Coast Renovations
            </span>
            <span className="text-[10px] text-primary/50 mt-1">
              Serving Gold Coast
            </span>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Navigate</h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Project case studies */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Projects</h4>
            <nav className="flex flex-col gap-3">
              {projectLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact & certifications */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Contact</h4>
              <a
                className="text-xs uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-colors duration-300 block mb-3"
                href="mailto:info@cdconstruct.com.au"
              >
                info@cdconstruct.com.au
              </a>
              <a
                href="https://www.instagram.com/conceptdesignconstruct_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Concept Design Construct on Instagram"
                className="text-foreground/60 hover:text-primary transition-colors duration-300 inline-flex items-center"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Accreditation</h4>
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
            <div className="flex items-center gap-6">
              <a
                href="/privacy-policy"
                className="text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-conditions"
                className="text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors duration-300"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
