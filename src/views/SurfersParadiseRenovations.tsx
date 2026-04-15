"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Building2 } from "lucide-react";

const faqs = [
  {
    question: "Do you specialise in high-rise apartment renovations in Surfers Paradise?",
    answer:
      "Yes, we are experienced high-rise renovation specialists in Surfers Paradise. We understand the unique logistics of working in towers - from service elevator bookings and materials handling to body corporate approvals and restricted work hours. We have completed renovations across many Surfers Paradise buildings.",
  },
  {
    question: "How much does an apartment renovation cost in Surfers Paradise?",
    answer:
      "Surfers Paradise apartment renovation costs depend on the scope and finishes selected. Kitchen renovations typically range from $35,000-$70,000, bathrooms from $25,000-$50,000, and full apartment renovations from $120,000-$300,000+. Penthouse and luxury fit-outs can exceed these ranges depending on specifications.",
  },
  {
    question: "Can you renovate while I rent out my Surfers Paradise apartment?",
    answer:
      "We work with many Surfers Paradise investors who want to renovate between tenancies. We can plan and schedule your renovation to fit between bookings, minimising vacancy time. A well-executed renovation in Surfers Paradise can significantly increase rental returns and property value.",
  },
  {
    question: "What body corporate requirements apply to Surfers Paradise renovations?",
    answer:
      "Surfers Paradise buildings typically require body corporate approval before renovations begin. This includes submitting plans, proof of insurance, and contractor details. Work hours are usually restricted to weekdays, and noise-generating tasks must follow building rules. We handle all of this documentation and liaison on your behalf.",
  },
];

const images = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
  apartment: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
};

export default function SurfersParadiseRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
      <SEO
        title="Surfers Paradise Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Luxury apartment and penthouse renovations in Surfers Paradise. Kitchen, bathroom and whole-home transformations with body corporate expertise. Your Gold Coast high-rise renovation specialists."
        url="/surfers-paradise-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Local Renovation Builders</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Surfers Paradise Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Luxury apartment, penthouse and unit renovations in Surfers Paradise. From ocean-view
                kitchens to spa-like bathrooms, we transform high-rise living spaces with premium
                finishes and meticulous attention to body corporate requirements.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Surfers Paradise Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                High-rise specialists serving all Surfers Paradise towers
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.hero}
                alt="Surfers Paradise renovation by Concept Design Construct"
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

      {/* High-Rise & Apartment Specialists */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.apartment}
                alt="Surfers Paradise luxury apartment renovation"
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
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">High-Rise Specialists</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                High-Rise &amp; Apartment Specialists
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Surfers Paradise is home to some of Australia&apos;s most iconic residential towers.
                Renovating in these buildings demands a builder who understands the logistics of
                high-rise construction - restricted access, service elevator schedules, materials
                handling, and the premium finishes that residents expect. We bring that expertise
                to every Surfers Paradise project.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Body corporate approval management",
                  "Service elevator and access coordination",
                  "Premium fixtures and luxury finishes",
                  "Ocean-view kitchen and living designs",
                  "Noise and dust containment protocols",
                  "Investment property renovation planning",
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
            What We Renovate in Surfers Paradise
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.kitchen}
                  alt="Kitchen renovation in Surfers Paradise"
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
                  Luxury kitchens designed for apartment living. Stone benchtops, integrated appliances,
                  and clever storage solutions that transform compact Surfers Paradise kitchens into
                  stunning entertaining spaces.
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
                  alt="Bathroom renovation in Surfers Paradise"
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
                  Resort-style bathrooms with frameless glass, rain showers, and premium tiles.
                  We create spa-like retreats in Surfers Paradise apartments that rival the
                  best hotel bathrooms.
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
                  alt="Whole home renovation in Surfers Paradise"
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
                  Complete apartment and penthouse transformations. New flooring, updated lighting,
                  modern living areas - a total refresh that brings your Surfers Paradise
                  property into a new era.
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
              Why Surfers Paradise Residents Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We&apos;ve built our reputation renovating apartments and penthouses across Surfers
              Paradise. Our team understands high-rise logistics, luxury expectations, and the
              standards this iconic suburb demands.
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
            Surfers Paradise Renovation FAQs
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
            Ready to Renovate Your Surfers Paradise Property?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your apartment, penthouse or unit renovation.
            We&apos;ll visit your Surfers Paradise property, assess the scope, and provide
            a detailed plan tailored to your building&apos;s requirements.
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
            High-rise specialists &bull; QBCC Licensed &bull; Body corporate experienced
          </p>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
}
