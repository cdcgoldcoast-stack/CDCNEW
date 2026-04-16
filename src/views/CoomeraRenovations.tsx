"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Map } from "lucide-react";

const faqs = [
  {
    question: "Can you upgrade builder-grade finishes in my Coomera home?",
    answer:
      "Absolutely. Many Coomera homes are built by volume developers with standard finishes that lack character. We transform these spaces with premium cabinetry, stone benchtops, quality tapware, and thoughtful design touches that turn your Coomera house into a personalised home. It is one of the most common renovation requests we handle in the area.",
  },
  {
    question: "How much does a renovation cost in Coomera?",
    answer:
      "Coomera renovation costs vary by scope. Kitchen upgrades from builder-grade typically range from $25,000-$55,000, bathrooms from $20,000-$40,000, and whole-home renovations from $80,000-$200,000+. Because many Coomera homes are relatively new, structural work is minimal, which helps keep costs manageable compared to older suburbs.",
  },
  {
    question: "Do I need council approval to renovate in Coomera?",
    answer:
      "Most internal renovations in Coomera - such as kitchen and bathroom upgrades - do not require council approval. However, if your Coomera renovation involves structural changes, extensions, or altering the building footprint, Gold Coast City Council approval will be needed. We assess this during your consultation and handle all necessary approvals.",
  },
  {
    question: "How long does a kitchen renovation take in Coomera?",
    answer:
      "A typical Coomera kitchen renovation takes 4-6 weeks from demolition to completion. Because most Coomera homes have relatively modern infrastructure, we can often work more efficiently than in older suburbs. We provide a detailed timeline during your Coomera consultation so you know exactly what to expect.",
  },
];

const images = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-upgrade-upper-coomera-concept-design-construct.webp",
  upgrade: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-renovation-north-lakes-concept-design-construct.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-renovation-pimpama-concept-design-construct.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_Family.webp",
};

export default function CoomeraRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
      <SEO
        title="Coomera Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Coomera upgrading builder-grade homes with premium finishes. Kitchen, bathroom and whole-home renovations for growing families on the Gold Coast."
        url="/coomera-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Local Renovation Builders</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Coomera Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Transforming builder-grade Coomera homes into spaces that truly feel like yours.
                We replace standard developer finishes with premium materials and thoughtful design,
                giving growing families the home they actually want without the cost of moving.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Coomera Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Builder-grade upgrade specialists serving Coomera estates
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.hero}
                alt="Coomera renovation by Concept Design Construct"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager"
                priority
                quality={62}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upgrading Builder-Grade Homes */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.upgrade}
                alt="Builder-grade home upgrade in Coomera"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 mb-6">
                <Map className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">New Home Upgrades</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Upgrading Builder-Grade Homes
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Coomera&apos;s new estates are full of homes that look great from the street but
                feel generic inside. Volume builders use standard cabinetry, basic tapware, and
                cookie-cutter layouts to keep costs down. We take these structurally sound homes
                and inject personality - replacing laminate with stone, swapping builder-basic
                kitchens for custom designs, and adding the quality touches that make your
                Coomera home stand out from the rest of the street.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Stone benchtop upgrades from laminate",
                  "Custom cabinetry replacing standard fitouts",
                  "Premium tapware and fixture upgrades",
                  "Feature lighting and electrical enhancements",
                  "Tiling upgrades in bathrooms and living areas",
                  "Storage solutions for growing families",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services with Images */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            What We Renovate in Coomera
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.kitchen}
                  alt="Kitchen renovation in Coomera"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Kitchen Renovations</h3>
                <p className="text-foreground/70 mb-4">
                  Replacing builder-basic Coomera kitchens with custom designs. Stone benchtops,
                  soft-close drawers, quality appliances, and island benches that become the
                  centrepiece of family life.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.bathroom}
                  alt="Bathroom renovation in Coomera"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Bathroom Renovations</h3>
                <p className="text-foreground/70 mb-4">
                  Upgrading standard Coomera bathrooms with floor-to-ceiling tiles, frameless
                  shower screens, wall-hung vanities, and quality fixtures that elevate your
                  daily routine.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.living}
                  alt="Whole-home renovation in Coomera"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Whole-Home Renovations</h3>
                <p className="text-foreground/70 mb-4">
                  Complete Coomera home upgrades - kitchen, bathrooms, flooring, and living
                  areas all transformed together for a cohesive result that feels like a
                  completely different house.
                </p>
                <Link to="/whole-home-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CDC */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
              Why Coomera Families Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We understand what Coomera homeowners need because we work in this area regularly.
              We know the common builder-grade finishes, we know what upgrades deliver the
              biggest impact, and we deliver on time for families who are living in their
              homes during renovation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Local</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Gold Coast Based</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed &amp; Insured</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">25+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">4.9★</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Client Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Coomera Renovation FAQs
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-foreground/10 pb-6">
                <h3 className="font-serif italic text-lg text-primary mb-2">{faq.question}</h3>
                <p className="text-foreground/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-wide text-center">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
            Ready to Upgrade Your Coomera Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss how we can transform your builder-grade
            Coomera home. We&apos;ll visit your property, discuss your priorities, and show
            you what&apos;s possible within your budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-renovation-consultation"
              className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
            >
              Book Your Free Consultation
            </Link>
            <a
              href="tel:0413468928"
              className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
            >
              Call 0413 468 928
            </a>
          </div>
          <p className="text-sm text-foreground/50 mt-6">
            Builder-grade upgrade experts &bull; QBCC Licensed &bull; 25+ years experience
          </p>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
}
