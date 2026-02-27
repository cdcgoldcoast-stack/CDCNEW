"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Shield } from "lucide-react";

const features = [
  "Complete bathroom design & 3D renders",
  "Certified waterproofing (10-year warranty)",
  "Premium fixtures & fittings",
  "Floor & wall tiling",
  "Plumbing, electrical & ventilation",
  "QBCC licensed & insured",
];

const processSteps = [
  {
    step: "01",
    title: "Consultation",
    description: "We assess your bathroom, discuss your vision, and provide initial guidance on layout and budget.",
  },
  {
    step: "02",
    title: "Design & Planning",
    description: "Detailed bathroom design with 3D visualisation, fixture selection, and comprehensive quoting.",
  },
  {
    step: "03",
    title: "Construction",
    description: "Professional demolition, waterproofing, tiling, and fixture installation with strict quality control.",
  },
  {
    step: "04",
    title: "Handover",
    description: "Final inspection, waterproofing certificate, cleaning, and warranty documentation.",
  },
];

const serviceFaqs = [
  {
    question: "How much does a bathroom renovation cost on the Gold Coast?",
    answer:
      "Bathroom renovation costs vary based on size and specification. A standard bathroom renovation typically starts from $25,000-$35,000, while luxury bathrooms with high-end fixtures and tiling can range from $40,000-$60,000+. We provide detailed fixed-price quotes after design finalisation.",
  },
  {
    question: "How long does a bathroom renovation take?",
    answer:
      "Most bathroom renovations take 3-5 weeks from demolition to completion. This includes waterproofing (with mandatory curing time), tiling, fixture installation, and final finishes. Complex layouts or imported materials may extend this timeframe slightly.",
  },
  {
    question: "Do bathroom renovations need council approval on the Gold Coast?",
    answer:
      "Bathroom renovations typically don't require council approval unless structural walls are being moved or the building footprint is changing. All our bathroom work includes compliant waterproofing certificates and plumbing approvals as required by Queensland law.",
  },
  {
    question: "What waterproofing warranty do you provide?",
    answer:
      "We provide a 10-year waterproofing warranty on all bathroom renovations, exceeding the standard 7-year requirement. Our waterproofing is carried out by licensed applicators and includes full flood testing before tiling begins.",
  },
  {
    question: "Can you renovate my bathroom while keeping the same layout?",
    answer:
      "Yes, many clients choose to keep the existing layout to reduce costs and simplify the project. We can transform your bathroom with new fixtures, tiles, vanity, and finishes without moving plumbing points, delivering a fresh look at a lower price point.",
  },
  {
    question: "Do you supply bathroom fixtures and tiles?",
    answer:
      "We can supply all fixtures and tiles or work with your selections. Our trade accounts with major suppliers often secure better pricing than retail. We guide you through showrooms and provide recommendations based on your style and budget.",
  },
];

// Bathroom project images
const bathroomImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  ensuite: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations-Gold-Coast.webp",
  family: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovation-Bathroom.webp",
  luxury: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-upgrade-maudsland-concept-design-construct.webp",
  process: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  portfolio: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
};

const BathroomRenovations = () => {
  const { assets } = useSiteAssets();
  const heroImage = assets["service-bg-bathroom"] || bathroomImages.hero;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Bathroom Renovations | Design & Build by CD Construct"
        description="Gold Coast bathroom renovations with waterproofing-led construction, quality fixtures, and timeless design. Ensuite, family bathroom & powder room specialists. QBCC licensed."
        url="/bathroom-renovations-gold-coast"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Bathroom Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Gold Coast Bathroom Renovations
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Beautiful, functional bathrooms built with quality waterproofing and expert craftsmanship. 
                From ensuites to family bathrooms, we deliver <strong>spaces that combine 
                luxury with lasting durability</strong>.
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
                  Get a Bathroom Quote
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
                src={heroImage}
                alt="Gold Coast bathroom renovation by Concept Design Construct"
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

      {/* Waterproofing Section with Image */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-primary-foreground/10">
              <ResponsiveImage
                src={bathroomImages.process}
                alt="Bathroom waterproofing and tiling process"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 mb-6">
                <Shield className="w-5 h-5" />
                <span className="text-xs uppercase tracking-wider">10-Year Waterproofing Warranty</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
                Waterproofing-First Construction
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Waterproofing is the foundation of every bathroom we build. Our licensed applicators 
                use premium membrane systems and follow strict Australian Standards (AS 3740). 
                Every bathroom includes flood testing and a 10-year waterproofing warranty 
                for complete peace of mind.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Licensed waterproofing applicators",
                  "Premium membrane systems",
                  "Full flood testing before tiling",
                  "10-year written warranty",
                  "Compliance certificates provided",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bathroom Types Section with Images */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Bathroom Types</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
              Bathrooms For Every Space
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Whether it&apos;s a compact ensuite or a luxurious family bathroom, 
              we design and build spaces that maximise functionality and style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Ensuite Renovations",
                description: "Transform your private retreat with smart storage, quality fixtures, and spa-like features designed for relaxation.",
                image: bathroomImages.ensuite,
              },
              {
                title: "Family Bathrooms",
                description: "Durable, practical spaces that handle busy mornings with ease. Double vanities, ample storage, and easy-clean surfaces.",
                image: bathroomImages.family,
              },
              {
                title: "Luxury Bathrooms",
                description: "Make a statement with high-end finishes, freestanding baths, and premium fixtures for a truly indulgent experience.",
                image: bathroomImages.luxury,
              },
            ].map((type) => (
              <article key={type.title} className="group bg-background border border-foreground/10 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={type.image}
                    alt={`${type.title} by Concept Design Construct`}
                    width={600}
                    height={450}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    loading="lazy"
                    quality={60}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">{type.title}</h3>
                  <p className="text-foreground/75 leading-relaxed mb-4">{type.description}</p>
                  <Link
                    to="/book-renovation-consultation"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
                  >
                    Discuss Your Project <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Our Process</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
              How We Deliver Your Dream Bathroom
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              A proven, quality-focused process that ensures your bathroom renovation 
              is completed to the highest standards, on time and on budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {processSteps.map((step) => (
              <article key={step.step} className="bg-background p-6 md:p-8">
                <span className="text-4xl md:text-5xl font-serif text-primary/20">{step.step}</span>
                <h3 className="font-serif text-xl text-primary mt-4 mb-3">{step.title}</h3>
                <p className="text-foreground/75 text-sm leading-relaxed">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects CTA with Image */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-label text-primary mb-4">Portfolio</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                See Our Bathroom Renovations
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-8">
                Browse our portfolio of completed bathroom renovations across the Gold Coast. 
                From compact ensuites to luxury family bathrooms, see what&apos;s possible.
              </p>
              <Link
                to="/renovation-projects"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                View Bathroom Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 lg:order-2 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={bathroomImages.portfolio}
                alt="Portfolio of Gold Coast bathroom renovations"
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

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide max-w-4xl">
          <p className="text-label text-primary mb-4">FAQs</p>
          <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-8">
            Common Bathroom Renovation Questions
          </h2>
          <div className="space-y-6">
            {serviceFaqs.map((faq) => (
              <article key={faq.question} className="border-b border-foreground/10 pb-6">
                <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">{faq.question}</h3>
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
            Ready to Start Your Bathroom Renovation?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
            Book a free consultation to discuss your bathroom renovation project. 
            We&apos;ll assess your space, understand your needs, and provide a detailed quote.
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

export default BathroomRenovations;
