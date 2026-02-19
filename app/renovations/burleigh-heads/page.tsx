import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Burleigh Heads Renovations | Kitchen, Bathroom & Home | Concept Design Construct",
  description:
    "Renovation builders in Burleigh Heads. Kitchen, bathroom & whole-home renovations. 25+ years experience. QBCC licensed. Local Broadbeach team. Free consultation.",
};

const faqs = [
  {
    question: "How much does a renovation cost in Burleigh Heads?",
    answer:
      "Burleigh Heads renovations typically range from $40,000 for a bathroom refresh to $150,000+ for a whole-home transformation. The premium location and coastal conditions mean we use materials that stand up to salt air and humidity. We provide detailed quotes after an on-site consultation.",
  },
  {
    question: "Do you work on the hill or just the flat areas?",
    answer:
      "We work across all of Burleigh - from the beachside flats to the hillside homes on Fourth Avenue, The Esplanade, and up into Burleigh Waters. Hillside homes often have unique challenges with access and retaining walls, which we're experienced with.",
  },
  {
    question: "Can you renovate while we live in the home?",
    answer:
      "Yes, most Burleigh clients stay during renovation. We sequence the work to minimize disruption - often starting with bathrooms while kitchens remain functional, or working on external areas first. For major whole-home renovations, some clients choose to rent short-term.",
  },
  {
    question: "How long does a kitchen renovation take in Burleigh?",
    answer:
      "A typical Burleigh Heads kitchen renovation takes 6-8 weeks from demolition to completion. This includes cabinetry (3-4 weeks), stone benchtops (1 week), and appliance installation. We coordinate trades to minimize downtime.",
  },
];

