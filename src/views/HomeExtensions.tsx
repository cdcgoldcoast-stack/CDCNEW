"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Home, Ruler, FileCheck, Layers } from "lucide-react";

const features = [
  "Ground floor room additions",
  "Second storey additions",
  "Granny flat design & construction",
  "Garage conversions",
  "Council DA & BA approvals handled",
  "Structural engineering coordination",
  "Seamless integration with existing home",
  "QBCC licensed & insured",
];

const processSteps = [
  {
    step: "01",
    title: "Feasibility & Design",
    description:
      "We assess your property, discuss your needs, and develop preliminary designs. We identify council requirements, setbacks, and structural considerations early.",
  },
  {
    step: "02",
    title: "Approvals & Engineering",
    description:
      "Detailed architectural drawings, structural engineering, and council submissions. We manage DA and BA applications and coordinate with building certifiers.",
  },
  {
    step: "03",
    title: "Construction",
    description:
      "Professional construction with regular inspections, clear communication, and strict quality control. We manage all trades and keep you updated throughout.",
  },
  {
    step: "04",
    title: "Completion & Handover",
    description:
      "Final inspections, compliance certificates, cleaning, and a thorough walkthrough. Full warranty documentation provided at handover.",
  },
];

const serviceFaqs = [
  {
    question: "How much does a home extension cost on the Gold Coast?",
    answer:
      "Home extension costs on the Gold Coast vary significantly based on size and complexity. Ground floor room additions typically start from $80,000-$150,000, second storey additions from $150,000-$300,000+, and granny flats from $120,000-$200,000. These ranges include council approvals, engineering, and construction. We provide detailed fixed-price quotes after a thorough site assessment.",
  },
  {
    question: "How long does a home extension take to build?",
    answer:
      "Home extensions typically take 8-20 weeks of construction time, depending on size and complexity. Ground floor additions are usually 8-12 weeks, while second storey additions may take 14-20 weeks. Allow an additional 4-8 weeks prior to construction for design, engineering, and council approvals.",
  },
  {
    question: "Do you handle council approvals for home extensions?",
    answer:
      "Yes, we manage the entire approval process from start to finish. This includes preparing architectural drawings, engaging structural engineers, submitting Development Applications (DA) and Building Applications (BA) to the City of Gold Coast, and coordinating with private building certifiers. We keep you informed at every stage.",
  },
  {
    question: "Can you add a second storey to my existing home?",
    answer:
      "In most cases, yes. Second storey additions are one of our core services. We begin with a structural assessment of your existing home to determine what reinforcement may be needed. Our designs ensure the new level integrates seamlessly with the existing architecture, both structurally and aesthetically.",
  },
  {
    question: "Will a home extension match my existing home?",
    answer:
      "Seamless integration is a priority in every extension we build. We carefully match rooflines, cladding, window styles, and interior finishes so the extension looks like it was always part of the home. Our designers work closely with you to ensure architectural consistency throughout.",
  },
  {
    question: "Can I live in my home during a home extension?",
    answer:
      "For most ground floor extensions and granny flats, yes. We stage the work to minimise disruption and maintain safe access to your home. Second storey additions may require temporary relocation during certain phases, particularly when the existing roof is removed. We discuss this during the planning stage so you can prepare.",
  },
];

const extensionImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations-Gold-Coast.webp",
  extension:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
  living:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/service-living.webp",
  kitchen:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
};

