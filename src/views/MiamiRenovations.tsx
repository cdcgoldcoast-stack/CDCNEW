"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, Home } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate older beach homes in Miami?",
    answer:
      "Yes, we specialise in transforming Miami's older fibro and brick beach cottages into contemporary coastal homes. We understand the unique character of Miami properties and design renovations that embrace the beachside lifestyle while modernising every detail.",
  },
  {
    question: "How much does a renovation cost in Miami?",
    answer:
      "Miami renovation costs typically range from $35,000 for a bathroom update to $180,000+ for a full beach cottage transformation. Older Miami homes often benefit from kitchen modernisation, bathroom upgrades, and opening up living areas to capture coastal breezes.",
  },
  {
    question: "Can you work on compact lots in Miami?",
    answer:
      "Absolutely. Many Miami properties sit on smaller beachside blocks, and we have extensive experience maximising space on compact lots. We design clever storage solutions, open-plan layouts, and indoor-outdoor connections that make smaller Miami homes feel spacious.",
  },
  {
    question: "How close are you to Miami on the Gold Coast?",
    answer:
      "Our Broadbeach base is just 10 minutes from Miami, making us one of the closest renovation builders to the suburb. We know the local council requirements, the salt-air building considerations, and the coastal aesthetic that Miami homeowners love.",
  },
];

const miamiImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
  cottage: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp",
};

export default function MiamiRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Miami Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Miami, Gold Coast. Kitchen, bathroom and whole-home renovations for beach cottages and coastal homes. QBCC licensed. Based in Broadbeach."
        url="/miami-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Beachside Renovation Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Miami Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations in Miami. We transform older
                beach cottages and townhouses into stunning coastal homes that suit the
                laid-back Miami lifestyle.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Miami Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={miamiImages.hero}
                alt="Miami beach home renovation by Concept Design Construct"
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

      {/* Beach Cottage to Modern Coastal */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={miamiImages.cottage}
                alt="Beach cottage transformation in Miami Gold Coast"
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
                <Home className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">Coastal Living</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Beach Cottage to Modern Coastal
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Miami is full of older fibro and brick beach cottages that are brimming with
                potential. These homes sit in one of the Gold Coast&apos;s most sought-after
                beachside pockets, between Burleigh Heads and Nobby Beach, and deserve
                renovations that honour their coastal setting while bringing them up to date.
              </p>
              <ul className="space-y-3">
                {[
                  "Transforming fibro cottages into contemporary coastal homes",
                  "Maximising light and airflow on compact lots",
                  "Salt-resistant materials for beachside durability",
                  "Indoor-outdoor living for the Miami lifestyle",
                  "Clever storage for smaller beach homes",
                  "Open-plan layouts that feel spacious",
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
            Miami Renovation Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={miamiImages.kitchen}
                  alt="Kitchen renovation in Miami Gold Coast"
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
                  Light-filled kitchens with durable coastal finishes, stone benchtops,
                  and open layouts that connect to your living spaces and outdoor entertaining.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={miamiImages.bathroom}
                  alt="Bathroom renovation in Miami Gold Coast"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Beach-Style Bathrooms</h3>
                <p className="text-foreground/70 mb-4">
                  Relaxed, resort-feel bathrooms with walk-in showers, natural tones,
                  and finishes that stand up to the salt air and sandy feet.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={miamiImages.living}
                  alt="Whole-home renovation in Miami Gold Coast"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Whole-Home Transformations</h3>
                <p className="text-foreground/70 mb-4">
                  Complete cottage-to-coastal makeovers that reimagine your Miami home
                  from the ground up with cohesive, contemporary design.
                </p>
                <Link to="/whole-home-renovations-gold-coast" className="text-label text-primary hover:underline">
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
              <div className="text-4xl font-serif text-primary mb-2">20+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Miami Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">10min</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">From Broadbeach</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Coastal</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Design Specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Miami Renovation FAQs
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
            Ready to Transform Your Miami Beach Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your Miami renovation. We&apos;ll help you
            turn your beach cottage into the contemporary coastal home you&apos;ve been dreaming of.
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
