"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Check, Waves } from "lucide-react";

const faqs = [
  {
    question: "Do you use coastal-grade materials for Coolangatta renovations?",
    answer:
      "Yes, every Coolangatta renovation we undertake uses materials rated for coastal environments. This includes marine-grade stainless steel fixtures, salt-air resistant cabinetry finishes, and corrosion-proof hardware. Living this close to the beach demands materials that will stand up to the conditions without compromising on style.",
  },
  {
    question: "How much does a renovation cost in Coolangatta?",
    answer:
      "Coolangatta renovation costs vary by property type. Kitchen renovations typically range from $30,000-$60,000, bathrooms from $25,000-$50,000, and whole-home renovations from $100,000-$280,000+. Beach house and apartment renovations in Coolangatta may require coastal-grade materials, which we factor into every quote.",
  },
  {
    question: "Do you renovate apartments and beach houses in Coolangatta?",
    answer:
      "We renovate both apartments and freestanding homes across Coolangatta. For apartments, we manage body corporate requirements and building access. For older beach houses, we specialise in updating tired layouts with contemporary coastal design that captures ocean breezes and natural light.",
  },
  {
    question: "Can you handle council approvals for Coolangatta renovations?",
    answer:
      "Yes, we handle all necessary Gold Coast City Council approvals for Coolangatta renovations. Being a border town, some properties near the NSW border may have specific planning considerations. Our team manages the entire approval process so you can focus on the exciting design decisions.",
  },
];

const coolangattaImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold-Coast-Renovations.webp",
  coastal: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
};

export default function CoolangattaRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
      <SEO
        title="Coolangatta Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Coolangatta, Gold Coast. Kitchen, bathroom and whole-home renovations for coastal properties. Salt-air resistant materials and beachside design expertise."
        url="/coolangatta-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Coastal Renovation Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Coolangatta Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations built to thrive in Coolangatta&apos;s
                beachside environment. From weathered beach houses to high-rise apartments with
                ocean views, we create stunning coastal spaces using materials that stand up to
                the salt air.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Coolangatta Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Serving Coolangatta and the southern Gold Coast
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={coolangattaImages.hero}
                alt="Coolangatta renovation by Concept Design Construct"
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

      {/* Coastal Property Renovations */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={coolangattaImages.coastal}
                alt="Coastal property renovation in Coolangatta"
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
                <span className="text-xs uppercase tracking-wider text-primary">Coastal Property Renovations</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Built for the Beachside
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Coolangatta&apos;s prime position at the southern tip of the Gold Coast means
                properties here face constant exposure to ocean conditions. Renovating in this
                environment demands more than good design - it requires an understanding of
                coastal-grade materials, salt-air corrosion prevention, and weather-resistant
                finishes. Whether you own a classic beach house on the hill or an apartment
                overlooking Snapper Rocks, we select every material with longevity and beauty
                in mind.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Marine-grade stainless steel fixtures",
                  "Salt-air resistant cabinetry finishes",
                  "Corrosion-proof hardware selection",
                  "Weather-resistant outdoor materials",
                  "Body corporate experience for apartments",
                  "Coastal design aesthetic expertise",
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
            What We Renovate in Coolangatta
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={coolangattaImages.kitchen}
                  alt="Kitchen renovation in Coolangatta"
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
                  Coastal kitchens designed to endure and impress. Light, airy layouts with
                  durable stone benchtops, salt-resistant hardware, and finishes inspired by
                  Coolangatta&apos;s relaxed beach aesthetic.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={coolangattaImages.bathroom}
                  alt="Bathroom renovation in Coolangatta"
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
                  Beachside bathrooms with superior waterproofing, anti-corrosion tapware, and
                  natural-toned tiles that echo Coolangatta&apos;s coastal surroundings. Built
                  to handle sandy feet and salty air.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={coolangattaImages.living}
                  alt="Whole-home renovation in Coolangatta"
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
                  Full property transformations for Coolangatta homes and apartments. New
                  layouts that capture ocean breezes, updated flooring, and fresh interiors
                  that celebrate coastal living.
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
              Why Coolangatta Residents Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              Coastal renovations demand specialist knowledge. We combine decades of building
              experience with deep understanding of what works in beachside environments.
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
              <div className="text-4xl font-serif text-primary mb-2">Coastal</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Material Experts</p>
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
            Coolangatta Renovation FAQs
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
            Ready to Renovate Your Coolangatta Property?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Whether it&apos;s a beachfront apartment or a classic Coolangatta home, we&apos;ll
            help you create something stunning. Book a free on-site consultation to get started.
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
            Serving Coolangatta and surrounds • QBCC Licensed • Free Quotes
          </p>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
}
