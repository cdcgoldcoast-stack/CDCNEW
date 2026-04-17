"use client";

import ResponsiveImage from "@/components/ResponsiveImage";
import QuoteFormInline from "@/components/QuoteFormInline";
import { Check, Phone, ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "How long does a kitchen renovation take?",
    answer:
      "A Gold Coast kitchen renovation typically takes approximately 2 weeks from demolition to completion when planned correctly. We coordinate every trade to keep the timeline on track.",
  },
  {
    question: "How long does a bathroom renovation take?",
    answer:
      "A standard bathroom renovation spans approximately 4 weeks, while luxury bathrooms can take around 6 weeks. This includes strip-out, carpentry, rough-ins, waterproofing, tiling, and fit-offs.",
  },
  {
    question: "How much does a renovation cost on the Gold Coast?",
    answer:
      "Costs range from approximately $10,000 to $150,000 or more depending on scope. Kitchen supply and install starts around $30,000, bathrooms range from $50,000 to $100,000. We provide transparent, itemised quotes so you always know what you're paying for.",
  },
  {
    question: "Do I need council approval for a Gold Coast renovation?",
    answer:
      "Most internal renovations on the Gold Coast do not require council approval. Approval generally applies to extensions, new builds, or changes to the building footprint. We identify early whether your project needs permits.",
  },
  {
    question: "Can I live in the house during renovation?",
    answer:
      "Yes. While it may not be at full comfort during certain stages, we plan the work to minimise disruption. Our team keeps the site tidy and communicates the schedule clearly throughout the build.",
  },
  {
    question: "Is CD Construct licensed and insured?",
    answer:
      "Yes. We hold a QBCC licence and are members of Master Builders Queensland. All projects are covered by home warranty insurance with full public liability and workers' compensation.",
  },
  {
    question: "Is the renovation consultation really free?",
    answer:
      "Absolutely. We visit your home, discuss your goals, walk the space, and provide honest advice — all at no cost and with zero obligation.",
  },
];

const images = {
  hero: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp",
  kitchen:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-upgrade-varsity-lakes-gold-coast-concept-design-construct.webp",
  bathroom:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  wholeHome:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
  extension:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations-Gold-Coast.webp",
  laundry:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/hallway-renovation-southport-gold-coast-concept-design-construct.webp",
  apartment:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  gallery1:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
  gallery2:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  gallery3:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
  gallery4:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
  gallery5:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovation-Bathroom.webp",
  gallery6:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  gallery7:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-upgrade-maudsland-concept-design-construct.webp",
  gallery8:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  before:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Renovaton-before.webp",
  after:
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/RenovationAI.webp",
};

const services = [
  {
    title: "Kitchen Renovations",
    image: images.kitchen,
    description:
      "Smarter storage, better movement, and a kitchen that supports real routines. From meal prep to morning coffee — every detail considered.",
    tag: "Most Requested",
  },
  {
    title: "Bathroom Renovations",
    image: images.bathroom,
    description:
      "Comfort, safety, and calm. Waterproofing-led upgrades with durable finishes designed for daily use and long-term value.",
    tag: "High Impact",
  },
  {
    title: "Whole-Home Renovations",
    image: images.wholeHome,
    description:
      "Improve layout, light, storage, and flow. We reshape how your entire space functions and feels every day.",
    tag: "Complete Transformation",
  },
  {
    title: "Home Extensions",
    image: images.extension,
    description:
      "Add the space your family needs without leaving the location you love. Extra bedrooms, expanded living, or entire new wings.",
    tag: "Council Approval Support",
  },
  {
    title: "Laundry & Connected Spaces",
    image: images.laundry,
    description:
      "Custom cabinetry, smart storage, utility sinks, and combined bathroom-laundry solutions for smoother living.",
    tag: "Practical Upgrades",
  },
  {
    title: "Apartment Renovations",
    image: images.apartment,
    description:
      "Body corporate compliant renovations for high-rise and low-rise apartments. We handle approvals and the full process.",
    tag: "Body Corp Compliant",
  },
];

