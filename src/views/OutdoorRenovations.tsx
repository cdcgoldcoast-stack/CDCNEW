"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Sun, UtensilsCrossed, TreePine, Fence } from "lucide-react";

const features = [
  "Timber & composite deck construction",
  "Alfresco dining & entertainment areas",
  "Outdoor kitchen design & build",
  "Pergola & shade structures",
  "Pool surrounds & carports",
  "Council approvals handled",
  "QBCC licensed & insured",
];

const processSteps = [
  {
    step: "01",
    title: "Site & Council Assessment",
    description:
      "We inspect your outdoor space, check council setback requirements, assess drainage and ground conditions, and discuss how you want to use the area — entertaining, relaxing, or both.",
  },
  {
    step: "02",
    title: "Material Selection & Design",
    description:
      "We recommend materials suited to Gold Coast conditions — composite vs hardwood decking, roofing options, and outdoor kitchen specifications. Everything is chosen for durability in salt air and UV.",
  },
  {
    step: "03",
    title: "Ground Works & Build",
    description:
      "Site preparation, footings, frame construction, roofing, and decking installation. For outdoor kitchens, we coordinate plumbing, gas, and electrical in parallel.",
  },
  {
    step: "04",
    title: "Finishing & Handover",
    description:
      "Final staining or sealing, lighting installation, and hardware fitted. We walk the completed space with you and provide maintenance guidance specific to your materials and location.",
  },
];

const serviceFaqs = [
  {
    question: "How much does an outdoor renovation cost on the Gold Coast?",
    answer:
      "Outdoor renovation costs vary widely depending on scope. A quality timber or composite deck starts from around $15,000, alfresco areas with roofing from $25,000-$50,000, and full outdoor kitchens with entertainment areas from $40,000-$80,000+. We provide detailed fixed-price quotes after an on-site assessment of your space and requirements.",
  },
  {
    question: "How long does an outdoor renovation take?",
    answer:
      "Most outdoor renovation projects take 3-8 weeks depending on complexity. A standard deck build can be completed in 3-4 weeks, while larger projects involving alfresco areas, outdoor kitchens, and pergolas typically take 6-8 weeks. Weather can occasionally cause minor delays during the Gold Coast wet season.",
  },
  {
    question: "Do outdoor structures need council approval on the Gold Coast?",
    answer:
      "Many outdoor structures on the Gold Coast require development approval from the City of Gold Coast council, particularly roofed structures, carports, and builds close to property boundaries. We handle the entire approval process including architectural drawings, engineering, and DA/BA submissions so you don&apos;t have to.",
  },
  {
    question: "What decking materials do you recommend for the Gold Coast climate?",
    answer:
      "For the Gold Coast&apos;s subtropical climate, we recommend composite decking (such as ModWood or Trex) for low maintenance and durability, or hardwood timbers like Spotted Gum and Merbau for a natural look. Both options handle humidity, UV exposure, and coastal conditions well. We advise on the best option based on your budget and lifestyle.",
  },
  {
    question: "Can you build an outdoor kitchen on an existing deck?",
    answer:
      "In many cases, yes. We assess the existing structure to ensure it can support the additional weight of benchtops, appliances, and cabinetry. If structural upgrades are needed, we handle those as part of the project. All gas and plumbing connections are completed by licensed tradespeople.",
  },
  {
    question: "Do you build pool surrounds and decking?",
    answer:
      "Yes, pool surrounds and poolside decking are a core part of our outdoor renovation services. We use slip-resistant materials suitable for wet areas and can integrate seating, planter boxes, and shade structures into the design. All work complies with pool fencing and safety regulations.",
  },
];

const outdoorImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations-Gold-Coast.webp",
  deck: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  outdoor:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  living:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
};

