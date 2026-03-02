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

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary mb-6">Before & After</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-8">
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
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
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

      <div className="relative z-10">
        <BottomInvitation
          title="Imagine Your Home Transformed"
          description="Every great renovation starts with a conversation. Book a free consultation and let us show you what is possible."
          ctaLabel="Book a Consultation"
          ctaTo="/book-renovation-consultation"
          className="mt-0 mb-0"
        />
      </div>

      <Footer />
    </div>
  );
};

export default BeforeAfter;
