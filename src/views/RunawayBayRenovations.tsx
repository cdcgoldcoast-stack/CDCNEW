"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, Waves } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate canal-front homes in Runaway Bay?",
    answer:
      "Yes, canal-front renovations are one of our specialities in Runaway Bay. We understand the unique considerations of waterfront properties - from flood-smart design and moisture management to maximising water views and creating seamless indoor-outdoor entertaining areas that take advantage of your canal frontage.",
  },
  {
    question: "How much does a renovation cost in Runaway Bay?",
    answer:
      "Runaway Bay renovation costs depend on the size and scope of your project. Kitchen renovations typically range from $30,000-$60,000, bathrooms from $22,000-$45,000, and whole-home renovations from $120,000-$300,000+. Canal-front properties in Runaway Bay may need additional flood compliance work, which we factor into our detailed quotes.",
  },
  {
    question: "Can you update my 1980s home in Runaway Bay without rebuilding?",
    answer:
      "Absolutely. Many Runaway Bay homes from the 1980s and 90s have solid structures that just need modernising. We specialise in opening up closed-off floor plans, replacing dated kitchens and bathrooms, and adding contemporary finishes - all without the cost and disruption of a full rebuild. Your Runaway Bay home can feel brand new while keeping its structural integrity.",
  },
  {
    question: "Do you build outdoor entertaining areas for Runaway Bay homes?",
    answer:
      "Yes, outdoor living is a key part of many Runaway Bay renovations. We design and build alfresco areas, covered patios, and outdoor kitchens that complement your indoor renovation. For canal-front Runaway Bay properties, we create entertaining spaces that frame your water views and make the most of the Gold Coast lifestyle.",
  },
];

const images = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/custom-home-exterior-runaway-bay-concept-design-construct.webp",
  waterfront: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-renovation-hope-island-concept-design-construct.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-renovation-Hope-island-gold-coast-licensed.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/outdoor-deck-renovation-paradise-point-concept-design-construct.webp",
};

export default function RunawayBayRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
      <SEO
        title="Runaway Bay Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Canal-front and family home renovations in Runaway Bay. Kitchen, bathroom and whole-home upgrades for waterfront properties and established homes on the Gold Coast."
        url="/runaway-bay-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Local Renovation Builders</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                Runaway Bay Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Waterfront and family home renovations in Runaway Bay. From canal-front properties
                with boat access to established family homes on quiet streets, we deliver renovations
                that embrace the relaxed waterside lifestyle this suburb is known for.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Runaway Bay Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Waterfront renovation specialists serving Runaway Bay
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.hero}
                alt="Runaway Bay renovation by Concept Design Construct"
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

      {/* Canal-Front Home Renovations */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.waterfront}
                alt="Canal-front home renovation in Runaway Bay"
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
                <span className="text-xs uppercase tracking-wider text-primary">Waterfront Experts</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Canal-Front Home Renovations
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Runaway Bay&apos;s canal network is one of the Gold Coast&apos;s best-kept secrets
                for family living. Many of these waterfront homes were built in the 1980s and 90s
                with layouts that turn their backs on the water. We redesign these homes to embrace
                their canal frontage - opening up rear living areas, installing bi-fold doors,
                and creating alfresco spaces where you can watch the boats go by while
                entertaining friends and family.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Water-view living area redesigns",
                  "Indoor-outdoor entertaining connections",
                  "Flood-smart design and compliance",
                  "Moisture-resistant material selection",
                  "Outdoor kitchen and alfresco areas",
                  "Pontoon and boat access integration",
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
            What We Renovate in Runaway Bay
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.kitchen}
                  alt="Kitchen renovation in Runaway Bay"
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
                  Family-sized kitchens designed for the way Runaway Bay families actually cook
                  and entertain. Large islands, walk-in pantries, and layouts that connect
                  seamlessly to outdoor dining areas overlooking the water.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.bathroom}
                  alt="Bathroom renovation in Runaway Bay"
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
                  Modern bathrooms with proper waterproofing and quality fixtures. We replace
                  dated Runaway Bay bathrooms with clean, contemporary designs that handle
                  the humidity of waterfront living while looking beautiful.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.living}
                  alt="Whole-home renovation in Runaway Bay"
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
                  Complete home transformations for Runaway Bay properties. New floors, open-plan
                  living, updated wiring and plumbing - everything needed to bring your
                  waterfront or family home into the modern era.
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
              Why Runaway Bay Families Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We know Runaway Bay&apos;s homes, its waterfront challenges, and what families
              in this area need from their living spaces. Our local experience means fewer
              surprises and better results for your renovation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">Local</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Gold Coast Based</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Licensed &amp; Insured</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">25+</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">4.9★</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Client Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Runaway Bay Renovation FAQs
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
            Ready to Renovate Your Runaway Bay Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your canal-front or family home renovation.
            We&apos;ll visit your Runaway Bay property, understand your goals, and put together
            a plan that makes the most of your waterside location.
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
            Waterfront specialists &bull; QBCC Licensed &bull; 25+ years experience
          </p>
        </div>
      </section>


      </main>
      <Footer />
    </div>
  );
}
