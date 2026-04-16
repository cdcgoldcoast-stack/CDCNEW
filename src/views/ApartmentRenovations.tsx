"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Building2, Shield, Volume2, Maximize2 } from "lucide-react";

const features = [
  "Body corporate approval management",
  "High-rise & low-rise experience",
  "Space maximisation design",
  "Premium compact finishes",
  "Noise & access compliance",
  "Strata regulation expertise",
  "QBCC licensed & insured",
];

const processSteps = [
  {
    step: "01",
    title: "Site & Strata Review",
    description:
      "We inspect your apartment, review body corporate by-laws, and identify any building-specific requirements before design begins.",
  },
  {
    step: "02",
    title: "Design & Approvals",
    description:
      "Detailed design with 3D visualisation, material selection, body corporate application, and fixed-price quoting.",
  },
  {
    step: "03",
    title: "Construction",
    description:
      "Professional construction within strata working hours, with service elevator coordination, noise management, and regular updates.",
  },
  {
    step: "04",
    title: "Handover",
    description:
      "Final inspection, cleaning, and walkthrough. All compliance certificates and warranty documentation provided.",
  },
];

const serviceFaqs = [
  {
    question: "How much does an apartment renovation cost on the Gold Coast?",
    answer:
      "Apartment renovation costs on the Gold Coast typically range from $30,000 for a kitchen or bathroom refresh to $150,000+ for a full apartment transformation. Costs depend on apartment size, scope of work, and level of finishes. We provide detailed fixed-price quotes after an on-site inspection and body corporate review.",
  },
  {
    question: "How long does an apartment renovation take?",
    answer:
      "Most apartment renovations take 4-10 weeks depending on scope. A single-room renovation such as a kitchen or bathroom can be completed in 4-6 weeks, while full apartment renovations typically take 8-10 weeks. Body corporate working hour restrictions and service elevator availability can influence the timeline.",
  },
  {
    question: "Do you handle body corporate approvals for apartment renovations?",
    answer:
      "Yes, managing body corporate approvals is a core part of our apartment renovation service. We prepare all required documentation, architectural drawings, and renovation applications. We also coordinate with building managers regarding noise restrictions, working hours, service elevator bookings, and waste removal.",
  },
  {
    question: "Can you renovate a high-rise apartment on the Gold Coast?",
    answer:
      "Absolutely. We have extensive experience renovating apartments in high-rise buildings across the Gold Coast, from Surfers Paradise to Broadbeach and beyond. We understand the unique logistics including material delivery via service elevators, noise curfews, and building-specific rules.",
  },
  {
    question: "What are the biggest challenges with apartment renovations?",
    answer:
      "The main challenges include body corporate compliance, restricted working hours (often 7am-5pm weekdays), noise management, material logistics in high-rise buildings, and working within compact spaces. Our experience with strata renovations means we plan for all of these from day one, ensuring a smooth process for you and your neighbours.",
  },
  {
    question: "Can you make a small apartment feel more spacious?",
    answer:
      "Yes, space maximisation is central to our apartment renovation designs. Techniques include open-plan layouts, integrated storage, light colour palettes, mirror placement, streamlined cabinetry, and clever lighting design. We create detailed 3D renders so you can see how the space will feel before work begins.",
  },
];

const apartmentImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
  apartment:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  bathroom:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  living:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp",
};