const OutdoorRenovations = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Outdoor Living & Deck Renovations | CD Construct"
        description="Outdoor living renovations on the Gold Coast including decks, alfresco areas, outdoor kitchens & pergolas. Council-approved builds with quality materials. QBCC licensed."
        url="/outdoor-renovations-gold-coast"
      />
      <Header />
      <main id="main-content">

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Outdoor Living Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Gold Coast Outdoor &amp; Deck Renovations
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Make the most of the Gold Coast lifestyle with
                <strong> stunning outdoor living spaces</strong> designed for entertaining,
                relaxing, and enjoying the Queensland climate year-round. From timber decks
                to full alfresco kitchens, we build it all.
              </p>
              <ul className="space-y-3 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Get an Outdoor Quote
                </Link>
                <a
                  href="tel:0413468928"
                  className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  0413 468 928
                </a>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={outdoorImages.hero}
                alt="Gold Coast outdoor living renovation by Concept Design Construct"
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager"
                priority
                quality={62}
                responsiveWidths={[360, 480, 640, 768, 960, 1200]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Our Services</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-5">
              Outdoor Spaces Built For Gold Coast Living
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              From intimate entertaining decks to expansive alfresco areas with full
              outdoor kitchens, we design and build spaces that extend your home into the
              outdoors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: TreePine,
                title: "Decks & Platforms",
                description:
                  "Hardwood timber and composite decking built to withstand the Gold Coast climate. Ground-level platforms, elevated decks, and multi-level designs with quality balustrades and lighting.",
              },
              {
                icon: UtensilsCrossed,
                title: "Outdoor Kitchens",
                description:
                  "Purpose-built outdoor cooking areas with BBQ stations, stone benchtops, sinks, refrigeration, and weatherproof cabinetry. Connected gas and plumbing by licensed tradespeople.",
              },
              {
                icon: Sun,
                title: "Alfresco & Pergolas",
                description:
                  "Covered entertaining areas with insulated roofing, ceiling fans, lighting, and optional screening. Designed for year-round comfort in the Gold Coast heat and rain.",
              },
              {
                icon: Fence,
                title: "Pool Surrounds & Carports",
                description:
                  "Slip-resistant pool decking, shade structures, and council-approved carports. Integrated seating, planter boxes, and storage solutions built to last.",
              },
            ].map((service) => (
              <article
                key={service.title}
                className="bg-cream p-8 md:p-10 border border-foreground/5"
              >
                <service.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground/75 leading-relaxed mb-4">
                  {service.description}
                </p>
                <Link
                  to="/book-renovation-consultation"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
                >
                  Discuss Your Project <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cost & Materials Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-primary-foreground/10">
              <ResponsiveImage
                src={outdoorImages.deck}
                alt="Timber deck construction on the Gold Coast"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/85 mb-4">
                Investment Guide
              </p>
              <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
                Outdoor Renovation Costs
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Outdoor renovations are an excellent investment on the Gold Coast, extending
                your usable living space and adding significant value to your property.
                Costs depend on the type and scale of work.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Timber or composite deck: $15,000-$35,000",
                  "Alfresco area with roofing: $25,000-$50,000",
                  "Outdoor kitchen: $20,000-$45,000",
                  "Full outdoor entertainment area: $50,000-$80,000+",
                  "Typical timeline: 3-8 weeks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/book-renovation-consultation"
                className="inline-block bg-background text-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Get a Fixed-Price Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12 md:mb-16">
            <div>
              <p className="text-label text-primary mb-4">Our Process</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-5">
                How We Build Your Outdoor Space
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                A proven process that ensures your outdoor renovation is built right,
                approved by council, and delivered on time and on budget.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={outdoorImages.outdoor}
                alt="Outdoor renovation process by Concept Design Construct"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {processSteps.map((step) => (
              <article key={step.step} className="bg-background p-6 md:p-8">
                <span className="text-4xl md:text-5xl font-serif text-primary/40">
                  {step.step}
                </span>
                <h3 className="font-serif text-xl text-primary mt-4 mb-3">
                  {step.title}
                </h3>
                <p className="text-foreground/75 text-sm leading-relaxed">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio CTA Section */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={outdoorImages.living}
                alt="Outdoor living renovation portfolio Gold Coast"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-label text-primary mb-4">Related Services</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-5">
                Extend Your Renovation Indoors
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Many of our outdoor renovation clients also upgrade their indoor living
                areas to create a seamless indoor-outdoor flow. Consider combining your
                outdoor project with interior renovations for a cohesive result.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { label: "Kitchen Renovations", to: "/kitchen-renovations-gold-coast" },
                  { label: "Whole-Home Renovations", to: "/whole-home-renovations-gold-coast" },
                  { label: "Home Extensions", to: "/home-extensions-gold-coast" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-2 text-primary hover:opacity-70 transition-opacity"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/renovation-projects"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                View Our Portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide max-w-4xl">
          <p className="text-label text-primary mb-4">FAQs</p>
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-8">
            Common Outdoor Renovation Questions
          </h2>
          <div className="space-y-6">
            {serviceFaqs.map((faq) => (
              <article
                key={faq.question}
                className="border-b border-foreground/10 pb-6"
              >
                <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="text-foreground/75 leading-relaxed">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide text-center max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
            Ready to Transform Your Outdoor Space?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
            Book a free consultation to discuss your outdoor renovation project.
            We&apos;ll visit your property, assess the space, and provide a detailed
            quote for your dream outdoor area.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/book-renovation-consultation"
              className="inline-block bg-background text-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Book Free Consultation
            </Link>
            <a
              href="tel:0413468928"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-primary-foreground/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 0413 468 928
            </a>
          </div>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
};

export default OutdoorRenovations;