export default function BurleighHeadsRenovations() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Static Header */}
      <header className="py-4 border-b border-foreground/10">
        <div className="container-wide flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-primary">
            Concept Design Construct
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about-us" className="text-xs uppercase tracking-wider hover:text-primary">About</Link>
            <Link href="/renovation-projects" className="text-xs uppercase tracking-wider hover:text-primary">Projects</Link>
            <Link href="/renovation-services" className="text-xs uppercase tracking-wider hover:text-primary">Services</Link>
            <Link href="/book-renovation-consultation" className="text-xs uppercase tracking-wider bg-primary text-primary-foreground px-4 py-2">
              Book Consultation
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-cream">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-primary mb-4">Local Renovation Builders</p>
            <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-6">
              Burleigh Heads Renovations
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
              Kitchen, bathroom and whole-home renovations in Burleigh Heads. We understand the
              unique character of these homes - from original beach shacks to modern hillside
              architecture. Based in Broadbeach, we're locals too.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book-renovation-consultation"
                className="text-xs uppercase tracking-wider bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
              >
                Book a Burleigh Consultation
              </Link>
              <a
                href="tel:1300020232"
                className="text-xs uppercase tracking-wider border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
              >
                Call 1300 020 232
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Burleigh is Unique */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">
                Renovating in Burleigh Heads
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Burleigh Heads has a unique character that you won't find anywhere else on the
                  Gold Coast. Those leafy streets, the mix of original beach shacks and modern
                  architecture, the way the afternoon light hits the hillside homes. It's why
                  people want to live here - and why they renovate instead of moving.
                </p>
                <p>
                  We've been renovating in Burleigh since 2005. We know the area from the
                  beachside flats to the hills around Fourth Avenue and The Esplanade. We
                  understand the local council requirements, the challenges of hillside
                  building, and the coastal conditions that affect material choices.
                </p>
                <p>
                  The homes here tell a story. Many were built in the 70s and 80s with layouts
                  that don't match how we live now. Closed-off kitchens. Small bathrooms.
                  No indoor-outdoor flow. But the location is irreplaceable. That's where
                  we come in.
                </p>
              </div>
            </div>
            <div className="bg-cream p-8">
              <h3 className="font-serif italic text-xl text-primary mb-4">
                Common Burleigh Renovations
              </h3>
              <ul className="space-y-3 text-foreground/70">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Opening up 70s/80s brick homes for modern living
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Coastal kitchen renovations with natural materials
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Adding decks and outdoor kitchens
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Updating bathrooms with stone and quality fixtures
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Full character home renovations
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Hillside home structural work
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-12 text-center">
            What We Renovate in Burleigh
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8">
              <h3 className="font-serif italic text-xl text-primary mb-3">Kitchen Renovations</h3>
              <p className="text-foreground/70 mb-4">
                Open-plan kitchen renovations that work with Burleigh's indoor-outdoor lifestyle.
                Island benches, quality appliances, and finishes that handle the coastal climate.
              </p>
              <Link href="/renovation-services" className="text-xs uppercase tracking-wider text-primary hover:underline">
                Learn more →
              </Link>
            </div>
            <div className="bg-background p-8">
              <h3 className="font-serif italic text-xl text-primary mb-3">Bathroom Renovations</h3>
              <p className="text-foreground/70 mb-4">
                Spa-like bathrooms with natural stone, quality fixtures, and smart storage.
                Designed for the humidity and salt air of coastal living.
              </p>
              <Link href="/renovation-services" className="text-xs uppercase tracking-wider text-primary hover:underline">
                Learn more →
              </Link>
            </div>
            <div className="bg-background p-8">
              <h3 className="font-serif italic text-xl text-primary mb-3">Whole Home Renovations</h3>
              <p className="text-foreground/70 mb-4">
                Transform your entire home while keeping what makes it Burleigh - the character,
                the light, the connection to the outdoors.
              </p>
              <Link href="/renovation-services" className="text-xs uppercase tracking-wider text-primary hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CDC */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">
              Why Burleigh Heads Homeowners Choose Us
            </h2>
            <p className="text-lg text-foreground/70">
              We're not just builders who work in Burleigh - we're part of the Gold Coast community.
              Based in Broadbeach, we're 10 minutes away when you need us.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-serif text-primary mb-2">25+</div>
              <p className="text-xs uppercase tracking-wider text-foreground/60">Years Experience</p>
            </div>
            <div>
              <div className="text-4xl font-serif text-primary mb-2">100+</div>
              <p className="text-xs uppercase tracking-wider text-foreground/60">Gold Coast Projects</p>
            </div>
            <div>
              <div className="text-4xl font-serif text-primary mb-2">QBCC</div>
              <p className="text-xs uppercase tracking-wider text-foreground/60">Licensed & Insured</p>
            </div>
            <div>
              <div className="text-4xl font-serif text-primary mb-2">Local</div>
              <p className="text-xs uppercase tracking-wider text-foreground/60">Broadbeach Based</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-12 text-center">
            Burleigh Renovation FAQs
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
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">
            Ready to Renovate Your Burleigh Home?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation at your Burleigh Heads home. We'll discuss your vision,
            assess your space, and provide a detailed quote with no pressure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book-renovation-consultation"
              className="text-xs uppercase tracking-wider bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
            >
              Book Your Free Consultation
            </Link>
            <a
              href="tel:1300020232"
              className="text-xs uppercase tracking-wider border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
            >
              Call 1300 020 232
            </a>
          </div>
          <p className="text-sm text-foreground/50 mt-6">
            Based in Broadbeach • 10 minutes from Burleigh Heads • QBCC Licensed
          </p>
        </div>
      </section>

      {/* Simple Static Footer */}
      <footer className="py-12 border-t border-foreground/10">
        <div className="container-wide">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-serif text-lg text-primary mb-2">Concept Design Construct</p>
              <p className="text-xs text-foreground/60">Gold Coast Renovation Builders</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-foreground/40 mb-2">Address</p>
              <p className="text-sm text-foreground/70">
                1907/22 Surf Parade<br />
                Broadbeach, QLD 4218
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-foreground/40 mb-2">Contact</p>
              <p className="text-sm text-foreground/70">
                1300 020 232<br />
                info@cdconstruct.com.au
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-foreground/40 mb-2">Service Areas</p>
              <p className="text-xs text-foreground/60">
                Burleigh Heads, Broadbeach, Mermaid Beach, Robina, Southport, Palm Beach & all Gold Coast
              </p>
            </div>
          </div>
          <p className="text-xs text-foreground/40 pt-8 border-t border-foreground/10">
            © 2025 Concept Design Construct. QBCC Licensed. Master Builders Member.
          </p>
        </div>
      </footer>
    </div>
  );
}