const ApartmentRenovations = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Apartment Renovations | Strata & Body Corporate Specialists | CD Construct"
        description="Specialist apartment and unit renovations on the Gold Coast. Body corporate compliant, strata-experienced builders. High-rise and low-rise renovations. QBCC licensed."
        url="/apartment-renovations-gold-coast"
      />
      <Header />
      <main id="main-content">

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Apartment Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Gold Coast Apartment Renovations
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Specialist apartment renovations for Gold Coast high-rise and low-rise
                buildings. We handle <strong>body corporate approvals, strata compliance,
                and building logistics</strong> so you can focus on choosing the finishes
                you love.
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
                  Get an Apartment Quote
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
                src={apartmentImages.hero}
                alt="Gold Coast apartment renovation by Concept Design Construct"
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

      {/* Why Choose Us for Apartments */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Why Choose Us</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-5">
              Apartment Renovation Expertise
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Renovating an apartment is different from renovating a house. It requires
              strata knowledge, body corporate management, and experience working within
              the unique constraints of multi-level buildings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: Building2,
                title: "Body Corporate Management",
                description:
                  "We prepare and submit all body corporate renovation applications, attend to building manager requirements, and coordinate access schedules. Our experience with Gold Coast strata schemes ensures approvals are handled efficiently.",
              },
              {
                icon: Volume2,
                title: "Noise & Access Compliance",
                description:
                  "We work strictly within building-mandated hours, manage noise levels to minimise neighbour impact, and coordinate service elevator bookings for material deliveries and waste removal.",
              },
              {
                icon: Maximize2,
                title: "Space Maximisation",
                description:
                  "Apartment living demands smart use of every square metre. Our designs incorporate built-in storage, open-plan layouts, reflective surfaces, and streamlined cabinetry to make spaces feel larger and more functional.",
              },
              {
                icon: Shield,
                title: "Premium Compact Finishes",
                description:
                  "We source high-quality fixtures and finishes sized appropriately for apartment spaces. Slim-profile appliances, wall-hung vanities, and integrated storage keep the look clean and spacious.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="bg-cream p-8 md:p-10 border border-foreground/5"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-foreground/75 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Apartment Types Section */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Renovation Types</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-5">
              Apartment Renovations We Deliver
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              From single-room upgrades to complete apartment transformations, we handle
              projects of every scale across the Gold Coast&apos;s high-rise and low-rise buildings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Kitchen Renovations",
                description:
                  "Modern apartment kitchens with space-efficient cabinetry, integrated appliances, and premium finishes that maximise preparation and storage space.",
                image: apartmentImages.apartment,
              },
              {
                title: "Bathroom Renovations",
                description:
                  "Waterproofing-led bathroom renovations with wall-hung fixtures, frameless screens, and premium tiling. Full compliance certificates included.",
                image: apartmentImages.bathroom,
              },
              {
                title: "Full Apartment Makeovers",
                description:
                  "Complete apartment transformations including kitchens, bathrooms, flooring, lighting, and open-plan conversions for a cohesive, modern result.",
                image: apartmentImages.living,
              },
            ].map((type) => (
              <article
                key={type.title}
                className="group bg-background border border-foreground/10 overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={type.image}
                    alt={`${type.title} in Gold Coast apartment`}
                    width={600}
                    height={450}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    loading="lazy"
                    quality={60}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
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
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary-foreground/85 mb-4">
                Investment Guide
              </p>
              <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
                Apartment Renovation Costs
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Apartment renovation costs depend on the scope, size of the apartment, and
                level of finishes selected. Here&apos;s a general guide for Gold Coast
                apartment projects.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Kitchen or bathroom refresh: $30,000-$50,000",
                  "Mid-range full renovation: $60,000-$100,000",
                  "Premium full apartment: $100,000-$150,000+",
                  "Body corporate approvals: included in our service",
                  "Typical timeline: 4-10 weeks",
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
                src={apartmentImages.living}
                alt="Modern apartment living renovation Gold Coast"
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
              How We Deliver Your Apartment Renovation
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              A strata-aware process designed specifically for apartment renovations,
              ensuring body corporate compliance, neighbour consideration, and a
              high-quality result.
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

      {/* Related Services */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={apartmentImages.apartment}
                alt="Apartment kitchen renovation Gold Coast"
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
                Explore Our Other Services
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Whether you&apos;re renovating an apartment or a standalone home, our team
                delivers the same quality craftsmanship and attention to detail across
                all our services.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { label: "Kitchen Renovations", to: "/kitchen-renovations-gold-coast" },
                  { label: "Bathroom Renovations", to: "/bathroom-renovations-gold-coast" },
                  { label: "Whole-Home Renovations", to: "/whole-home-renovations-gold-coast" },
                  { label: "Laundry Renovations", to: "/laundry-renovations-gold-coast" },
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
            Common Apartment Renovation Questions
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
            Ready to Renovate Your Apartment?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
            Book a free consultation to discuss your apartment renovation project.
            We&apos;ll review your body corporate requirements, assess your space,
            and provide a detailed quote.
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

export default ApartmentRenovations;
