"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Waves } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate homes in Mermaid Beach?",
    answer:
      "Yes, we regularly renovate homes throughout Mermaid Beach, from original beach shacks to modern architect-designed homes. We understand the coastal conditions and design homes that embrace the beachside lifestyle.",
  },
  {
    question: "How much does a renovation cost in Mermaid Beach?",
    answer:
      "Mermaid Beach renovation costs typically range from $50,000 for a bathroom renovation to $200,000+ for a whole-home transformation. Beachfront properties often require specialised materials and finishes to withstand salt air, which we factor into our quotes.",
  },
  {
    question: "Can you work with the coastal conditions in Mermaid Beach?",
    answer:
      "Absolutely. We understand the challenges of coastal renovating - salt air, sand, and humidity. We specify materials and finishes designed to withstand these conditions while maintaining a beautiful aesthetic that suits beachside living.",
  },
  {
    question: "Do you do outdoor living renovations in Mermaid Beach?",
    answer:
      "Yes, we specialise in creating indoor-outdoor flow that Mermaid Beach homes are famous for. This includes deck additions, outdoor kitchens, pool surrounds, and alfresco areas that connect your home to the beach lifestyle.",
  },
];

const mermaidImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/editorial-5.webp",
  coastal: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/lifestyle-calm.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Gold-Coast-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/lifestyle-bathroom.webp",
  outdoor: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/editorial-6.webp",
};

export default function MermaidBeachRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Mermaid Beach Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Mermaid Beach. Kitchen, bathroom and whole-home renovations for beachside homes. QBCC licensed. Based in Broadbeach - your local Gold Coast builder."
        url="/mermaid-beach-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Coastal Renovation Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Mermaid Beach Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations in Mermaid Beach. We understand 
                the unique character of beachside homes - from original 70s shacks to modern 
                coastal architecture. Designed for the salt air and sunshine.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Mermaid Beach Consultation
                </Link>
                <a
                  href="tel:1300020232"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 1300 020 232
                </a>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={mermaidImages.hero}
                alt="Mermaid Beach renovation by Concept Design Construct"
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

      {/* Coastal Living */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={mermaidImages.coastal}
                alt="Coastal living renovation in Mermaid Beach"
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
                <Waves className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">Beachside Living</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Designed for Coastal Conditions
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Mermaid Beach homes face unique challenges - salt air, humidity, and intense sun. 
                We specify materials and finishes that withstand these conditions while maintaining 
                the relaxed, beachy aesthetic that makes coastal living so desirable.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Corrosion-resistant fixtures and hardware",
                  "Salt-tolerant exterior finishes",
                  "UV-resistant flooring and surfaces",
                  "Mould-resistant materials for bathrooms",
                  "Indoor-outdoor flow design",
                  "Coastal colour palettes and textures",
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

      {/* Services */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Renovation Services in Mermaid Beach
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={mermaidImages.kitchen}
                  alt="Kitchen renovation in Mermaid Beach"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Coastal Kitchens</h3>
                <p className="text-foreground/70 mb-4">
                  Open-plan kitchens with natural materials, stone benchtops, and finishes 
                  that embrace the beach lifestyle. Designed for entertaining and family life.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={mermaidImages.bathroom}
                  alt="Bathroom renovation in Mermaid Beach"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Spa Bathrooms</h3>
                <p className="text-foreground/70 mb-4">
                  Resort-style bathrooms with natural stone, freestanding baths, and 
                  premium fixtures. Your own private retreat after a day at the beach.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={mermaidImages.outdoor}
                  alt="Outdoor living renovation in Mermaid Beach"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Outdoor Living</h3>
                <p className="text-foreground/70 mb-4">
                  Decks, outdoor kitchens, and alfresco areas that blur the line between 
                  indoor comfort and outdoor beach living.
                </p>
                <Link to="/renovation-services" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">15+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Mermaid Beach Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">🏖️</div>
              <div className="text-4xl font-serif text-primary mb-2">Coastal</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Specialists</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">10min</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">From Broadbeach</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Mermaid Beach Renovation FAQs
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
            Ready to Renovate Your Mermaid Beach Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your Mermaid Beach renovation. 
            We&apos;ll assess your home and provide a detailed quote.
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
