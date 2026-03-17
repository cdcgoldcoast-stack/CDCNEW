"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, Home } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate prestige homes in Sanctuary Cove?",
    answer:
      "Yes, we specialise in high-end renovations for Sanctuary Cove's prestige properties. From marina-front residences to golf course estates, we deliver bespoke designs with premium materials and meticulous craftsmanship that meet the standards Sanctuary Cove homeowners expect.",
  },
  {
    question: "How much does a renovation cost in Sanctuary Cove?",
    answer:
      "Sanctuary Cove renovation costs typically start from $60,000 for a luxury bathroom and range to $300,000+ for comprehensive whole-home transformations. Given the calibre of homes in Sanctuary Cove, our clients often select premium stone, custom cabinetry, and designer fixtures.",
  },
  {
    question: "Can you work within Sanctuary Cove community guidelines?",
    answer:
      "Absolutely. We have experience working within Sanctuary Cove's community guidelines and approval processes. We handle all necessary approvals, coordinate with the community management team, and ensure our work meets the aesthetic standards of this exclusive estate.",
  },
  {
    question: "Do you renovate marina homes in Sanctuary Cove?",
    answer:
      "Yes, we have renovated several marina-front properties in Sanctuary Cove. We understand the importance of maximising water views, using marine-grade materials where needed, and creating seamless indoor-outdoor entertaining spaces that take advantage of the waterfront setting.",
  },
];

const sanctuaryCoveImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Gold-Coast.webp",
  prestige: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/editorial-8.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp",
};

export default function SanctuaryCoveRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Sanctuary Cove Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Prestige renovation builders for Sanctuary Cove. Bespoke kitchen, bathroom and whole-home renovations for marina and golf course homes. QBCC licensed Gold Coast builder."
        url="/sanctuary-cove-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Prestige Renovation Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Sanctuary Cove Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Bespoke kitchen, bathroom and whole-home renovations for Sanctuary Cove&apos;s
                most distinguished properties. We bring meticulous craftsmanship and
                premium materials to every project within this exclusive estate.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Sanctuary Cove Consultation
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
                src={sanctuaryCoveImages.hero}
                alt="Sanctuary Cove prestige home renovation by Concept Design Construct"
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

      {/* Prestige Home Renovations */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={sanctuaryCoveImages.prestige}
                alt="Prestige renovation in Sanctuary Cove"
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
                <span className="text-xs uppercase tracking-wider text-primary">Exclusive Estate</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Prestige Home Renovations
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Sanctuary Cove is one of Australia&apos;s most exclusive residential estates,
                and renovating here demands an elevated standard. We work with homeowners
                who expect nothing less than the finest materials, bespoke joinery, and
                designs that complement the marina, golf course, and resort surroundings.
              </p>
              <ul className="space-y-3">
                {[
                  "Bespoke designs tailored to each property",
                  "Premium imported stone and timber",
                  "Working within community guidelines and approvals",
                  "Marina-view and golf course-view optimisation",
                  "Custom lighting and architectural detailing",
                  "Discreet project management within the estate",
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
            Sanctuary Cove Renovation Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={sanctuaryCoveImages.kitchen}
                  alt="Bespoke kitchen renovation in Sanctuary Cove"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Bespoke Kitchens</h3>
                <p className="text-foreground/70 mb-4">
                  Handcrafted kitchens with natural stone benchtops, custom cabinetry,
                  integrated premium appliances, and layouts designed for elegant entertaining.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={sanctuaryCoveImages.bathroom}
                  alt="Luxury bathroom renovation in Sanctuary Cove"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Prestige Bathrooms</h3>
                <p className="text-foreground/70 mb-4">
                  Hotel-quality bathrooms with floor-to-ceiling marble, frameless glass,
                  underfloor heating, and bespoke vanities that feel like a private retreat.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={sanctuaryCoveImages.living}
                  alt="Whole-home renovation in Sanctuary Cove"
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading="lazy"
                  quality={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif italic text-xl text-primary mb-3">Whole-Home Refinement</h3>
                <p className="text-foreground/70 mb-4">
                  Complete home transformations with a cohesive design language -
                  from grand living areas to private retreats, every space considered.
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
              <div className="text-4xl font-serif text-primary mb-2">10+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Sanctuary Cove Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Bespoke</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Design Approach</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Estate</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Guideline Compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Sanctuary Cove Renovation FAQs
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
            Ready to Refine Your Sanctuary Cove Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a private consultation to discuss your Sanctuary Cove renovation. We&apos;ll
            create a bespoke plan that elevates your home to match this prestigious address.
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
