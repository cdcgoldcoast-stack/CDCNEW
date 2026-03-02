"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BottomInvitation from "@/components/BottomInvitation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqCategories: { title: string; faqs: FAQItem[] }[] = [
  {
    title: "General",
    faqs: [
      {
        question: "Do renovations on the Gold Coast need council approval?",
        answer:
          "Generally, council approval applies to extensions and new builds. Most internal renovations do not require approval. If your project does need approvals, we coordinate the entire process including building certifiers and required documentation.",
      },
      {
        question: "Can I live in the house during renovation?",
        answer:
          "Yes, for most kitchen and bathroom renovations you can live in the house during renovation. It may not be at full comfort, but the wait will be worth it. For whole-home renovations, most clients arrange alternative accommodation during construction.",
      },
      {
        question: "Do you help with design and selections?",
        answer:
          "Yes. We love assisting with the design process. Our experience allows us to recommend layouts that best suit your space while balancing functionality and style. We also help guide selections to ensure everything works practically and cohesively.",
      },
      {
        question: "Can you renovate one space or the whole home?",
        answer:
          "It is often more cost effective to renovate multiple spaces together rather than completing sections at different times. Projects run more smoothly, with less disruption and fewer repeated trades, saving both time and cost.",
      },
      {
        question: "How does your renovation process work?",
        answer:
          "Our 7-step process covers understanding your home and lifestyle, planning priorities, guiding design and selections, providing a clear quote and timeline, confirming decisions before we start, building with clear communication throughout, and a careful handover so your home feels easy to live in from day one.",
      },
      {
        question: "Are you QBCC licensed?",
        answer:
          "Yes. Concept Design Construct is fully QBCC licensed and a member of Master Builders Queensland. All our work is covered by the statutory home warranty insurance required under Queensland law.",
      },
    ],
  },
  {
    title: "Costs & Pricing",
    faqs: [
      {
        question: "How much does a kitchen renovation cost on the Gold Coast?",
        answer:
          "Kitchen renovation costs depend on scope, size, and finishes. A mid-range kitchen renovation typically starts from $35,000-$50,000, while premium kitchens with custom cabinetry and high-end appliances can range from $60,000-$100,000+. We provide fixed-price quotes after detailed consultation and design.",
      },
      {
        question: "How much does a bathroom renovation cost on the Gold Coast?",
        answer:
          "Bathroom renovation costs vary based on size and specification. A standard bathroom renovation typically starts from $25,000-$35,000, while luxury bathrooms with high-end fixtures and tiling can range from $40,000-$60,000+. We provide detailed fixed-price quotes after design finalisation.",
      },
      {
        question:
          "How much does a whole-home renovation cost on the Gold Coast?",
        answer:
          "Whole-home renovation costs vary significantly based on size, condition, and specification. A typical 3-4 bedroom home renovation ranges from $150,000-$300,000+. This includes structural changes, kitchen, bathrooms, flooring, electrical, and finishing. We provide detailed fixed-price quotes after design finalisation.",
      },
      {
        question: "What waterproofing warranty do you provide?",
        answer:
          "We provide a 10-year waterproofing warranty on all bathroom renovations, exceeding the standard 7-year requirement. Our waterproofing is carried out by licensed applicators and includes full flood testing before tiling begins.",
      },
    ],
  },
  {
    title: "Timelines",
    faqs: [
      {
        question: "How long does a kitchen renovation take?",
        answer:
          "Most kitchen renovations take 4-8 weeks from demolition to handover, depending on complexity and custom elements. This includes cabinetry installation, benchtops, appliances, splashback, and final touches. We provide a detailed timeline during planning so you know exactly what to expect.",
      },
      {
        question: "How long does a bathroom renovation take?",
        answer:
          "Most bathroom renovations take 3-5 weeks from demolition to completion. This includes waterproofing (with mandatory curing time), tiling, fixture installation, and final finishes. Complex layouts or imported materials may extend this timeframe slightly.",
      },
      {
        question: "How long does a whole-home renovation take?",
        answer:
          "Most whole-home renovations take 4-6 months from demolition to handover. This includes design and approvals (4-8 weeks), construction (3-5 months), and final finishing. Complex structural work or custom elements may extend this timeline.",
      },
    ],
  },
  {
    title: "Design & Planning",
    faqs: [
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
      {
        question:
          "Can you match new work to existing character features?",
        answer:
          "Absolutely. We specialise in renovations that respect your home's character while adding modern functionality. Whether it's VJ walls, timber floors, or heritage features, we carefully integrate new work to complement existing elements.",
      },
      {
        question:
          "Do you do extensions as part of whole-home renovations?",
        answer:
          "Yes, many whole-home renovations include extensions — adding extra bedrooms, expanding living areas, or creating indoor-outdoor flow. We can assess your block's potential and design options that maximise space and value.",
      },
      {
        question:
          "Can you renovate my bathroom while keeping the same layout?",
        answer:
          "Yes, many clients choose to keep the existing layout to reduce costs and simplify the project. We can transform your bathroom with new fixtures, tiles, vanity, and finishes without moving plumbing points, delivering a fresh look at a lower price point.",
      },
      {
        question: "Do you supply bathroom fixtures and tiles?",
        answer:
          "We can supply all fixtures and tiles or work with your selections. Our trade accounts with major suppliers often secure better pricing than retail. We guide you through showrooms and provide recommendations based on your style and budget.",
      },
      {
        question:
          "Do you handle council approvals for kitchen renovations?",
        answer:
          "Most kitchen renovations don't require council approval if they don't involve structural changes or plumbing relocations. If your project does need approvals, we coordinate the entire process including building certifiers and required documentation.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Frequently Asked Questions | Gold Coast Renovations"
        description="Get answers to common Gold Coast renovation questions — costs, timelines, council approvals, design help, and what to expect."
        url="/faq"
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary mb-6">FAQ</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-8">
              Frequently Asked Questions
            </h1>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Everything you need to know about renovating your Gold Coast home
              — from costs and timelines to design help and what to expect
              during the build.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            {faqCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${category.title}-${faqIndex}`}
                    >
                      <AccordionTrigger className="text-left text-sm md:text-base font-medium text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/70 text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <BottomInvitation
          title="Still Have Questions?"
          description="We are happy to answer any questions about your renovation project. Book a free consultation and let us walk you through the process."
          ctaLabel="Book a Consultation"
          ctaTo="/book-renovation-consultation"
          className="mt-0 mb-0"
        />
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
