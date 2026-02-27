"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, Home } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate homes in Southport?",
    answer:
      "Yes, we regularly work in Southport on a variety of homes - from character Queenslanders and post-war cottages to modern waterfront properties. We understand the diverse architecture and renovation needs of this historic Gold Coast suburb.",
  },
  {
    question: "How much does a renovation cost in Southport?",
    answer:
      "Southport renovation costs vary widely depending on the property type. Character home renovations typically range from $80,000-$250,000+, while modern home updates range from $50,000-$150,000. Waterfront properties may have additional considerations for materials and access.",
  },
  {
    question: "Can you renovate character homes in Southport?",
    answer:
      "Absolutely. Southport has many beautiful character homes, and we specialise in renovations that preserve their heritage features while adding modern comforts. We understand the requirements for working with Queenslanders, post-war homes, and other character properties.",
  },
  {
    question: "Do you work on waterfront properties in Southport?",
    answer:
      "Yes, we have experience renovating waterfront properties along the Broadwater and canals in Southport. We understand the specific requirements for these locations, including materials that withstand water exposure and designs that maximise water views.",
  },
];

const southportImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/hallway-renovation-southport-gold-coast-concept-design-construct.webp",
  character: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  waterfront: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/editorial-8.webp",
};

export default function SouthportRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Southport Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Southport. Kitchen, bathroom and whole-home renovations for character homes and waterfront properties. QBCC licensed. Based in Broadbeach."
        url="/southport-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Character Home Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Southport Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations in Southport. From heritage 
                Queenslanders to waterfront homes, we preserve character while adding 
                modern comfort and style.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Southport Consultation
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
                src={southportImages.hero}
                alt="Southport character home renovation by Concept Design Construct"
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

      {/* Character Homes */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={southportImages.character}
                alt="Character home renovation in Southport"
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
                <span className="text-xs uppercase tracking-wider text-primary">Heritage Specialists</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Character Home Renovations
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Southport is home to some of the Gold Coast&apos;s most beautiful character 
                properties - Queenslanders, post-war cottages, and heritage homes. We 
                specialise in renovations that respect these homes&apos; history while adding 
                the modern comforts you need.
              </p>
              <ul className="space-y-3">
                {[
                  "Preserve original VJ walls and timber features",
                  "Restore heritage details and fretwork",
                  "Add modern kitchens and bathrooms",
                  "Improve insulation while maintaining character",
                  "Raise and build underneath Queenslanders",
                  "Maintain streetscape appeal",
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
            Southport Renovation Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={southportImages.kitchen}
                  alt="Kitchen renovation in Southport"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Heritage Kitchens</h3>
                <p className="text-foreground/70 mb-4">
                  Modern kitchens designed to complement character homes - shaker cabinets, 
                  traditional profiles, and contemporary functionality.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={southportImages.bathroom}
                  alt="Bathroom renovation in Southport"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Classic Bathrooms</h3>
                <p className="text-foreground/70 mb-4">
                  Bathrooms that blend traditional style with modern luxury - clawfoot tubs, 
                  subway tiles, and period-appropriate fixtures.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={southportImages.waterfront}
                  alt="Waterfront renovation in Southport"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Waterfront Homes</h3>
                <p className="text-foreground/70 mb-4">
                  Renovations for Broadwater and canal-front properties that maximise views 
                  and withstand waterfront conditions.
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
              <div className="text-4xl font-serif text-primary mb-2">25+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Southport Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">🏛️</div>
              <div className="text-4xl font-serif text-primary mb-2">Heritage</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Home Specialists</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">20min</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">From Broadbeach</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Southport Renovation FAQs
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
            Ready to Renovate Your Southport Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your Southport renovation. 
            We&apos;ll respect your home&apos;s character while creating the modern space you need.
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