const HomeExtensions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Home Extensions | Room Additions & Second Storey | CD Construct"
        description="Home extensions and room additions on the Gold Coast. Second storey additions, granny flats & garage conversions. Council approvals handled. QBCC licensed builders."
        url="/home-extensions-gold-coast"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Extension Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Gold Coast Home Extensions
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Need more space? A home extension is often the smartest way to grow your
                living area without the cost and disruption of moving. We design and build
                <strong> seamless extensions</strong> that look and feel like they&apos;ve
                always been part of your home.
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
                  Discuss Your Extension
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
                src={extensionImages.hero}
                alt="Gold Coast home extension by Concept Design Construct"
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

      {/* Extension Types Section */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Extension Types</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
              Ways To Extend Your Home
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Every home and family is different. We offer a range of extension solutions
              to add the space you need, whether it&apos;s a single room or an entire
              new level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: Home,
                title: "Ground Floor Additions",
                description:
                  "Extend your home outward with additional bedrooms, living areas, or expanded open-plan spaces. We match existing rooflines and finishes for a seamless result that adds value and livability.",
              },
              {
                icon: Layers,
                title: "Second Storey Additions",
                description:
                  "Double your living space without touching your yard. Second storey additions are ideal for growing families on the Gold Coast who want to keep their outdoor areas intact while gaining bedrooms, bathrooms, and living space above.",
              },
              {
                icon: Ruler,
                title: "Granny Flats & Ancillary Dwellings",
                description:
                  "Self-contained granny flats for extended family, rental income, or a home office. We handle design, council approvals, and construction of fully compliant secondary dwellings on your property.",
              },
              {
                icon: FileCheck,
                title: "Garage Conversions",
                description:
                  "Transform an underused garage into functional living space such as a bedroom, home office, rumpus room, or studio. A cost-effective way to add usable area without building from the ground up.",
              },
            ].map((type) => (
              <article
                key={type.title}
                className="bg-cream p-8 md:p-10 border border-foreground/5"
              >
                <type.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">
                  {type.title}
                </h3>
                <p className="text-foreground/75 leading-relaxed mb-4">
                  {type.description}
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

      {/* Seamless Integration Section with Image */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Our Approach</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                Seamless Integration With Your Existing Home
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                The hallmark of a quality extension is that it looks like it was always
                part of the original home. We achieve this by carefully matching
                architectural details, materials, and finishes throughout.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Matching rooflines, cladding, and window styles",
                  "Consistent interior finishes and flooring",
                  "Structural engineering for load-bearing connections",
                  "Integrated electrical and plumbing systems",
                  "Landscape restoration after construction",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={extensionImages.extension}
                alt="Seamless home extension on the Gold Coast"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cost Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-primary-foreground/10">
              <ResponsiveImage
                src={extensionImages.living}
                alt="Extended living area on the Gold Coast"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/60 mb-4">
                Investment Guide
              </p>
              <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
                Home Extension Costs
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Home extensions are a significant investment, but typically cost less than
                buying a new, larger home when you factor in stamp duty, agent fees, and
                moving costs. Here&apos;s a guide to Gold Coast extension pricing.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Ground floor room addition: $80,000-$150,000",
                  "Second storey addition: $150,000-$300,000+",
                  "Granny flat (self-contained): $120,000-$200,000",
                  "Garage conversion: $40,000-$80,000",
                  "Council approvals & engineering: included",
                  "Typical construction timeline: 8-20 weeks",
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
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                How We Deliver Your Home Extension
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Home extensions involve more planning and approvals than standard
                renovations. Our structured process ensures nothing is missed, from
                initial feasibility through to final handover.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={extensionImages.kitchen}
                alt="Home extension kitchen renovation Gold Coast"
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
                <span className="text-4xl md:text-5xl font-serif text-primary/20">
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

      {/* Related Services */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={extensionImages.extension}
                alt="Home renovation and extension portfolio Gold Coast"
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
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                Renovate While You Extend
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Many of our extension clients take the opportunity to renovate existing
                rooms at the same time. Combining your extension with a kitchen, bathroom,
                or whole-home renovation can save time and ensure a cohesive result.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { label: "Kitchen Renovations", to: "/kitchen-renovations-gold-coast" },
                  { label: "Bathroom Renovations", to: "/bathroom-renovations-gold-coast" },
                  { label: "Whole Home Renovations", to: "/whole-home-renovations-gold-coast" },
                  { label: "Outdoor Living & Decks", to: "/outdoor-renovations-gold-coast" },
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
          <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-8">
            Common Home Extension Questions
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
            Ready to Extend Your Home?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
            Book a free consultation to discuss your home extension project.
            We&apos;ll assess your property, review council requirements, and
            provide a detailed scope and quote.
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

      <Footer />
    </div>
  );
};

export default HomeExtensions;
