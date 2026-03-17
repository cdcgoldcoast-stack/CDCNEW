"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Check, Home } from "lucide-react";

const faqs = [
  {
    question: "Do you renovate acreage properties in Mudgeeraba?",
    answer:
      "Yes, we have extensive experience renovating acreage homes throughout Mudgeeraba. These properties often have unique character features worth preserving, and we work closely with homeowners to modernise living spaces while respecting the original charm of the home and its connection to the surrounding landscape.",
  },
  {
    question: "How much does a renovation cost in Mudgeeraba?",
    answer:
      "Mudgeeraba renovation costs reflect the larger property sizes typical in the area. Kitchen renovations generally range from $35,000-$70,000, bathrooms from $25,000-$50,000, and whole-home renovations from $150,000-$350,000+. We provide detailed, transparent quotes based on your specific Mudgeeraba property.",
  },
  {
    question: "Can you preserve character features during a Mudgeeraba renovation?",
    answer:
      "Absolutely. Many Mudgeeraba homes have beautiful character elements like timber features, high ceilings, and unique architectural details. Our design team carefully plans around these features, blending modern functionality with the existing character that makes your Mudgeeraba home special.",
  },
  {
    question: "How do you handle renovations on larger Mudgeeraba properties?",
    answer:
      "For larger Mudgeeraba properties, we develop comprehensive renovation plans that can be staged if needed. We manage site access, coordinate trades efficiently, and plan around the unique aspects of semi-rural properties including septic systems, tank water, and rural infrastructure.",
  },
];

const mudgeerabaImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations-Gold-Coast.webp",
  character: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
  kitchen: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Gold-Coast-Renovations.webp",
  bathroom: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovation-Bathroom.webp",
  living: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp",
};

export default function MudgeerabaRenovations() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Mudgeeraba Renovations | Kitchen, Bathroom & Home | CD Construct"
        description="Renovation builders in Mudgeeraba, Gold Coast. Kitchen, bathroom and whole-home renovations for acreage properties and character homes. Design-led planning for semi-rural living."
        url="/mudgeeraba-renovations"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-4">Acreage & Character Home Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Mudgeeraba Renovations
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
                Thoughtful renovations for Mudgeeraba&apos;s character homes and acreage properties.
                We preserve what makes your home special while bringing it into the modern era
                with improved layouts, premium finishes, and spaces designed for family living
                amid the hinterland.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Mudgeeraba Consultation
                </Link>
                <a
                  href="tel:0413468928"
                  className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                >
                  Call 0413 468 928
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6">
                Serving Mudgeeraba and the Gold Coast hinterland
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={mudgeerabaImages.hero}
                alt="Mudgeeraba home renovation by Concept Design Construct"
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

      {/* Character Home Renovations */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={mudgeerabaImages.character}
                alt="Character home renovation in Mudgeeraba"
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
                <span className="text-xs uppercase tracking-wider text-primary">Character Home Renovations</span>
              </div>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Preserving Charm, Delivering Modernity
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Mudgeeraba is renowned for its leafy acreage properties and homes brimming with
                character. Whether your home features original timber detailing, vaulted ceilings,
                or a unique floorplan shaped by its landscape, our approach starts with understanding
                what makes it special. We then layer in contemporary functionality - better kitchens,
                modern bathrooms, and flowing indoor-outdoor spaces - without losing the soul of
                the original home.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Heritage feature preservation",
                  "Acreage property expertise",
                  "Seamless indoor-outdoor transitions",
                  "Modern kitchen and bathroom integration",
                  "Rural infrastructure considerations",
                  "Staged renovation planning",
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
            What We Renovate in Mudgeeraba
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={mudgeerabaImages.kitchen}
                  alt="Kitchen renovation in Mudgeeraba"
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
                  Country-meets-contemporary kitchens for Mudgeeraba homes. Generous island benches,
                  butler&apos;s pantries, and high-end appliances designed for families who love
                  to cook and entertain.
                </p>
                <Link to="/kitchen-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={mudgeerabaImages.bathroom}
                  alt="Bathroom renovation in Mudgeeraba"
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
                  Transform dated Mudgeeraba bathrooms into restful sanctuaries. Freestanding
                  baths, walk-in showers, heated towel rails, and natural stone finishes that
                  complement your home&apos;s character.
                </p>
                <Link to="/bathroom-renovations-gold-coast" className="text-label text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
            <div className="bg-background overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ResponsiveImage
                  src={mudgeerabaImages.living}
                  alt="Whole home renovation in Mudgeeraba"
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
                  End-to-end transformations for Mudgeeraba character homes. We reconfigure
                  layouts, update every room, and connect your home to its surroundings with
                  thoughtful design.
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
              Why Mudgeeraba Homeowners Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              Character homes deserve builders who appreciate craftsmanship. We bring patience,
              skill, and a genuine respect for older homes to every Mudgeeraba project.
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
              <div className="text-4xl font-serif text-primary mb-2">Design</div>
              <p className="text-sm uppercase tracking-wider text-foreground/60">Led Approach</p>
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
            Mudgeeraba Renovation FAQs
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
            Ready to Renovate Your Mudgeeraba Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Let&apos;s talk about breathing new life into your Mudgeeraba property. Book a free
            on-site consultation and we&apos;ll share ideas tailored to your home&apos;s character
            and your family&apos;s needs.
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
            Serving Mudgeeraba and surrounds • QBCC Licensed • Free Quotes
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
