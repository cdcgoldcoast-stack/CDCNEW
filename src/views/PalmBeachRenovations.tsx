"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, Users } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate homes in Palm Beach?",
    answer:
      "Yes, we regularly work in Palm Beach on everything from original fibro cottages to modern family homes. We understand the family-friendly nature of Palm Beach and design renovations that suit active lifestyles.",
  },
  {
    question: "How much does a renovation cost in Palm Beach?",
    answer:
      "Palm Beach renovation costs typically range from $40,000 for a bathroom to $180,000+ for whole-home transformations. Family homes often benefit from open-plan designs and outdoor living areas that we can incorporate into your renovation.",
  },
  {
    question: "Can you help with family-friendly designs?",
    answer:
      "Absolutely. Palm Beach is popular with families, and we design with this in mind - durable finishes, open-plan living for supervision, storage solutions, and outdoor connections for kids to play. We understand how families use their homes.",
  },
  {
    question: "Do you do outdoor living areas in Palm Beach?",
    answer:
      "Yes, we specialise in creating outdoor living spaces perfect for the Palm Beach lifestyle - covered decks, outdoor kitchens, pool areas, and secure yards that connect seamlessly with indoor living areas.",
  },
];

const palmBeachImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Gold-Coast.webp",
  family: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Kitchen.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovation-Bathroom.webp",
  outdoor: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/editorial-7.webp",
};

export default function PalmBeachRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Palm Beach Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Palm Beach. Kitchen, bathroom and whole-home renovations for beachside homes. Family-focused designs. QBCC licensed. Based in Broadbeach."
        url="/palm-beach-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Family Home Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Palm Beach Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations in Palm Beach. We design 
                family-friendly spaces that handle real life - open-plan living, durable 
                finishes, and outdoor connections for the perfect beachside family home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Palm Beach Consultation
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
                src={palmBeachImages.hero}
                alt="Palm Beach family home renovation by Concept Design Construct"
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

      {/* Family Focus */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={palmBeachImages.family}
                alt="Family-friendly renovation in Palm Beach"
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
                <Users className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">Family-Focused Design</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Built for Family Life
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Palm Beach is one of the Gold Coast&apos;s most family-friendly suburbs. 
                We design renovations that work for families - open-plan spaces where you 
                can supervise kids, durable finishes that withstand daily life, and 
                outdoor areas that connect to the beach lifestyle.
              </p>
              <ul className="space-y-3">
                {[
                  "Open-plan living for family supervision",
                  "Durable, easy-clean finishes",
                  "Ample storage for family gear",
                  "Indoor-outdoor flow for play",
                  "Beach wash-off areas",
                  "Secure outdoor spaces",
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
            Palm Beach Renovation Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={palmBeachImages.kitchen}
                  alt="Family kitchen renovation in Palm Beach"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Family Kitchens</h3>
                <p className="text-foreground/70 mb-4">
                  Kitchens designed for family life - breakfast bars, ample storage, 
                  durable surfaces, and layouts that keep the cook connected to the family.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={palmBeachImages.bathroom}
                  alt="Family bathroom renovation in Palm Beach"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Family Bathrooms</h3>
                <p className="text-foreground/70 mb-4">
                  Practical bathrooms that handle busy mornings - double vanities, 
                  bath/shower combos, and storage that keeps clutter at bay.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={palmBeachImages.outdoor}
                  alt="Outdoor living renovation in Palm Beach"
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
                  Covered decks, outdoor kitchens, and secure yards that extend your 
                  living space and embrace the Palm Beach lifestyle.
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
              <div className="text-4xl font-serif text-primary mb-2">20+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Palm Beach Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">👨‍👩‍👧‍👦</div>
              <div className="text-4xl font-serif text-primary mb-2">Family</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Focused</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">15min</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">From Broadbeach</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Palm Beach Renovation FAQs
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
            Ready to Renovate Your Palm Beach Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your Palm Beach renovation. 
            We&apos;ll create a family-friendly design that suits your lifestyle.
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
