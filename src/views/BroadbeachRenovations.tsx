"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Building2 } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate apartments in Broadbeach?",
    answer:
      "Yes, we specialise in apartment renovations throughout Broadbeach. We understand body corporate requirements, work hour restrictions, and the logistics of renovating in high-rise buildings. From compact kitchen updates to full apartment transformations, we deliver quality results that maximize space and style.",
  },
  {
    question: "How much does a renovation cost in Broadbeach?",
    answer:
      "Broadbeach renovation costs vary by property type. Apartment kitchen renovations typically range from $30,000-$60,000, bathrooms from $25,000-$45,000, and whole-home renovations from $100,000-$250,000+. We're based in Broadbeach, so our local knowledge helps us provide accurate quotes for your specific building.",
  },
  {
    question: "Do you work with body corporates in Broadbeach?",
    answer:
      "Absolutely. We regularly work with Broadbeach body corporates and understand the approval processes, insurance requirements, and working hour restrictions. We handle all necessary documentation and communications with your building manager to ensure a smooth renovation process.",
  },
  {
    question: "How long do apartment renovations take in Broadbeach?",
    answer:
      "Most Broadbeach apartment renovations take 4-8 weeks depending on scope. Kitchens typically take 4-6 weeks, bathrooms 3-5 weeks, and full apartment renovations 6-10 weeks. We work within building restrictions and coordinate access to minimize disruption to neighbours.",
  },
];

const broadbeachImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/editorial-2.webp",
  apartment: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/urban-oasis.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-upgrade-varsity-lakes-gold-coast-concept-design-construct.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
};

export default function BroadbeachRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Broadbeach Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Broadbeach. Kitchen, bathroom and whole-home renovations with design-led planning. We're based in Broadbeach - your local Gold Coast builder."
        url="/broadbeach-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Local Renovation Builders</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Broadbeach Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations in Broadbeach. We&apos;re based right 
                here in Broadbeach, so we understand the unique challenges of renovating apartments 
                and homes in this vibrant coastal suburb.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Broadbeach Consultation
                </Link>
                <a
                  href="tel:1300020232"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 1300 020 232
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                📍 Based in Broadbeach • 5 minutes from your door
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={broadbeachImages.hero}
                alt="Broadbeach renovation by Concept Design Construct"
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

      {/* Apartment Specialists */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={broadbeachImages.apartment}
                alt="Broadbeach apartment renovation"
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
                <span className="text-xs uppercase tracking-wider text-primary">Apartment Specialists</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Broadbeach Apartment Renovations
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Broadbeach is home to some of the Gold Coast&apos;s most desirable apartments. 
                We specialise in transforming these spaces - from compact studios to luxury penthouses. 
                We understand body corporate requirements, building access logistics, and how to 
                maximise space in apartment layouts.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Body corporate approval handling",
                  "Work hour compliance",
                  "Service elevator coordination",
                  "Space-maximising designs",
                  "Noise minimisation protocols",
                  "Waste removal logistics",
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
            What We Renovate in Broadbeach
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={broadbeachImages.kitchen}
                  alt="Kitchen renovation in Broadbeach"
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
                  Apartment kitchens designed for maximum functionality. Island benches, 
                  quality appliances, and smart storage that make the most of every square metre.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={broadbeachImages.bathroom}
                  alt="Bathroom renovation in Broadbeach"
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
                  Spa-like bathrooms with premium fixtures and waterproofing. Transform your 
                  ensuite or main bathroom into a luxury retreat.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={broadbeachImages.living}
                  alt="Whole home renovation in Broadbeach"
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
                  Complete apartment transformations. Open-plan living, new flooring, 
                  updated electrics - a fresh start in your Broadbeach location.
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
              Why Broadbeach Residents Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We&apos;re not just builders who work in Broadbeach - we&apos;re based here. 
              Our office is in your suburb, which means faster response times and local knowledge.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">📍</div>
              <div className="text-4xl font-serif text-primary mb-2">Local</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Based in Broadbeach</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">🏢</div>
              <div className="text-4xl font-serif text-primary mb-2">Experienced</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Apartment Specialists</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">✓</div>
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed & Insured</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">25+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Broadbeach Renovation FAQs
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
            Ready to Renovate Your Broadbeach Property?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation. We&apos;re based in Broadbeach, so we can meet you 
            at your property quickly to discuss your renovation plans.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-renovation-consultation"
              className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
            >
              Book Your Free Consultation
            </Link>
            <a
              href="tel:1300020232"
              className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
            >
              Call 1300 020 232
            </a>
          </div>
          <p className="text-sm text-foreground/50 mt-6">
            📍 Based in Broadbeach • QBCC Licensed • Local Knowledge
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
