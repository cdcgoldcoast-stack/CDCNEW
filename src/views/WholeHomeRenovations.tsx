"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Home } from "lucide-react";

const features = [
  "Complete home design & planning",
  "Structural modifications & extensions",
  "Kitchen & bathroom renovation",
  "Open-plan living transformation",
  "Indoor-outdoor flow improvements",
  "QBCC licensed & insured",
];

const processSteps = [
  {
    step: "01",
    title: "Design & Planning",
    description: "Comprehensive design including floor plans, 3D renders, material selection, and council approval documentation.",
  },
  {
    step: "02",
    title: "Approvals",
    description: "We handle all council approvals, building certification, and documentation required for your renovation.",
  },
  {
    step: "03",
    title: "Construction",
    description: "Professional demolition, structural work, and construction with milestone-based progress updates.",
  },
  {
    step: "04",
    title: "Finishing",
    description: "Kitchen and bathroom fit-out, flooring, painting, and final touches to complete your transformation.",
  },
];

const serviceFaqs = [
  {
    question: "How much does a whole-home renovation cost on the Gold Coast?",
    answer:
      "Whole-home renovation costs vary significantly based on size, condition, and specification. A typical 3-4 bedroom home renovation ranges from $150,000-$300,000+. This includes structural changes, kitchen, bathrooms, flooring, electrical, and finishing. We provide detailed fixed-price quotes after design finalisation.",
  },
  {
    question: "How long does a whole-home renovation take?",
    answer:
      "Most whole-home renovations take 4-6 months from demolition to handover. This includes design and approvals (4-8 weeks), construction (3-5 months), and final finishing. Complex structural work or custom elements may extend this timeline. We provide a detailed schedule during planning.",
  },
  {
    question: "Can we live in the house during a whole-home renovation?",
    answer:
      "Usually not for full whole-home renovations. Most clients arrange alternative accommodation during construction. For staged renovations, you may be able to live in parts of the home while other areas are worked on. We can discuss phasing options during consultation.",
  },
  {
    question: "Do whole-home renovations need council approval?",
    answer:
      "Most whole-home renovations require council approval or building certification, especially if they involve structural changes, extensions, or alterations to the building footprint. We handle all approvals, documentation, and building certification as part of our service.",
  },
  {
    question: "Can you match new work to existing character features?",
    answer:
      "Absolutely. We specialise in renovations that respect your home's character while adding modern functionality. Whether it's VJ walls, timber floors, or heritage features, we carefully integrate new work to complement existing elements.",
  },
  {
    question: "Do you do extensions as part of whole-home renovations?",
    answer:
      "Yes, many whole-home renovations include extensions - adding extra bedrooms, expanding living areas, or creating indoor-outdoor flow. We can assess your block's potential and design options that maximise space and value.",
  },
];

const wholeHomeImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/service-bg-whole-home.webp",
  openPlan: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
  extension: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/service-bg-extensions.webp",
  character: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/service-living.webp",
  portfolio: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
};

const WholeHomeRenovations = () => {
  const { assets } = useSiteAssets();
  const heroImage = assets["service-bg-whole-home"] || wholeHomeImages.hero;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Whole-Home Renovations | Design & Build by CD Construct"
        description="Transform your entire Gold Coast home with whole-home renovations. Open-plan living, modern layouts & quality finishes. QBCC licensed builders. Free consultation."
        url="/whole-home-renovations-gold-coast"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Whole-Home Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Gold Coast Whole-Home Renovations
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Transform your entire home with a complete renovation. From structural changes 
                to finishing touches, we create <strong>modern, flowing spaces</strong> that 
                match how you want to live.
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
                  Get a Quote
                </Link>
                <a
                  href="tel:1300020232"
                  className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  1300 020 232
                </a>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={heroImage}
                alt="Gold Coast whole-home renovation by Concept Design Construct"
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

      {/* Renovation Types with Images */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Renovation Types</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
              Transform Your Entire Home
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Whether you want to open up your floor plan, add an extension, or modernise 
              a character home, we deliver complete transformations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Open-Plan Living",
                description: "Remove walls to create flowing kitchen, dining, and living spaces perfect for modern family life and entertaining.",
                image: wholeHomeImages.openPlan,
              },
              {
                title: "Extensions",
                description: "Add space with rear extensions, second-storey additions, or granny flats that seamlessly connect to your existing home.",
                image: wholeHomeImages.extension,
              },
              {
                title: "Character Modernisation",
                description: "Update Queenslanders, post-war homes, and character properties while preserving their unique charm and features.",
                image: wholeHomeImages.character,
              },
            ].map((type) => (
              <article key={type.title} className="group bg-background border border-foreground/10 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={type.image}
                    alt={`${type.title} whole-home renovation on the Gold Coast`}
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
                    to="/renovation-projects"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
                  >
                    View Projects <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section with Image */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12 md:mb-16">
            <div>
              <p className="text-label text-primary mb-4">Our Process</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                How We Deliver Your Home Transformation
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                A structured approach that ensures your whole-home renovation is delivered 
                on time, on budget, and to the highest quality standards.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={wholeHomeImages.living}
                alt="Whole-home renovation process by Concept Design Construct"
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
                <span className="text-4xl md:text-5xl font-serif text-primary/20">{step.step}</span>
                <h3 className="font-serif text-xl text-primary mt-4 mb-3">{step.title}</h3>
                <p className="text-foreground/75 text-sm leading-relaxed">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Includes Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 mb-6">
                <Home className="w-5 h-5" />
                <span className="text-xs uppercase tracking-wider">Complete Service</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
                What&apos;s Included
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-8">
                Our whole-home renovations cover every aspect of your transformation. 
                One contract, one timeline, one team responsible for the entire project.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Architectural design & 3D renders",
                "Council approvals & certification",
                "Structural modifications",
                "Kitchen renovation",
                "Bathroom renovations",
                "Electrical & plumbing upgrades",
                "Flooring & tiling",
                "Painting & finishing",
                "Air conditioning",
                "Window & door upgrades",
                "Decking & outdoor areas",
                "Final cleaning & handover",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/90 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio CTA with Image */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={wholeHomeImages.portfolio}
                alt="Portfolio of Gold Coast whole-home renovations"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-label text-primary mb-4">Portfolio</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                See Our Whole-Home Transformations
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-8">
                Browse our portfolio of completed whole-home renovations across the Gold Coast. 
                From 70s brick homes to Queenslanders, see the transformations we&apos;ve delivered.
              </p>
              <Link
                to="/renovation-projects"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                View Projects <ArrowRight className="w-4 h-4" />
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
            Common Whole-Home Renovation Questions
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
            Ready to Transform Your Home?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
            Book a free consultation to discuss your whole-home renovation. 
            We&apos;ll assess your property, understand your vision, and provide a detailed quote.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/book-renovation-consultation"
              className="inline-block bg-background text-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Book Free Consultation
            </Link>
            <a
              href="tel:1300020232"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-primary-foreground/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 1300 020 232
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WholeHomeRenovations;
