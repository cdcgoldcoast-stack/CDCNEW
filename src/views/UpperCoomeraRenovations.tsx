"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight, TreePine } from "lucide-react";

const faqs = [
  {
    question: "What kind of renovations do you do in Upper Coomera?",
    answer:
      "We handle all types of home renovations in Upper Coomera, from kitchen and bathroom upgrades to full home transformations. Many Upper Coomera families come to us when they need more space - whether that means extending a living area, adding a second bathroom, or completely reconfiguring their floor plan to suit a growing household.",
  },
  {
    question: "How much does a renovation cost in Upper Coomera?",
    answer:
      "Upper Coomera renovation costs depend on the scope of work. Kitchen renovations typically range from $28,000-$55,000, bathrooms from $20,000-$40,000, and whole-home renovations from $100,000-$250,000+. Because Upper Coomera homes are generally newer builds, we can often achieve impressive results without extensive structural work, which helps keep costs down.",
  },
  {
    question: "Can you extend my Upper Coomera home instead of us moving?",
    answer:
      "Yes, home extensions are a popular option in Upper Coomera where many families outgrow their homes but love the area. We can extend living areas, add rooms, or reconfigure existing spaces to create the room your family needs. Renovating is often more cost-effective than selling and buying in Upper Coomera, and you avoid stamp duty and moving costs.",
  },
  {
    question: "How do you handle renovations in Upper Coomera estates with covenants?",
    answer:
      "We are familiar with the building covenants across Upper Coomera estates. If your renovation involves external changes, we review your estate covenants before design work begins to ensure compliance. For internal renovations like kitchens and bathrooms, covenants rarely apply. We handle all necessary approvals so your Upper Coomera renovation proceeds smoothly.",
  },
];

const images = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Gold-Coast.webp",
  family: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Gold-Coast-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations-Gold-Coast.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
};

export default function UpperCoomeraRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Upper Coomera Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Family home renovations in Upper Coomera. Kitchen, bathroom and whole-home transformations for growing families. Extending and upgrading homes across Upper Coomera estates on the Gold Coast."
        url="/upper-coomera-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Local Renovation Builders</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Upper Coomera Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Home renovations for Upper Coomera families who need more space, better function,
                or simply a home that keeps up with their lifestyle. We help families grow into
                their homes rather than out of them, with renovations designed around real
                family life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book an Upper Coomera Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Family home specialists serving Upper Coomera estates
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.hero}
                alt="Upper Coomera renovation by Concept Design Construct"
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

      {/* Family Home Transformations */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={images.family}
                alt="Family home transformation in Upper Coomera"
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
                <span className="text-xs uppercase tracking-wider text-primary">Family Home Experts</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Family Home Transformations
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Upper Coomera is one of the Gold Coast&apos;s most popular family suburbs, with
                larger blocks and room to grow. But as children get older and families expand,
                even generous homes can start feeling tight. We help Upper Coomera families
                reimagine their spaces - extending living areas into outdoor zones, adding
                bathrooms where they&apos;re needed, creating study nooks and media rooms, and
                building the kind of kitchen that handles weeknight chaos and weekend entertaining
                with equal ease.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Living area extensions and reconfiguration",
                  "Additional bathroom and ensuite additions",
                  "Outdoor living and alfresco entertaining",
                  "Study nooks and dedicated work-from-home spaces",
                  "Kitchen upgrades for busy family life",
                  "Estate covenant compliance management",
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
            What We Renovate in Upper Coomera
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={images.kitchen}
                  alt="Kitchen renovation in Upper Coomera"
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
                  Kitchens built for real family life in Upper Coomera. Durable stone benchtops,
                  generous storage, large islands for homework and morning routines, and quality
                  appliances that handle the demands of a busy household.
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
                  alt="Bathroom renovation in Upper Coomera"
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
                  Practical yet beautiful bathrooms for Upper Coomera families. We design
                  spaces that handle peak-hour mornings with multiple users while still feeling
                  like a retreat at the end of the day.
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
                  alt="Whole home renovation in Upper Coomera"
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
                  Complete Upper Coomera home transformations. We tackle the entire house -
                  kitchen, bathrooms, living areas, and outdoor spaces - creating a unified
                  design that grows with your family for years to come.
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
              Why Upper Coomera Families Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We work with families throughout Upper Coomera and understand the specific needs
              of this growing community. From estate covenant compliance to designing spaces
              that keep up with active families, we bring practical experience to every project.
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
            Upper Coomera Renovation FAQs
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
            Ready to Transform Your Upper Coomera Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to talk about your family&apos;s renovation goals.
            We&apos;ll visit your Upper Coomera home, understand how your family uses the
            space, and design a renovation that works for years to come.
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
            Family home specialists &bull; QBCC Licensed &bull; 25+ years experience
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
