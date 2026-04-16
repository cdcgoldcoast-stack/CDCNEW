"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Check, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "What kind of renovations do you do in Varsity Lakes?",
    answer:
      "We handle all renovation types in Varsity Lakes, from kitchen and bathroom upgrades to complete home transformations. Many Varsity Lakes homes are relatively modern but benefit from premium finish upgrades, open-plan conversions, and lifestyle enhancements that add significant value to your property.",
  },
  {
    question: "How much does a kitchen renovation cost in Varsity Lakes?",
    answer:
      "Kitchen renovations in Varsity Lakes typically range from $30,000-$60,000 depending on size and specifications. Many Varsity Lakes kitchens were built in the early 2000s and benefit greatly from updated cabinetry, stone benchtops, modern appliances, and improved layouts. We provide fixed-price quotes for all Varsity Lakes projects.",
  },
  {
    question: "Can you create open-plan living in my Varsity Lakes home?",
    answer:
      "Yes, open-plan conversions are one of our most popular renovations in Varsity Lakes. Many homes in the area have separated living, dining, and kitchen zones that can be opened up to create flowing, contemporary spaces. We handle structural assessments, council approvals, and the complete build process.",
  },
  {
    question: "How long does a bathroom renovation take in Varsity Lakes?",
    answer:
      "A standard bathroom renovation in Varsity Lakes takes 3-5 weeks from demolition to completion. This includes waterproofing, tiling, fixtures, and all finishing touches. We plan each Varsity Lakes project carefully to keep disruption to a minimum for your family.",
  },
];

const varsityLakesImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-upgrade-varsity-lakes-gold-coast-concept-design-construct.webp",
  modern: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_Kitchen.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-renovation-currumbin-gold-coast-concept-design-construct.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/living-renovation-robina-gold-coast.webp",
};

export default function VarsityLakesRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
      <SEO
        title="Varsity Lakes Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Varsity Lakes, Gold Coast. Kitchen, bathroom and whole-home upgrades for modern homes. Premium finishes and open-plan transformations near Bond University."
        url="/varsity-lakes-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Modern Home Upgrade Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Varsity Lakes Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Premium kitchen, bathroom and whole-home upgrades for Varsity Lakes homeowners.
                Your home may be modern, but that doesn&apos;t mean it can&apos;t be better. We
                elevate contemporary homes with designer finishes, smarter layouts, and the
                lifestyle features your family deserves.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Varsity Lakes Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Serving Varsity Lakes and the southern Gold Coast
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={varsityLakesImages.hero}
                alt="Varsity Lakes kitchen renovation by Concept Design Construct"
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

      {/* Modern Home Upgrades */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={varsityLakesImages.modern}
                alt="Modern home upgrade in Varsity Lakes"
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
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">Modern Home Upgrades</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Elevating Varsity Lakes Homes
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Varsity Lakes is a vibrant, family-oriented suburb with homes built predominantly
                over the past two decades. While these properties are structurally sound, many
                homeowners are ready for an upgrade - swapping builder-grade finishes for premium
                stone, custom joinery, and design-led spaces. We specialise in taking these
                well-built homes and elevating them with open-plan transformations, luxury
                kitchens, and resort-style bathrooms.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Premium finish upgrades",
                  "Open-plan living conversions",
                  "Custom joinery and cabinetry",
                  "Stone benchtop installations",
                  "Smart home integration",
                  "Lifestyle-focused design",
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
            What We Renovate in Varsity Lakes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={varsityLakesImages.kitchen}
                  alt="Kitchen renovation in Varsity Lakes"
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
                  Replace builder-grade kitchens with custom designs featuring stone benchtops,
                  soft-close cabinetry, premium appliances, and layouts that work for real family
                  life in Varsity Lakes.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={varsityLakesImages.bathroom}
                  alt="Bathroom renovation in Varsity Lakes"
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
                  Upgrade your Varsity Lakes bathroom with contemporary tiling, frameless shower
                  screens, floating vanities, and premium tapware. Functional elegance for every
                  family member.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={varsityLakesImages.living}
                  alt="Whole-home renovation in Varsity Lakes"
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
                  Complete home makeovers for Varsity Lakes families. Open walls, upgrade
                  flooring, refresh every room, and create the modern lifestyle home you&apos;ve
                  been imagining.
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
              Why Varsity Lakes Families Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We understand what young families want from a renovation - more space, better flow,
              and finishes that look stunning but handle the demands of daily life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">25+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed & Insured</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Fixed</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Price Contracts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Local</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Gold Coast Based</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Varsity Lakes Renovation FAQs
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
            Ready to Upgrade Your Varsity Lakes Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Your Varsity Lakes home has great potential. Let&apos;s unlock it together with a
            free consultation where we&apos;ll explore upgrade options, talk finishes, and
            provide a clear quote.
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
            Serving Varsity Lakes and surrounds • QBCC Licensed • Free Quotes
          </p>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
}
