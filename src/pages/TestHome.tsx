import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EditorialReveal from "@/components/EditorialReveal";
import WhyRenovate from "@/components/WhyRenovate";
import WhatWeRenovateSplit from "@/components/WhatWeRenovateSplit";

import ProjectsTeaser from "@/components/ProjectsTeaser";
import JourneySection from "@/components/JourneySection";
import ProcessSection from "@/components/ProcessSection";
import CostsSection from "@/components/CostsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Preloader from "@/components/Preloader";
import { generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";

// FAQ data for structured data (matches FAQSection component)
const homepageFAQs = [
  {
    question: "How long does a kitchen renovation take?",
    answer: "Timing depends on scope and selections. Locked decisions and planning are what keep schedules predictable. We'll provide a realistic timeline based on your specific project during the planning phase.",
  },
  {
    question: "How long does a bathroom renovation take?",
    answer: "Bathrooms vary by complexity, but clear scope and selections reduce surprises. A straightforward bathroom refresh may take several weeks, while a full reconfiguration takes longer.",
  },
  {
    question: "How much does a renovation cost on the Gold Coast?",
    answer: "Costs depend on the size of the renovation, layout changes, and finishes. Kitchens and bathrooms are usually lower six figures, while whole home renovations vary based on scope.",
  },
  {
    question: "Do renovations on the Gold Coast need council approval?",
    answer: "Some renovations do, especially if they involve structural changes, extensions, or changes to the home footprint. We help identify what approvals are needed early.",
  },
  {
    question: "Do you handle approvals and coordination?",
    answer: "Yes. We guide the process and work with the right consultants so approvals and planning feel clear, not confusing.",
  },
  {
    question: "Do you help with design and selections?",
    answer: "Yes. We guide layout, design decisions, and selections so the process feels calm and manageable. You won't be left to figure it out alone.",
  },
  {
    question: "Can you renovate one space or the whole home?",
    answer: "Yes. Many clients start with a key space that will make the biggest difference. Others reshape the whole home for better flow and comfort. We help you decide what makes most sense for your situation.",
  },
];

const TestHome = () => {
  const shouldShowPreloader = useMemo(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("home_preloader_seen") !== "true";
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
      {shouldShowPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <SEO
        title="Gold Coast Renovations | Concept Design Construct"
        description="Gold Coast renovation builders for kitchens, bathrooms, and whole homes. Design-led, QBCC licensed. Free consultation."
        url="/"
        jsonLd={[generateLocalBusinessSchema(), generateFAQSchema(homepageFAQs)]}
      />
      <Header />
      <main>
        <Hero preloaderComplete={isPreloaderComplete} />
        <EditorialReveal />
        <JourneySection />
        <WhatWeRenovateSplit />
        <ProjectsTeaser />
        <WhyRenovate />
        <FAQSection />
        <CostsSection />
      </main>
      <Footer />
    </div>
  );
};

export default TestHome;