const problems = [
  {
    title: "Poor Communication",
    body: "No updates, unreturned calls, and surprises on site day.",
    tag: "Most Common Complaint",
  },
  {
    title: "Hidden Costs & Scope Creep",
    body: "Vague quotes that balloon once work starts. Extras that were \u201Cnever discussed.\u201D A final invoice that looks nothing like the original quote.",
    tag: "Budget Killer",
  },
  {
    title: "Cutting Corners",
    body: "Cheap materials and rushed timelines — looks fine on day one, fails within months.",
    tag: "#1 Cause Of Failure",
  },
];

const reviews = [
  {
    quote:
      "Throughout the process they have been professional, communicative and supportive. We couldn\u2019t have asked for a better team for our first experience with renovating.",
    name: "Trish",
    sub: "Gold Coast \u00B7 Home Renovation \u00B7 Google Review",
  },
  {
    quote:
      "The finish is absolutely incredible and was finished within the timeframe provided. Mark is extremely detail conscious and this shines through in the trades he uses.",
    name: "Erin & Sam",
    sub: "Gold Coast \u00B7 Bathroom Renovation \u00B7 Google Review",
  },
  {
    quote:
      "In a word, CDC are \u2018Exceptional\u2019. Their team workmanship, punctual attendance and tidiness exceeded my expectations and building industry standards.",
    name: "Verified Google Review",
    sub: "Gold Coast \u00B7 Home Renovation \u00B7 Google Review",
  },
];

const reviewImages = [
  {
    src: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
    alt: "Kitchen result CD Construct",
  },
  {
    src: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
    alt: "Bathroom result CD Construct",
  },
  {
    src: "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
    alt: "Kitchen renovation result Elanora",
  },
];

const galleryImages = [
  { src: images.gallery1, alt: "Kitchen renovation" },
  { src: images.gallery2, alt: "Bathroom renovation Broadbeach" },
  { src: images.gallery3, alt: "Full house renovation" },
  { src: images.gallery4, alt: "Living room renovation" },
  { src: images.gallery5, alt: "Bathroom renovation Gold Coast detail" },
  { src: images.gallery6, alt: "Bathroom renovation Palm Beach" },
  { src: images.gallery7, alt: "Luxury bathroom Hope Island" },
  { src: images.gallery8, alt: "Bathroom renovation Mermaid Beach" },
];

const processSteps = [
  {
    num: "01",
    title: "Free Site Consultation & Quote",
    body: "We visit your home, assess every surface, discuss your goals, and align your budget with your lifestyle. The price we quote is the price you pay.",
  },
  {
    num: "02",
    title: "Design, Selections & Lock-In",
    body: "We help with layout, materials, and fixture selections. Co-sign a Master Builders contract with home warranty insurance. Timelines locked in.",
  },
  {
    num: "03",
    title: "Quality Build & Communication",
    body: "Trusted trades, premium materials, proper preparation. You\u2019ll know what\u2019s happening at every stage — no guessing, no chasing.",
  },
  {
    num: "04",
    title: "Final Walkthrough & Handover",
    body: "We walk the entire job with you. Every corner, every detail. If anything isn\u2019t right, we fix it then and there.",
  },
];

const whyChoose = [
  {
    title: "We Plan Properly",
    body: "Full site inspection to understand scope, surfaces, and access — no guesswork.",
    tag: "Detailed Planning",
  },
  {
    title: "Quality Materials Only",
    body: "Premium fixtures, durable finishes, and trusted suppliers. We never cut costs.",
    tag: "Built to Last",
  },
  {
    title: "Transparent Quoting",
    body: "The price we quote is the price you pay. Itemised, no hidden fees — ever.",
    tag: "No Hidden Fees",
  },
  {
    title: "On-Time Delivery",
    body: "Realistic timelines upfront. Kitchen ~2 weeks. Bathroom ~4 weeks. We hit our dates.",
    tag: "Reliable Scheduling",
  },
  {
    title: "Clean & Respectful",
    body: "We protect your home, keep the site tidy, and leave every space cleaner than we found it.",
    tag: "Property Protected",
  },
  {
    title: "4.9\u2605 Google Reviews",
    body: "Don\u2019t take our word for it — read what your Gold Coast neighbours say. 50+ verified reviews.",
    tag: "Locally Trusted",
  },
];

