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
import ImageComparisonSlider from "@/components/ImageComparisonSlider";
import { generateFAQSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import { Link } from "react-router-dom";

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
  return (
    <div className="min-h-screen">
      <SEO
        title="Gold Coast Renovations | Concept Design Construct"
        description="Gold Coast renovation builders for kitchens, bathrooms, and whole-home transformations with design-led planning, QBCC licensed delivery, and timelines."
        url="/"
        jsonLd={[generateLocalBusinessSchema(), generateFAQSchema(homepageFAQs)]}
      />
      <Header />
      <main>
        <Hero />
        <EditorialReveal />
        <JourneySection />
        <WhatWeRenovateSplit />
        <ProjectsTeaser />
        <WhyRenovate />

        {/* AI Design Tool Teaser */}
        <section className="bg-cream relative z-10 flex items-center">
          <div className="container-wide py-3 md:py-4 lg:py-5">
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
                  <li>
                    Build confidence before committing to selections and scope.
                  </li>
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
};

export default TestHome;
