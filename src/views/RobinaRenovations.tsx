"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, Home } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate homes in Robina?",
    answer:
      "Yes, we regularly renovate homes throughout Robina - from established 90s homes to newer properties. We understand the modern family lifestyle that Robina offers and design renovations that suit this vibrant suburb.",
  },
  {
    question: "How much does a renovation cost in Robina?",
    answer:
      "Robina renovation costs typically range from $35,000 for a bathroom to $150,000+ for whole-home renovations. The 90s homes in Robina often benefit greatly from kitchen updates, bathroom modernisation, and open-plan transformations.",
  },
  {
    question: "Can you modernise 90s homes in Robina?",
    answer:
      "Absolutely. Many Robina homes were built in the 90s with layouts that don't suit modern living. We specialise in transforming these homes - opening up kitchens, updating bathrooms, and creating the indoor-outdoor flow that today's families want.",
  },
  {
    question: "Do you work near Robina Town Centre?",
    answer:
      "Yes, we renovate properties throughout Robina including homes near Robina Town Centre, Robina Woods, and the surrounding estates. Our Broadbeach base means we're just 15 minutes away.",
  },
];

const robinaImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations-Gold-Coast.webp",
  nineties: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/service-living.webp",
};

export default function RobinaRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Robina Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Robina. Kitchen, bathroom and whole-home renovations for modern family homes. QBCC licensed. Based in Broadbeach - your local Gold Coast builder."
        url="/robina-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Modern Home Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Robina Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations in Robina. We specialise in 
                transforming 90s homes into modern, open-plan spaces perfect for contemporary 
                family living.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Robina Consultation
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
                src={robinaImages.hero}
                alt="Robina home renovation by Concept Design Construct"
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

      {/* 90s Home Specialists */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={robinaImages.nineties}
                alt="90s home modernisation in Robina"
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
                <span className="text-xs uppercase tracking-wider text-primary">90s Home Specialists</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Modernising Robina&apos;s 90s Homes
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Many Robina homes were built in the 1990s with closed-off kitchens, small 
                bathrooms, and formal dining rooms that don&apos;t suit modern family life. 
                We transform these homes into open, flowing spaces with contemporary finishes 
                and indoor-outdoor connection.
              </p>
              <ul className="space-y-3">
                {[
                  "Opening up closed-off kitchens",
                  "Creating open-plan living areas",
                  "Modernising 90s bathrooms",
                  "Adding indoor-outdoor flow",
                  "Updating flooring throughout",
                  "Contemporary lighting and fixtures",
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
            Robina Renovation Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={robinaImages.kitchen}
                  alt="Kitchen renovation in Robina"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Kitchen Transformations</h3>
                <p className="text-foreground/70 mb-4">
                  Convert closed-off 90s kitchens into open-plan heart-of-the-home spaces 
                  with islands, breakfast bars, and modern appliances.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={robinaImages.bathroom}
                  alt="Bathroom renovation in Robina"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Bathroom Updates</h3>
                <p className="text-foreground/70 mb-4">
                  Replace dated 90s bathrooms with modern, spa-like spaces featuring 
                  walk-in showers, modern vanities, and quality finishes.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={robinaImages.living}
                  alt="Living area renovation in Robina"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Whole-Home Updates</h3>
                <p className="text-foreground/70 mb-4">
                  Complete home transformations that bring your Robina property into 
                  the modern era with cohesive design throughout.
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
              <div className="text-4xl font-serif text-primary mb-2">30+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Robina Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">🏠</div>
              <div className="text-4xl font-serif text-primary mb-2">90s</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Home Specialists</p>
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
            Robina Renovation FAQs
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
            Ready to Modernise Your Robina Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your Robina renovation. 
            We&apos;ll show you how to transform your 90s home into modern, open-plan living.
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
