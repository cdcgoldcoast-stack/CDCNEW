import { useResolvedAsset } from "@/hooks/useSiteAssets";
import masterBuildersLogo from "@/assets/master-builders.png";
import qbccLogo from "@/assets/qbcc.png";
import { Instagram } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logo = useResolvedAsset("logo");
  const navLinks = [{
    label: "About Us",
    href: "/about-us"
  }, {
    label: "Projects",
    href: "/projects"
  }, {
    label: "Services",
    href: "/services"
  }, {
    label: "Gallery",
    href: "/gallery"
  }, {
    label: "Life Stages",
    href: "/life-stages"
  }, {
    label: "Design Tools",
    href: "/design-tools"
  }];
    return <footer className="py-8 md:py-10 lg:py-12 bg-background relative z-10">
      <div className="container-wide px-5 md:px-8">
        {/* Top row: Logo left, Nav + email + certs right */}
        <div className="flex flex-col gap-6 md:gap-8 md:flex-row md:justify-between">
          {/* Logo & tagline */}
          <div className="flex flex-col shrink-0">
            <ResponsiveImage
              src={logo}
              alt=""
              width={701}
              height={131}
              sizes="(min-width: 768px) 112px, 80px"
              loading="lazy"
              className="h-auto w-20 md:w-28"
            />
            <span className="text-xs md:text-h4 uppercase tracking-widest text-primary mt-2">
              Gold Coast Renovations
            </span>
            <span className="text-[10px] md:text-xs text-primary/60 mt-0.5">
              Serving Gold Coast
            </span>
          </div>

          {/* Right column: nav, email, certs */}
          <div className="flex flex-col gap-4 md:items-end">
            <nav className="grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:flex-wrap md:justify-end md:gap-x-8 lg:gap-x-10 md:gap-y-3">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs md:text-h4 uppercase tracking-widest text-foreground hover:text-primary transition-colors duration-300 py-0.5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:justify-end">
              <a
                className="text-xs md:text-h4 uppercase tracking-widest text-foreground hover:text-primary transition-colors duration-300 break-all md:break-normal"
                href="mailto:info@cdconstruct.com.au"
              >
                info@cdconstruct.com.au
              </a>
              <a
                href="https://www.instagram.com/conceptdesignconstruct_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Concept Design Construct on Instagram"
                className="text-primary/70 hover:text-primary transition-colors duration-300 inline-flex items-center"
              >
                <Instagram className="w-6 h-6 md:w-7 md:h-7" />
              </a>
            </div>
            <div className="flex items-center gap-4 md:gap-5 flex-wrap md:justify-end">
              <ResponsiveImage
                src={qbccLogo}
                alt=""
                width={1080}
                height={1080}
                sizes="(min-width: 768px) 64px, 40px"
                loading="lazy"
                className="h-10 md:h-16 w-auto"
              />
              <ResponsiveImage
                src={masterBuildersLogo}
                alt=""
                width={1080}
                height={1080}
                sizes="(min-width: 768px) 64px, 40px"
                loading="lazy"
                className="h-10 md:h-16 w-auto"
              />
              <span className="sr-only">QBCC licensed builder and Master Builders Australia member</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-6 md:mt-8 pt-4 md:pt-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            {/* Left: copyright */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs uppercase tracking-widest text-primary/60">
                © {currentYear} Concept Design Construct
              </p>
            </div>

            {/* Right: Legal links */}
            <div className="flex items-center gap-4 md:gap-6">
              <a
                href="/privacy-policy"
                className="text-xs uppercase tracking-widest text-primary/60 hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-conditions"
                className="text-xs uppercase tracking-widest text-primary/60 hover:text-primary transition-colors duration-300"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