const featureStrips = [
  {
    title: "QBCC Licensed & Master Builders",
    body: "Fully licensed under QBCC with Master Builders membership. Co-signed contracts and home warranty insurance on every project.",
    tag: "QBCC + MASTER BUILDERS",
  },
  {
    title: "Same Team, Start to Finish",
    body: "Low staff turnover means the same people work on your project throughout. No strangers showing up halfway through.",
    tag: "CONSISTENCY",
  },
  {
    title: "Clear Communication Always",
    body: "You\u2019ll always know what\u2019s happening. Direct contact from planning through handover, with milestone check-ins.",
    tag: "NO SURPRISES",
  },
  {
    title: "Fixed Price Guarantee",
    body: "The price confirmed after your consultation is the price you pay. No hourly rates, no hidden extras.",
    tag: "PRICE LOCKED",
  },
];

/* -------------------------------------------------------------------------- */
/*  CTA helpers — only phone calls and form anchors, zero navigation links    */
/* -------------------------------------------------------------------------- */
function CallCTA() {
  return (
    <a
      href="tel:0413468928"
      className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
    >
      <Phone className="w-4 h-4" /> Call 0413 468 928
    </a>
  );
}

function FormCTA() {
  return (
    <a
      href="#quote-form"
      className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
    >
      Request Callback
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Landing page component — NO Header, NO Footer, NO outbound links          */
/* -------------------------------------------------------------------------- */
export default function GoldCoastRenovationsLP() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {/* 1. Hero with embedded form */}
        <section className="pt-16 pb-16 md:pt-24 md:pb-24 bg-cream">
          <div className="container-wide">
            <div className="grid lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-start">
              <div>
                <p className="text-label text-primary mb-4">QBCC Licensed & Insured Builders</p>
                <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-6">
                  Gold Coast Home Renovations
                </h1>
                <p className="font-serif italic text-xl md:text-2xl text-foreground leading-snug mb-6">
                  Quality Renovations That Last. Guaranteed Results or We Come Back and Fix It Free.
                </p>
                <p className="text-base md:text-lg text-foreground/75 leading-relaxed mb-4">
                  Gold Coast homeowners choose CD Construct for expert craftsmanship, transparent pricing,
                  and renovations that improve how you live every day — backed by Master Builders
                  contracts and full home warranty insurance.
                </p>
                <p className="text-sm text-foreground/50 mb-8">
                  Price confirmed before work begins. No hidden fees.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  <a
                    href="tel:0413468928"
                    className="text-label bg-primary text-primary-foreground px-8 py-4 text-center hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call Now — 0413 468 928
                  </a>
                  <span className="text-center text-xs uppercase tracking-wider text-foreground/50">
                    Obligation Free
                  </span>
                  <a
                    href="#quote-form"
                    className="text-center text-base md:text-lg font-bold text-primary hover:opacity-80 transition-opacity"
                  >
                    Can&apos;t talk? <span className="underline">Get a Fast Callback &rarr;</span>
                  </a>
                </div>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={images.hero}
                    alt="Gold Coast home renovation by Concept Design Construct"
                    width={800}
                    height={600}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    loading="eager"
                    priority
                    quality={50}
                    useSupabaseTransform
                    className="w-full h-full object-cover"
                  />
                </div>
                <blockquote className="mt-8 border-l-2 border-primary/30 pl-6 font-serif italic text-foreground/75">
                  &ldquo;Throughout the process they have been professional, communicative and supportive.
                  We couldn&apos;t have asked for a better team for our first experience with renovating.&rdquo;
                  <footer className="mt-3 text-xs uppercase tracking-wider text-foreground/50 not-italic">
                    — Trish, Gold Coast Home Renovation
                  </footer>
                </blockquote>
              </div>

              <div id="quote-form" className="bg-background border border-border/60 p-6 md:p-8 lg:sticky lg:top-12">
                <QuoteFormInline
                  source="lp-gold-coast"
                  eyebrow="Get Your Free"
                  heading="Renovation Quote"
                  hideNavLinks
                />
                <p className="mt-4 text-center text-xs text-foreground/50">
                  Fast Response &middot; No Hidden Fees &middot; Licensed & Insured
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Why Renovations Fail */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <div className="max-w-3xl mb-12">
              <p className="text-label text-primary mb-4">Why Renovations Fail</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                What Goes Wrong With Most Gold Coast Renovations
              </h2>
              <p className="text-lg text-foreground/70">
                Here&apos;s why most renovations go wrong — and how we prevent it.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {problems.map((problem) => (
                <div key={problem.title} className="bg-cream p-8">
                  <h3 className="font-serif italic text-xl text-primary mb-3">{problem.title}</h3>
                  <p className="text-foreground/70 mb-4">{problem.body}</p>
                  <span className="text-xs uppercase tracking-wider text-primary/80">
                    {problem.tag}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-10 border-l-2 border-primary/30 pl-6">
              <p className="text-foreground/80">
                We plan every detail and communicate every step — so the renovation lasts.{" "}
                <span className="text-primary">Full inspection included on every consultation.</span>
              </p>
              <p className="text-sm text-foreground/50 mt-3">
                Gold Coast Renovation Specialists Since 2000 &middot; QBCC Licensed &middot; Master Builders &middot; 4.9&#9733; Google (50+ Reviews)
              </p>
            </div>
          </div>
        </section>

        {/* 3. What We Do — Services (no outbound links) */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-label text-primary mb-4">What We Do</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Renovation Services Across the Gold Coast
              </h2>
              <p className="text-lg text-foreground/70">
                From a single bathroom refresh to a full home transformation — proper planning and
                quality trades on every job.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.title} className="bg-background overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <ResponsiveImage
                      src={service.image}
                      alt={`${service.title} on the Gold Coast`}
                      width={600}
                      height={450}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      loading="lazy"
                      quality={45}
                      useSupabaseTransform
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif italic text-xl text-primary mb-3">{service.title}</h3>
                    <p className="text-foreground/70 mb-4">{service.description}</p>
                    <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-primary bg-primary/8 px-2.5 py-1 rounded-sm">
                      {service.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-12">
              <CallCTA />
              <FormCTA />
            </div>
          </div>
        </section>

        {/* 4. Customer Reviews */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-label text-primary mb-4">Customer Reviews</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                What Our Customers Say About Their Renovation
              </h2>
              <p className="text-lg text-foreground/70">
                Real reviews from real Gold Coast homeowners — verified on Google.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-10">
              {reviewImages.map((img) => (
                <div key={img.src} className="aspect-[4/3] overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={img.src}
                    alt={img.alt}
                    width={400}
                    height={300}
                    sizes="(min-width: 768px) 33vw, 33vw"
                    loading="lazy"
                    quality={40}
                    useSupabaseTransform
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.name} className="bg-cream p-8">
                  <div className="text-primary mb-4 tracking-widest">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <blockquote className="font-serif italic text-foreground/80 leading-relaxed mb-6">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <div className="text-sm font-semibold text-primary">{review.name}</div>
                  <div className="text-xs uppercase tracking-wider text-foreground/50 mt-1">
                    {review.sub}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-12">
              <CallCTA />
              <FormCTA />
            </div>
          </div>
        </section>

        {/* 5. Our Recent Work — Gallery + Before & After */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container-wide">
            <div className="max-w-3xl mb-12">
              <p className="text-label text-primary mb-4">Our Recent Work</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Gold Coast Renovation Projects
              </h2>
              <p className="text-lg text-foreground/70">
                Real transformations from Gold Coast homes. Each project delivered by our trusted team
                with premium materials.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((item, idx) => (
                <div key={idx} className="aspect-square overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={item.src}
                    alt={item.alt}
                    width={400}
                    height={400}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    loading="lazy"
                    quality={40}
                    useSupabaseTransform
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-16">
              <h3 className="font-serif italic text-2xl text-primary mb-2">Before & After</h3>
              <p className="text-foreground/60 mb-8">
                See what your renovation could look like. Real project transformations by CD Construct.
              </p>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="relative overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={images.before}
                    alt="Room before renovation"
                    width={700}
                    height={525}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    loading="lazy"
                    quality={40}
                    useSupabaseTransform
                    className="w-full h-auto block"
                  />
                  <span className="absolute top-4 left-4 bg-background/90 text-xs uppercase tracking-wider text-foreground px-3 py-1.5">
                    Before
                  </span>
                </div>
                <div className="relative overflow-hidden bg-muted">
                  <ResponsiveImage
                    src={images.after}
                    alt="Bathroom renovation after - CD Construct Gold Coast"
                    width={700}
                    height={525}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    loading="lazy"
                    quality={40}
                    useSupabaseTransform
                    className="w-full h-auto block"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1.5">
                    After
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-12">
              <CallCTA />
              <FormCTA />
            </div>
          </div>
        </section>

        {/* 6. Our Process */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-label text-primary mb-4">Our Process</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                How We Renovate Your Home the Right Way
              </h2>
              <p className="text-lg text-foreground/70">
                Every job follows the same proven process. No shortcuts, no guesswork — just a result that lasts.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {processSteps.map((step) => (
                <div key={step.num} className="bg-cream p-8 relative">
                  <div className="absolute top-6 right-8 font-serif text-5xl text-primary/20 leading-none">
                    {step.num}
                  </div>
                  <h3 className="font-serif italic text-xl text-primary mb-3 pr-16">{step.title}</h3>
                  <p className="text-foreground/70">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-cream p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif italic text-lg text-primary mb-2">
                      Full On-Site Inspection Included
                    </h4>
                    <p className="text-foreground/70 text-sm">
                      Every consultation includes a thorough property assessment at no cost.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif italic text-lg text-primary mb-2">
                      Written Workmanship Guarantee
                    </h4>
                    <p className="text-foreground/70 text-sm">
                      If any work fails due to our workmanship, we come back and fix it at no cost to you.
                    </p>
                  </div>
                </div>
              </div>
              <span className="inline-block mt-6 text-[10px] font-semibold tracking-wider uppercase text-primary bg-primary/8 px-2.5 py-1 rounded-sm">
                Your Investment Protected
              </span>
            </div>
          </div>
        </section>

        {/* 7. Why CD Construct */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-label text-primary mb-4">Why CD Construct</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-6">
                Why Gold Coast Homeowners Choose CD Construct
              </h2>
              <p className="text-lg text-foreground/70">
                Six reasons our customers trust us — and recommend us every time.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {whyChoose.map((item) => (
                <div key={item.title} className="border-l-2 border-primary/30 pl-6">
                  <h3 className="font-serif italic text-xl text-primary mb-3">{item.title}</h3>
                  <p className="text-foreground/70 mb-3">{item.body}</p>
                  <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-primary bg-primary/8 px-2.5 py-1 rounded-sm">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featureStrips.map((strip) => (
                <div key={strip.title} className="bg-background p-8 flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-label text-primary mb-2">{strip.title}</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed mb-3">{strip.body}</p>
                    <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-primary bg-primary/8 px-2.5 py-1 rounded-sm">
                      {strip.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-12">
              <CallCTA />
              <FormCTA />
            </div>
          </div>
        </section>

        {/* 8. FAQs */}
        <section className="py-16 md:py-24">
          <div className="container-wide max-w-3xl">
            <p className="text-label text-primary mb-4 text-center">Any Questions?</p>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-foreground/10 pb-6">
                  <h3 className="font-serif italic text-lg text-primary mb-2">{faq.question}</h3>
                  <p className="text-foreground/70">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 bg-cream p-8">
              <h4 className="font-serif italic text-xl text-primary mb-2">Still Have a Question?</h4>
              <p className="text-foreground/70 mb-5">
                Call us directly and we&apos;ll answer immediately — during business hours.
              </p>
              <a
                href="tel:0413468928"
                className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call Now — 0413 468 928
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
