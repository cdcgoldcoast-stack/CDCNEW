"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, Home } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate waterfront homes in Hope Island?",
    answer:
      "Yes, we have extensive experience renovating waterfront canal homes throughout Hope Island. We understand the premium finishes, marine-grade materials, and design considerations required for Hope Island's prestigious waterfront properties.",
  },
  {
    question: "How much does a luxury renovation cost in Hope Island?",
    answer:
      "Hope Island renovation costs typically range from $50,000 for a high-end bathroom to $250,000+ for comprehensive whole-home upgrades. Hope Island homeowners often invest in premium materials, designer kitchens, and resort-style bathrooms that match the suburb's luxury lifestyle.",
  },
  {
    question: "Can you renovate within Hope Island gated communities?",
    answer:
      "Absolutely. We regularly work within Hope Island's gated estates and understand the access requirements, community guidelines, and approval processes involved. We coordinate with body corporates and community managers to ensure a smooth renovation experience.",
  },
  {
    question: "Do you work on golf course properties in Hope Island?",
    answer:
      "Yes, we renovate homes overlooking Hope Island's golf courses. We design living spaces that frame those green views, with large windows, seamless indoor-outdoor transitions, and finishes that complement the resort-style setting Hope Island is known for.",
  },
];

const hopeIslandImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Hope_Island_Renovation_Gold_Coast.webp",
  resort: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-renovation-hope-island-concept-design-construct.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Hope_Island_Renovation_Bathroom.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Hope_Island_Renovation_GC_Bath_Tub.webp",
};

export default function HopeIslandRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
      <SEO
        title="Hope Island Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Luxury renovation builders in Hope Island. Kitchen, bathroom and whole-home renovations for waterfront, golf course and resort-style homes. QBCC licensed Gold Coast builder."
        url="/hope-island-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Luxury Renovation Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Hope Island Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Premium kitchen, bathroom and whole-home renovations for Hope Island&apos;s
                finest properties. From waterfront canal homes to golf course estates, we
                deliver luxury finishes that match this prestigious address.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Hope Island Consultation
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
                src={hopeIslandImages.hero}
                alt="Hope Island luxury home renovation by Concept Design Construct"
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

      {/* Resort-Style Home Renovations */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={hopeIslandImages.resort}
                alt="Resort-style renovation in Hope Island"
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
                <span className="text-xs uppercase tracking-wider text-primary">Premium Living</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Resort-Style Home Renovations
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Hope Island is synonymous with resort-style living - golf courses, marinas,
                and waterfront canals surrounded by lush tropical landscaping. Your home
                renovation should reflect that same standard of luxury. We use premium
                materials, bespoke cabinetry, and considered design to elevate every room.
              </p>
              <ul className="space-y-3">
                {[
                  "Premium stone and engineered surfaces",
                  "Designer fixtures and tapware",
                  "Seamless indoor-outdoor entertaining spaces",
                  "Maximising waterfront and golf course views",
                  "Custom joinery and built-in storage",
                  "High-end appliances and smart home integration",
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
            Hope Island Renovation Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={hopeIslandImages.kitchen}
                  alt="Luxury kitchen renovation in Hope Island"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Designer Kitchens</h3>
                <p className="text-foreground/70 mb-4">
                  Expansive kitchens with waterfall stone islands, integrated appliances,
                  butler&apos;s pantries, and finishes worthy of Hope Island&apos;s finest homes.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={hopeIslandImages.bathroom}
                  alt="Luxury bathroom renovation in Hope Island"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Luxury Bathrooms</h3>
                <p className="text-foreground/70 mb-4">
                  Spa-inspired ensuites and bathrooms with freestanding baths, rain showers,
                  natural stone, and heated flooring for a true resort experience.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={hopeIslandImages.living}
                  alt="Whole-home renovation in Hope Island"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Whole-Home Luxury</h3>
                <p className="text-foreground/70 mb-4">
                  Complete home transformations that bring cohesive luxury design to every
                  room, from grand entries to alfresco entertaining areas.
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
              <div className="text-4xl font-serif text-primary mb-2">15+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Hope Island Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Premium</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Materials & Finishes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Gated</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Community Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Hope Island Renovation FAQs
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
            Ready to Elevate Your Hope Island Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your Hope Island renovation. We&apos;ll help you
            create the luxury living spaces that this premium address deserves.
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


      </main>
      <Footer />
    </div>
  );
}
