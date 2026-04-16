"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BottomInvitation from "@/components/BottomInvitation";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const transformations = [
  {
    title: "Kitchen — AI Design Concept",
    description:
      "See how our AI design tool visualises a kitchen renovation concept. Upload a photo of your space and preview design directions before construction begins.",
    beforeImage:
      "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Renovaton-before.webp",
    afterImage:
      "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/RenovationAI.webp",
    beforeLabel: "Before",
    afterLabel: "AI Concept",
  },
];

const BeforeAfter = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Before & After | Gold Coast Renovation Transformations"
        description="See real before and after renovation transformations from Gold Coast homes."
        url="/before-after"
      />
      <Header />
      <main id="main-content">

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary mb-6">Before & After</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-8">
              See the Transformation
            </h1>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Drag the slider to compare before and after shots from real Gold
              Coast renovation projects. Every transformation starts with a
              conversation about how you want your home to feel.
            </p>
          </div>
        </div>
      </section>

      {/* Slider Gallery */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto space-y-16 md:space-y-20">
            {transformations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-primary mb-3">
                  {item.title}
                </h2>
                <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-6">
                  {item.description}
                </p>
                <ImageComparisonSlider
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  beforeLabel={item.beforeLabel}
                  afterLabel={item.afterLabel}
                />
              </motion.div>
            ))}
          </div>

          {/* More transformations note */}
          <motion.div
            className="max-w-4xl mx-auto mt-16 pt-12 border-t border-foreground/10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-foreground/60 text-sm md:text-base leading-relaxed mb-6">
              More before and after transformations are added as projects are
              completed. Browse our full project gallery to see completed
              renovations across the Gold Coast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/renovation-gallery"
                className="inline-flex items-center justify-center border border-foreground/20 text-foreground px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Browse Renovation Gallery
              </Link>
              <Link
                to="/renovation-ai-generator"
                className="inline-flex items-center justify-center border border-primary text-primary px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Try AI Design Tool
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-16 md:py-24 bg-cream/40">
        <div className="container-wide max-w-3xl mx-auto text-foreground/75 text-base md:text-lg leading-relaxed space-y-6">
          <h2 className="font-serif italic text-2xl md:text-3xl text-primary">
            How Gold Coast renovation before and after transformations come together
          </h2>
          <p>
            Every before and after you see on this page began as a conversation with Gold Coast
            homeowners about how they wanted to live. From that starting point, our design-led
            team worked through measured drawings, material selections, and sequencing decisions
            that shaped the final outcome. A strong transformation is never just a cosmetic
            refresh — it depends on the planning behind the finishes.
          </p>
          <p>
            Kitchen transformations typically rethink the relationship between cooking, storage,
            and everyday flow. Bathroom transformations are driven by waterproofing-first
            construction, layout adjustments, and fixture upgrades that improve daily comfort.
            Whole-home transformations pull the plan together so each zone supports the others,
            rather than feeling like a patchwork of separate projects.
          </p>
          <p>
            We document every project thoroughly so that the reveal at handover matches the
            direction we agreed during consultation. If a finished transformation inspires you
            and you want to understand how it was planned or costed, book a consultation with
            our Gold Coast renovation team and we will walk you through the process in detail —
            including realistic timelines, trade coordination, and the material choices behind
            the finished look.
          </p>
          <h3 className="font-serif italic text-xl md:text-2xl text-primary pt-4">
            Planning your own Gold Coast renovation transformation
          </h3>
          <p>
            If you are ready to start scoping your own renovation, browse the{" "}
            <Link to="/renovation-projects" className="underline underline-offset-4">
              full project portfolio
            </Link>
            , read about{" "}
            <Link to="/how-we-work" className="underline underline-offset-4">
              how we work
            </Link>
            , or jump straight into a{" "}
            <Link to="/book-renovation-consultation" className="underline underline-offset-4">
              free consultation
            </Link>
            . Our QBCC-licensed builders work across the Gold Coast, from Broadbeach and Palm
            Beach through to Helensvale, Hope Island, and everywhere in between.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-wide max-w-3xl">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-primary mb-12 text-center">
            Before & After Renovation FAQs
          </h2>
          <div className="space-y-6">
            <div className="border-b border-foreground/10 pb-6">
              <h3 className="font-serif italic text-lg text-primary mb-2">How long does a typical renovation transformation take?</h3>
              <p className="text-foreground/70">Timelines vary by scope. A kitchen renovation typically takes around 2 weeks, a bathroom approximately 4 weeks, and a whole-home transformation 4–6 months. We lock in your timeline before work begins.</p>
            </div>
            <div className="border-b border-foreground/10 pb-6">
              <h3 className="font-serif italic text-lg text-primary mb-2">Can I see renovation results for my suburb?</h3>
              <p className="text-foreground/70">We've completed projects across 20+ Gold Coast suburbs — from Broadbeach and Southport to Helensvale and Hope Island. Contact us and we can share examples relevant to your area and property type.</p>
            </div>
            <div className="border-b border-foreground/10 pb-6">
              <h3 className="font-serif italic text-lg text-primary mb-2">What's included in the free consultation?</h3>
              <p className="text-foreground/70">Every consultation includes a full on-site inspection, discussion of your goals and budget, and a detailed fixed-price quote. There's no obligation and no hidden fees.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <BottomInvitation
          title="Imagine Your Home Transformed"
          description="Every great renovation starts with a conversation. Book a free consultation and let us show you what is possible."
          ctaLabel="Book a Consultation"
          ctaTo="/book-renovation-consultation"
          className="mt-0 mb-0"
        />
      </div>


      </main>
      <Footer />
    </div>
  );
};

export default BeforeAfter;
