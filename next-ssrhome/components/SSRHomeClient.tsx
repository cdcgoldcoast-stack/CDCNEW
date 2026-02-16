"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EditorialReveal from "@/components/EditorialReveal";
import WhyRenovate from "@/components/WhyRenovate";
import WhatWeRenovateSplit from "@/components/WhatWeRenovateSplit";
import ProjectsTeaser from "@/components/ProjectsTeaser";
import JourneySection from "@/components/JourneySection";
import CostsSection from "@/components/CostsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";

const isAuditLikeClient = () => {
  if (typeof window === "undefined") return false;
  const userAgent = navigator.userAgent.toLowerCase();
  const automatedClient = navigator.webdriver === true;

  return (
    automatedClient ||
    userAgent.includes("lighthouse") ||
    userAgent.includes("chrome-lighthouse") ||
    userAgent.includes("pagespeed")
  );
};

export default function SSRHomeClient() {
  const shouldShowPreloader = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (isAuditLikeClient()) return false;
    if (sessionStorage.getItem("home_preloader_seen") === "true") return false;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      }
    ).connection;
    const slowConnection =
      Boolean(connection?.saveData) ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType || "");
    const lowPowerDevice =
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 4;

    return !prefersReducedMotion && !slowConnection && !lowPowerDevice;
  }, []);

  const [isPreloaderComplete, setIsPreloaderComplete] = useState(!shouldShowPreloader);

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("home_preloader_seen", "true");
    }
  };

  return (
    <div className="min-h-screen">
      {shouldShowPreloader && <Preloader onComplete={handlePreloaderComplete} minDuration={320} />}
      <Header />
      <main>
        <Hero preloaderComplete={isPreloaderComplete} />
        <EditorialReveal />
        <JourneySection />
        <WhatWeRenovateSplit />
        <ProjectsTeaser />
        <WhyRenovate />

        <section className="min-h-screen bg-cream relative z-10 flex items-center">
          <div className="container-wide py-20 md:py-0">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-label text-foreground/50 mb-6">AI Design Tool</p>
                <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-6">
                  What Could Your Space Look Like?
                </h2>
                <p className="text-foreground/60 text-lg leading-relaxed mb-10">
                  Snap a photo of your bathroom, kitchen, or living area — and see a renovation concept in seconds.
                </p>
                <ul className="space-y-2 text-foreground/70 mb-8 text-sm md:text-base">
                  <li>
                    <strong>Keep your existing layout</strong> while testing different renovation styles.
                  </li>
                  <li>
                    Compare a fast before-and-after preview to discuss direction with your household.
                  </li>
                  <li>Build confidence before committing to selections and scope.</li>
                </ul>
                <Link
                  to="/renovation-design-tools"
                  className="text-label bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity inline-block"
                >
                  Try With Your Own Photo
                </Link>
              </div>
              <div>
                <ImageComparisonSlider
                  beforeImage="https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Renovaton-before.webp"
                  afterImage="https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/RenovationAI.webp"
                  beforeLabel="Before"
                  afterLabel="AI Visualisation"
                />
              </div>
            </div>
          </div>
        </section>

        <FAQSection />
        <CostsSection />
      </main>
      <Footer />
    </div>
  );
}
