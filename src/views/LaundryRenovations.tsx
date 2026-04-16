"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Droplets, Boxes, Shirt } from "lucide-react";

const features = [
  "Custom laundry cabinetry & joinery",
  "Stone & laminate benchtops",
  "Integrated hamper & storage systems",
  "Utility sinks & plumbing upgrades",
  "Combined bathroom-laundry designs",
  "QBCC licensed & insured",
];

const processSteps = [
  {
    step: "01",
    title: "Consultation",
    description:
      "We assess your current laundry, discuss storage needs, appliance requirements, and design preferences to understand your ideal space.",
  },
  {
    step: "02",
    title: "Design & Quoting",
    description:
      "Detailed cabinetry design, material selection, and a comprehensive fixed-price quote so you know exactly what to expect.",
  },
  {
    step: "03",
    title: "Construction",
    description:
      "Professional demolition, plumbing, cabinetry installation, benchtops, tiling, and finishing with minimal disruption to your home.",
  },
  {
    step: "04",
    title: "Handover",
    description:
      "Final inspection, cleaning, and walkthrough to ensure every detail meets your expectations. Warranty documentation provided.",
  },
];

const serviceFaqs = [
  {
    question: "How much does a laundry renovation cost on the Gold Coast?",
    answer:
      "Laundry renovation costs on the Gold Coast typically range from $8,000 for a basic refresh with new cabinetry and benchtops, up to $25,000 for a full custom laundry with stone benchtops, integrated appliances, and premium fixtures. Combined bathroom-laundry renovations may cost more depending on scope. We provide fixed-price quotes after an on-site consultation.",
  },
  {
    question: "How long does a laundry renovation take?",
    answer:
      "Most laundry renovations are completed within 2-4 weeks, depending on the scope. A simple cabinetry and benchtop upgrade can be finished in under two weeks, while a full renovation including plumbing relocation, tiling, and custom joinery may take up to four weeks. We provide a clear timeline before work begins.",
  },
  {
    question: "Can you combine my laundry and bathroom into one room?",
    answer:
      "Yes, combined bathroom-laundry renovations are one of our specialties. This is a popular option for Gold Coast homes and apartments where space is limited. We design smart layouts that integrate washing machines, dryers, and storage without compromising bathroom functionality or style.",
  },
  {
    question: "Do I need council approval for a laundry renovation?",
    answer:
      "Most laundry renovations don&apos;t require council approval provided the work stays within the existing footprint and doesn&apos;t involve structural changes. If plumbing is being relocated or walls removed, we handle any necessary approvals and certifications as part of our service.",
  },
  {
    question: "What cabinetry options are available for laundry renovations?",
    answer:
      "We offer a range of cabinetry styles including polyurethane, laminate, and timber veneer in a variety of colours and finishes. Options include overhead cupboards, pull-out hampers, broom cupboards, adjustable shelving, and integrated drying areas. All cabinetry is custom-built to maximise your available space.",
  },
  {
    question: "Can you add a utility sink to my laundry?",
    answer:
      "Absolutely. We install a range of utility sinks and trough options, from compact drop-in sinks to large freestanding tubs. Our plumbers handle all connections and drainage to ensure everything is compliant and functional.",
  },
];

const laundryImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/laundry-renovation-bundall-concept-design-construct.webp",
  cabinetry:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Kitchen.webp",
  combined:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  storage:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/hallway-renovation-southport-gold-coast-concept-design-construct.webp",
};

const LaundryRenovations = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Laundry Renovations | Custom Design & Build by CD Construct"
        description="Custom laundry renovations on the Gold Coast with smart storage, quality cabinetry & functional design. Combined bathroom-laundry specialists. QBCC licensed."
        url="/laundry-renovations-gold-coast"
      />
      <Header />
      <main id="main-content">

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Laundry Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Gold Coast Laundry Renovations
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Transform your laundry from a forgotten utility space into a
                <strong> beautiful, organised room</strong> that makes everyday tasks easier.
                Custom cabinetry, smart storage, and quality finishes designed for
                the way you actually use your home.
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
                  Get a Laundry Quote
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
                src={laundryImages.hero}
                alt="Gold Coast laundry renovation by Concept Design Construct"
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

      {/* What We Offer Section */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">What We Offer</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-5">
              Laundry Solutions For Every Home
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Whether you need a simple cabinetry upgrade or a complete laundry transformation,
              we design and build spaces that are practical, stylish, and built to last.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Boxes,
                title: "Custom Storage Solutions",
                description:
                  "Overhead cupboards, pull-out hampers, broom cupboards, and adjustable shelving designed to maximise every centimetre of your laundry space.",
                image: laundryImages.cabinetry,
              },
              {
                icon: Droplets,
                title: "Combined Bathroom-Laundry",
                description:
                  "Clever layouts that integrate laundry functionality into your bathroom without compromising on style. Perfect for apartments and compact homes.",
                image: laundryImages.combined,
              },
              {
                icon: Shirt,
                title: "Drying & Utility Areas",
                description:
                  "Purpose-built drying areas, fold-down ironing stations, and utility sinks that make laundry day far more manageable.",
                image: laundryImages.storage,
              },
            ].map((service) => (
              <article
                key={service.title}
                className="group bg-background border border-foreground/10 overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={service.image}
                    alt={`${service.title} - Gold Coast laundry renovation`}
                    width={600}
                    height={450}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    loading="lazy"
                    quality={60}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <service.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-xl md:text-2xl text-primary">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-foreground/75 leading-relaxed mb-4">
                    {service.description}
                  </p>
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

      {/* Cost & Timeline Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary-foreground/85 mb-4">
                Investment Guide
              </p>
              <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
                Laundry Renovation Costs
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Laundry renovations are one of the most cost-effective ways to add value and
                functionality to your home. Most Gold Coast laundry renovations fall between
                $8,000 and $25,000 depending on scope and finishes.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Basic refresh (cabinetry & benchtop): $8,000-$12,000",
                  "Mid-range renovation: $12,000-$18,000",
                  "Premium custom laundry: $18,000-$25,000",
                  "Combined bathroom-laundry: Quoted on scope",
                  "Typical timeline: 2-4 weeks",
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
            <div className="aspect-[4/3] overflow-hidden bg-primary-foreground/10">
              <ResponsiveImage
                src={laundryImages.cabinetry}
                alt="Custom laundry cabinetry on the Gold Coast"
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

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Our Process</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-5">
              How We Deliver Your New Laundry
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              A straightforward process that keeps your laundry renovation on track
              and delivers a result you&apos;ll love using every day.
            </p>
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

      {/* Related Services Section */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={laundryImages.combined}
                alt="Combined bathroom and laundry renovation Gold Coast"
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
                Renovating More Than Just The Laundry?
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Many of our clients combine their laundry renovation with other areas of
                the home. Bundling projects saves time, reduces overall costs, and ensures
                a cohesive design throughout.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { label: "Bathroom Renovations", to: "/bathroom-renovations-gold-coast" },
                  { label: "Kitchen Renovations", to: "/kitchen-renovations-gold-coast" },
                  { label: "Whole-Home Renovations", to: "/whole-home-renovations-gold-coast" },
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
            Common Laundry Renovation Questions
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
            Ready to Start Your Laundry Renovation?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
            Book a free consultation to discuss your laundry renovation project.
            We&apos;ll assess your space, understand your storage needs, and provide a
            detailed quote.
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

export default LaundryRenovations;
