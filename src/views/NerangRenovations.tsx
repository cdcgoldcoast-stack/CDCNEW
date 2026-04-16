"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Check, TreePine } from "lucide-react";

const faqs = [
  {
    question: "What types of homes do you renovate in Nerang?",
    answer:
      "We renovate all property types across Nerang, from established 1980s and 1990s family homes to newer builds on larger blocks. Our Nerang projects often involve updating older layouts to suit modern family living while taking advantage of the generous block sizes typical in this area.",
  },
  {
    question: "How much does a home renovation cost in Nerang?",
    answer:
      "Nerang renovation costs depend on scope and property size. Kitchen renovations typically range from $35,000-$65,000, bathrooms from $25,000-$50,000, and whole-home renovations from $120,000-$300,000+. Nerang homes often have larger footprints, so we provide tailored quotes based on your specific property.",
  },
  {
    question: "Can you add indoor-outdoor living areas to Nerang homes?",
    answer:
      "Absolutely. Many Nerang homes sit on generous blocks with beautiful hinterland outlooks. We specialise in creating seamless indoor-outdoor transitions with bi-fold doors, covered alfresco areas, and outdoor kitchens that make the most of your property and the surrounding landscape.",
  },
  {
    question: "How long does a whole-home renovation take in Nerang?",
    answer:
      "A typical whole-home renovation in Nerang takes 10-16 weeks depending on the scope. Kitchen-only renovations run 4-6 weeks and bathrooms 3-5 weeks. Because Nerang properties tend to be larger, we plan carefully to minimise disruption and keep your family comfortable during the build.",
  },
];

const nerangImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-renovation-gaven-concept-design-construct.webp",
  established: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-upgrade-mount-nathan-concept-design-construct.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-upgrade-maudsland-concept-design-construct.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_Shower.webp",
};

export default function NerangRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
      <SEO
        title="Nerang Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Expert renovation builders in Nerang, Gold Coast. Kitchen, bathroom and whole-home renovations for established family homes near the hinterland. QBCC licensed local builders."
        url="/nerang-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Hinterland Gateway Builders</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Nerang Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Kitchen, bathroom and whole-home renovations for Nerang&apos;s established family homes.
                We understand the character of this hinterland gateway suburb and bring thoughtful
                design to every project, whether you&apos;re updating a classic Queenslander or
                modernising a brick family home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Nerang Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Serving Nerang and the Gold Coast hinterland
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={nerangImages.hero}
                alt="Nerang home renovation by Concept Design Construct"
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

      {/* Hinterland Gateway Homes */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={nerangImages.established}
                alt="Established home renovation in Nerang"
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
                <TreePine className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">Hinterland Gateway Homes</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Renovating Nerang&apos;s Established Homes
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Nerang sits at the gateway to the Gold Coast hinterland, and its homes reflect
                a mix of eras and styles. From spacious family homes built in the 1980s to larger
                properties on generous blocks, these homes often have great bones but need updating
                to suit the way families live today. We bring modern layouts, better flow, and
                indoor-outdoor connections that take advantage of the stunning hinterland backdrop.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Older home layout reconfiguration",
                  "Indoor-outdoor living with hinterland views",
                  "Kitchen and bathroom modernisation",
                  "Larger block property transformations",
                  "Energy-efficient upgrades",
                  "Covered outdoor entertaining areas",
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
            What We Renovate in Nerang
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={nerangImages.kitchen}
                  alt="Kitchen renovation in Nerang"
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
                  Transform your Nerang kitchen with contemporary cabinetry, stone benchtops, and
                  layouts that suit busy family life. From galley kitchen updates to full open-plan
                  kitchen-living conversions.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={nerangImages.bathroom}
                  alt="Bathroom renovation in Nerang"
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
                  Dated Nerang bathrooms refreshed with modern tiling, quality fixtures, and
                  proper waterproofing. We create spa-inspired spaces that make your daily routine
                  feel like a retreat.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={nerangImages.living}
                  alt="Whole-home renovation in Nerang"
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
                  Complete transformations for Nerang family homes. New layouts, updated flooring,
                  modern electrics, and seamless indoor-outdoor flow that makes the most of your
                  generous block.
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
              Why Nerang Homeowners Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We bring local knowledge and decades of experience to every Nerang renovation.
              From navigating council requirements to understanding what works for hinterland-adjacent homes.
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
              <div className="text-4xl font-serif text-primary mb-2">Fixed</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Price Contracts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Local</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Gold Coast Based</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Nerang Renovation FAQs
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
            Ready to Renovate Your Nerang Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation and let&apos;s discuss how to transform your Nerang property.
            We&apos;ll visit your home, understand your vision, and provide a detailed plan and quote.
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
            Serving Nerang and surrounds • QBCC Licensed • Free Quotes
          </p>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
}
