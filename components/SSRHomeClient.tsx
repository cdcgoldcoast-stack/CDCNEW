"use client";

import dynamic from "next/dynamic";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { PRIORITY_SITELINK_TARGETS } from "@/config/seo";

const EditorialReveal = dynamic(() => import("@/components/EditorialReveal"));
const JourneySection = dynamic(() => import("@/components/JourneySection"));
const WhatWeRenovateSplit = dynamic(() => import("@/components/WhatWeRenovateSplit"));
const ProjectsTeaser = dynamic(() => import("@/components/ProjectsTeaser"));
const WhyRenovate = dynamic(() => import("@/components/WhyRenovate"));
const FAQSection = dynamic(() => import("@/components/FAQSection"));
const CostsSection = dynamic(() => import("@/components/CostsSection"));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"));
const ImageComparisonSlider = dynamic(() => import("@/components/ImageComparisonSlider"), {
  ssr: false,
});

// Mobile-optimized deferred loader for below-fold heavy components
function MobileDeferred({ children, placeholder }: { children: React.ReactNode; placeholder?: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Skip on desktop
    if (window.innerWidth >= 768) {
      setIsVisible(true);
      return;
    }
    // Defer slightly on mobile to prioritize LCP
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return placeholder || null;
  return <>{children}</>;
}

export default function SSRHomeClient() {
  return (
    <>
      <main>
        <EditorialReveal />
        <JourneySection />

        <section className="bg-cream relative z-10 py-16 md:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-label text-foreground/65 mb-6">AI Design Tool</p>
                <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-6">
                  What Could Your Space Look Like?
                </h2>
                <p className="text-body-text text-lg leading-relaxed mb-10">
                  Snap a photo of your bathroom, kitchen, or living area — and see a renovation concept in seconds.
                </p>
                <ul className="space-y-2 text-body-text mb-8 text-sm md:text-base">
                  <li>
                    <strong>Keep your existing layout</strong> while testing different renovation styles.
                  </li>
                  <li>
                    Compare a fast before-and-after preview to discuss direction with your household.
                  </li>
                  <li>Build confidence before committing to selections and scope.</li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/renovation-design-tools"
                    className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                  >
                    Try With Your Own Photo
                  </Link>
                  <Link
                    to="/renovation-ai-generator"
                    className="text-label border border-primary/30 text-primary px-8 py-3 hover:bg-primary/5 transition-colors inline-block"
                  >
                    Open AI Generator
                  </Link>
                </div>
              </div>
              <MobileDeferred placeholder={<div className="aspect-[4/3] bg-muted/50" />}>
                <ImageComparisonSlider
                  beforeImage="https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Renovaton-before.webp"
                  afterImage="https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/RenovationAI.webp"
                  beforeLabel="Before"
                  afterLabel="AI Visualisation"
                />
              </MobileDeferred>
            </div>
          </div>
        </section>

        <WhatWeRenovateSplit />
        <ProjectsTeaser />
        <WhyRenovate />
        <TestimonialsSection />
        <FAQSection />
        <CostsSection />
      </main>
      <nav aria-label="Quick links" className="border-t border-neutral-200 bg-neutral-50 py-3 relative z-10">
        <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4">
          {PRIORITY_SITELINK_TARGETS.map((target) => (
            <li key={target.path}>
              <a
                href={target.path}
                className="text-xs font-medium uppercase tracking-wide text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                {target.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Footer />
    </>
  );
}
