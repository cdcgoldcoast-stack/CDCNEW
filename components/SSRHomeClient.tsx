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
      <main id="main-content">
        <EditorialReveal />
        <JourneySection />

        <section className="bg-cream relative z-10 py-16 md:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-label text-foreground/65 mb-6">AI Design Tool</p>
                <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-6">
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
                    className="border border-primary/30 text-primary px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors inline-block"
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

        {/* Latest from the Blog */}
        <section className="py-16 md:py-20 bg-background relative z-10">
          <div className="container-wide px-5 md:px-8">
            <div className="text-center mb-12">
              <p className="text-label text-foreground/60 mb-4 text-xs md:text-sm">Renovation Insights</p>
              <h2 className="text-primary font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Latest from Our Blog
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "How to Choose a Renovation Builder on the Gold Coast",
                  href: "/blog/how-to-choose-renovation-builder-gold-coast",
                  description: "A practical guide to finding and vetting a renovation builder — QBCC licensing, contracts, and red flags.",
                },
                {
                  title: "Gold Coast Renovation Costs 2026: Complete Price Guide",
                  href: "/blog/gold-coast-renovation-costs-complete-guide",
                  description: "Realistic renovation costs for Gold Coast kitchens, bathrooms, and whole homes with detailed breakdowns.",
                },
                {
                  title: "Apartment Renovation Rules: Body Corporate Guide",
                  href: "/blog/apartment-renovation-body-corporate-guide-gold-coast",
                  description: "Everything you need to know about body corporate rules and approvals before renovating your apartment.",
                },
              ].map((post) => (
                <a key={post.href} href={post.href} className="group block">
                  <h3 className="font-serif text-lg text-primary mb-2 group-hover:opacity-80 transition-opacity">
                    {post.title}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {post.description}
                  </p>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/blog" className="text-sm text-primary border border-primary/20 px-6 py-2 hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-widest">
                View All Posts
              </a>
            </div>
          </div>
        </section>

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
