"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Phone, Check, ArrowRight } from "lucide-react";

const features = [
  "Custom kitchen design & 3D renders",
  "Cabinetry, benchtops & splashbacks",
  "Appliance selection & integration",
  "Plumbing, electrical & lighting",
  "QBCC licensed & insured",
  "Fixed-price quoting",
];

const processSteps = [
  {
    step: "01",
    title: "Consultation",
    description: "We discuss your vision, lifestyle needs, and budget to understand exactly what you want from your new kitchen.",
  },
  {
    step: "02",
    title: "Design & Planning",
    description: "Detailed kitchen design with 3D visualisation, material selection, and fixed-price quoting.",
  },
  {
    step: "03",
    title: "Construction",
    description: "Professional demolition, installation, and finishing with clear communication throughout.",
  },
  {
    step: "04",
    title: "Handover",
    description: "Final inspection, cleaning, and walkthrough with warranty documentation.",
  },
];

const serviceFaqs = [
  {
    question: "How much does a kitchen renovation cost on the Gold Coast?",
    answer:
      "Kitchen renovation costs depend on scope, size, and finishes. A mid-range kitchen renovation typically starts from $35,000-$50,000, while premium kitchens with custom cabinetry and high-end appliances can range from $60,000-$100,000+. We provide fixed-price quotes after detailed consultation and design.",
  },
  {
    question: "How long does a kitchen renovation take?",
    answer:
      "Most kitchen renovations take 4-8 weeks from demolition to handover, depending on complexity and custom elements. This includes cabinetry installation, benchtops, appliances, splashback, and final touches. We provide a detailed timeline during planning so you know exactly what to expect.",
  },
  {
    question: "Do you handle council approvals for kitchen renovations?",
    answer:
      "Most kitchen renovations don't require council approval if they don't involve structural changes or plumbing relocations. If your project does need approvals, we coordinate the entire process including building certifiers and required documentation.",
  },
  {
    question: "Can I live in my home during a kitchen renovation?",
    answer:
      "Yes, though there will be disruption. We set up temporary kitchen facilities and schedule work to minimise inconvenience. Many clients choose to stay elsewhere during the most intensive phases (1-2 weeks), but it's not required.",
  },
  {
    question: "Do you provide kitchen design services?",
    answer:
      "Absolutely. Our design process includes layout optimisation, workflow planning, cabinetry design, appliance selection, and material choices. We create detailed 3D renders so you can visualise the result before construction begins.",
  },
  {
    question: "What kitchen styles do you specialise in?",
    answer:
      "We design and build all kitchen styles including modern minimalist, Hamptons, coastal, contemporary, and classic traditional. Our portfolio includes everything from compact apartment kitchens to large entertainer's kitchens.",
  },
];

// Kitchen project images
const kitchenImages = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Gold_Coast_renovation_builders.webp",
  modern: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  hamptons: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
  coastal: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Gold-Coast-Renovations.webp",
  process: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-upgrade-varsity-lakes-gold-coast-concept-design-construct.webp",
  portfolio: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Kitchen.webp",
};

const KitchenRenovations = () => {
  const { assets } = useSiteAssets();
  const heroImage = assets["service-bg-kitchen"] || kitchenImages.hero;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Kitchen Renovations | Design & Build by CD Construct"
        description="Gold Coast kitchen renovations and remodelling with bespoke designs, quality craftsmanship & smooth project management. Fixed price quotes. QBCC licensed."
        url="/kitchen-renovations-gold-coast"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Kitchen Specialists</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Gold Coast Kitchen Renovations
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Bespoke kitchen designs built around how you cook, entertain, and live. 
                From compact apartment kitchens to large family spaces, we deliver 
                <strong> beautiful, functional kitchens</strong> that stand the test of time.
              </p>
              <ul className="space-y-3 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-renovation-consultation"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Get a Kitchen Quote
                </Link>
                <a
                  href="tel:1300020232"
                  className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  1300 020 232
                </a>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={heroImage}
                alt="Gold Coast kitchen renovation by Concept Design Construct"
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager"
                priority
                quality={62}
                responsiveWidths={[360, 480, 640, 768, 960, 1200]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kitchen Styles Section with Images */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-label text-primary mb-4">Kitchen Styles</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
              Kitchen Designs For Every Home
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              From sleek modern spaces to timeless Hamptons classics, we design and build 
              kitchens that reflect your personal style and enhance your daily life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Modern & Minimalist",
                description: "Clean lines, handle-less cabinetry, and integrated appliances for a sleek contemporary look.",
                image: kitchenImages.modern,
              },
              {
                title: "Hamptons Style",
                description: "Shaker cabinets, marble-look surfaces, and classic detailing for timeless elegance.",
                image: kitchenImages.hamptons,
              },
              {
                title: "Coastal Contemporary",
                description: "Light, airy spaces with natural textures perfect for Gold Coast living.",
                image: kitchenImages.coastal,
              },
            ].map((style) => (
              <article key={style.title} className="group bg-background border border-foreground/10 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={style.image}
                    alt={`${style.title} kitchen renovation on the Gold Coast`}
                    width={600}
                    height={450}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    loading="lazy"
                    quality={60}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">{style.title}</h3>
                  <p className="text-foreground/75 leading-relaxed mb-4">{style.description}</p>
                  <Link
                    to="/renovation-projects"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
                  >
                    View Projects <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section with Image */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12 md:mb-16">
            <div>
              <p className="text-label text-primary mb-4">Our Process</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                How We Deliver Your Dream Kitchen
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                A proven process that keeps your kitchen renovation on track, on budget, 
                and aligned with your vision from day one.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={kitchenImages.process}
                alt="Kitchen renovation process by Concept Design Construct"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {processSteps.map((step) => (
              <article key={step.step} className="bg-background p-6 md:p-8">
                <span className="text-4xl md:text-5xl font-serif text-primary/20">{step.step}</span>
                <h3 className="font-serif text-xl text-primary mt-4 mb-3">{step.title}</h3>
                <p className="text-foreground/75 text-sm leading-relaxed">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects CTA with Image */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-muted">
              <ResponsiveImage
                src={kitchenImages.portfolio}
                alt="Portfolio of Gold Coast kitchen renovations"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
                quality={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-label text-primary mb-4">Portfolio</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
                See Our Kitchen Renovations
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-8">
                Browse our portfolio of completed kitchen renovations across the Gold Coast. 
                From compact makeovers to complete transformations, see what&apos;s possible.
              </p>
              <Link
                to="/renovation-projects"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                View Kitchen Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide max-w-4xl">
          <p className="text-label text-primary mb-4">FAQs</p>
          <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-8">
            Common Kitchen Renovation Questions
          </h2>
          <div className="space-y-6">
            {serviceFaqs.map((faq) => (
              <article key={faq.question} className="border-b border-foreground/10 pb-6">
                <h3 className="font-serif text-xl md:text-2xl text-primary mb-3">{faq.question}</h3>
                <p className="text-foreground/75 leading-relaxed">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative z-10">
        <div className="container-wide text-center max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 mb-6">
            Ready to Start Your Kitchen Renovation?
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
            Book a free consultation to discuss your kitchen renovation project. 
            We&apos;ll assess your space, understand your needs, and provide a detailed quote.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/book-renovation-consultation"
              className="inline-block bg-background text-foreground px-8 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Book Free Consultation
            </Link>
            <a
              href="tel:1300020232"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-primary-foreground/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 1300 020 232
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KitchenRenovations;
