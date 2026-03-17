"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, Home } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate established homes in Helensvale?",
    answer:
      "Yes, we regularly renovate homes throughout Helensvale, from the original 1990s estates through to early 2000s properties. We understand the common layouts, construction styles, and the upgrades that make the biggest difference in Helensvale family homes.",
  },
  {
    question: "How much does a renovation cost in Helensvale?",
    answer:
      "Helensvale renovation costs typically range from $35,000 for a bathroom upgrade to $160,000+ for whole-home transformations. Many Helensvale homeowners find that updating their kitchen, opening up the living areas, and modernising bathrooms dramatically improves their home.",
  },
  {
    question: "Can you convert closed-plan Helensvale homes to open-plan?",
    answer:
      "Absolutely. Many 1990s and early 2000s Helensvale homes were built with separate rooms and closed-off kitchens. We specialise in removing walls to create the open-plan kitchen, dining, and living spaces that modern families need - while ensuring structural integrity.",
  },
  {
    question: "How close are you to Helensvale?",
    answer:
      "Our Broadbeach base is around 25 minutes from Helensvale. We regularly work in the area and know the suburb well, including homes near Westfield Helensvale, the tram corridor, and the established estates throughout the suburb.",
  },
];

const helensvaleImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations-Gold-Coast.webp",
  established: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovation-Bathroom.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/hallway-renovation-southport-gold-coast-concept-design-construct.webp",
};

export default function HelensvaleRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Helensvale Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Helensvale. Kitchen, bathroom and whole-home renovations for established family homes. QBCC licensed. Based in Broadbeach - your local Gold Coast builder."
        url="/helensvale-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Family Home Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Helensvale Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations for Helensvale&apos;s established
                family homes. We breathe new life into 1990s and 2000s properties with
                modern layouts, quality finishes, and designs that growing families love.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Helensvale Consultation
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
                src={helensvaleImages.hero}
                alt="Helensvale family home renovation by Concept Design Construct"
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

      {/* Refreshing Established Family Homes */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={helensvaleImages.established}
                alt="Established Helensvale home renovation"
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
                <span className="text-xs uppercase tracking-wider text-primary">Established Homes</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Refreshing Established Family Homes
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Helensvale grew rapidly through the 1990s and early 2000s, and many of
                those original family homes are now ready for a refresh. Closed-off kitchens,
                dated tiles, and separate living rooms no longer suit the way families live
                today. We transform these solid homes into bright, open spaces with
                contemporary style and practical layouts.
              </p>
              <ul className="space-y-3">
                {[
                  "Opening up kitchens to living and dining areas",
                  "Modern open-plan conversions",
                  "Updating dated bathrooms and ensuites",
                  "New flooring, lighting, and paint throughout",
                  "Adding alfresco spaces for family entertaining",
                  "Designs that grow with your family",
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
            Helensvale Renovation Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={helensvaleImages.kitchen}
                  alt="Kitchen renovation in Helensvale"
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
                  Practical, beautiful kitchens built for busy family life - large islands,
                  ample storage, durable surfaces, and open-plan connections to living areas.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={helensvaleImages.bathroom}
                  alt="Bathroom renovation in Helensvale"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Modern Bathrooms</h3>
                <p className="text-foreground/70 mb-4">
                  Replace tired 90s bathrooms with fresh, modern designs featuring
                  walk-in showers, floating vanities, and quality tiles that last.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={helensvaleImages.living}
                  alt="Whole-home renovation in Helensvale"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Whole-Home Refresh</h3>
                <p className="text-foreground/70 mb-4">
                  Complete home updates that tie everything together - new flooring,
                  modern colour palettes, and updated fixtures throughout your Helensvale home.
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
              <div className="text-4xl font-serif text-primary mb-2">25+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Helensvale Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Family</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Home Specialists</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">25min</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">From Broadbeach</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Helensvale Renovation FAQs
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
            Ready to Refresh Your Helensvale Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your Helensvale renovation. We&apos;ll show you
            how to bring your established family home into the modern era with smart design.
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
