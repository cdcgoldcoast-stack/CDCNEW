"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Check, Sun } from "lucide-react";

const faqs = [
  {
    question: "What types of homes do you renovate in Currumbin?",
    answer:
      "We renovate a wide range of properties throughout Currumbin, from older beach cottages and established family homes to newer builds near the creek. Many Currumbin renovations focus on creating family-friendly layouts, enhancing outdoor living spaces, and selecting coastal-grade materials suited to the beachside environment.",
  },
  {
    question: "How much does a renovation cost in Currumbin?",
    answer:
      "Currumbin renovation costs depend on your property and scope. Kitchen renovations range from $30,000-$65,000, bathrooms from $25,000-$50,000, and whole-home renovations from $120,000-$300,000+. We use coastal-rated materials for all Currumbin projects and provide transparent, fixed-price quotes.",
  },
  {
    question: "Do you design outdoor living spaces for Currumbin homes?",
    answer:
      "Yes, outdoor living is a key part of many Currumbin renovations. We design and build covered alfresco areas, outdoor kitchens, and seamless indoor-outdoor transitions that suit the relaxed beachside lifestyle. Currumbin properties are perfect for making the most of year-round outdoor entertaining.",
  },
  {
    question: "How long does a kitchen renovation take in Currumbin?",
    answer:
      "A kitchen renovation in Currumbin typically takes 4-6 weeks from demolition to completion. We plan every Currumbin project around your family schedule and work to minimise disruption. For whole-home renovations, timelines range from 10-16 weeks depending on complexity.",
  },
];

const currumbinImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold_Coast_renovation_builders.webp",
  family: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Gold-Coast-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations-Gold-Coast.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
};

export default function CurrumbinRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Currumbin Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Currumbin, Gold Coast. Kitchen, bathroom and whole-home renovations for beachside family homes. Coastal-durable designs with family-friendly layouts."
        url="/currumbin-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Beachside Family Home Builders</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Currumbin Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Family-focused kitchen, bathroom and whole-home renovations for Currumbin
                homeowners. This is one of the Gold Coast&apos;s most loved family suburbs,
                and we design renovations that match - durable, beautiful, and built around
                the way your family actually lives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Currumbin Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Serving Currumbin, Currumbin Valley and Currumbin Waters
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={currumbinImages.hero}
                alt="Currumbin home renovation by Concept Design Construct"
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

      {/* Beachside Family Home Renovations */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={currumbinImages.family}
                alt="Beachside family home renovation in Currumbin"
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
                <Sun className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">Beachside Family Home Renovations</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Designed for Families, Built for the Coast
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Currumbin attracts families who want the best of both worlds - beachside living
                with a nature-filled, community feel. The homes here range from older beach
                cottages and established brick homes to newer builds near Currumbin Creek.
                Whatever your property, our renovations focus on creating spaces where families
                thrive: kitchens that handle busy mornings, bathrooms that survive sandy kids,
                and living areas that open out to decks and gardens for year-round outdoor living.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Family-friendly kitchen layouts",
                  "Durable coastal-grade materials",
                  "Indoor-outdoor living connections",
                  "Hardwearing bathroom finishes",
                  "Covered outdoor entertaining areas",
                  "Nature-inspired design palettes",
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
            What We Renovate in Currumbin
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={currumbinImages.kitchen}
                  alt="Kitchen renovation in Currumbin"
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
                  Kitchens built for Currumbin family life. Generous bench space for homework
                  and cooking, durable surfaces that handle the daily rush, and smart storage
                  that keeps everything organised.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={currumbinImages.bathroom}
                  alt="Bathroom renovation in Currumbin"
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
                  Bathrooms that handle the Currumbin lifestyle - post-beach rinse-offs,
                  sandy towels, and busy school mornings. Premium waterproofing, easy-clean
                  surfaces, and a design that feels like a retreat.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={currumbinImages.living}
                  alt="Whole home renovation in Currumbin"
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
                  Complete Currumbin home transformations. Open up living spaces, connect
                  indoors with outdoors, update every room, and create a home that works as
                  beautifully as the suburb you chose to live in.
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
              Why Currumbin Families Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We build homes that work for real family life in a coastal environment. That means
              materials that last, designs that function, and a build process that respects your time.
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
              <div className="text-4xl font-serif text-primary mb-2">Family</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Focused Designs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Fixed</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Price Contracts</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Currumbin Renovation FAQs
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
            Ready to Renovate Your Currumbin Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Your Currumbin home deserves a renovation that matches the lifestyle. Book a free
            consultation and let&apos;s plan a transformation built for your family and the coast.
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
            Serving Currumbin and surrounds • QBCC Licensed • Free Quotes
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
