import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import WhatWeRenovateSplit from "@/components/WhatWeRenovateSplit";

const Services = () => {
  const { assets } = useSiteAssets();
  const heroImage = assets["service-bg-whole-home"] || assets["service-whole-home"];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Renovation Services"
        description="Explore Gold Coast renovation services for kitchens, bathrooms, whole-home upgrades, and extensions with design-led planning and QBCC licensed builds."
        url="/services"
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Services</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Gold Coast Renovation Services Built Around How You Live
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                From kitchens and bathrooms to whole home renovations and extensions, we design and build
                spaces that improve flow, comfort, and everyday routines.
              </p>
              <Link
                to="/get-quote"
                className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
              >
                Get a Consultation
              </Link>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              {heroImage && (
                <img src={heroImage} alt="Gold Coast home renovation" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services layout */}
      <h2 className="sr-only">Renovation service categories</h2>
      <WhatWeRenovateSplit />

      <Footer />
    </div>
  );
};

export default Services;
