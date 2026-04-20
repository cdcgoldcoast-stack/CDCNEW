"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BottomInvitation from "@/components/BottomInvitation";
import { motion } from "framer-motion";
import { Paintbrush, FileText, User, Clock } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Understand your home and your day",
    description:
      "We start with an on-site visit to your Gold Coast home. Mark measures the space, looks at the existing plumbing, electrical, and structure, and sits down with you to understand how you actually use the rooms. We ask what works today, what doesn't, and what you want this renovation to change about how you live. No sales pitch — just a conversation about your home.",
  },
  {
    number: "02",
    title: "Planning with you",
    description:
      "We turn what you told us into a written scope. Must-haves, nice-to-haves, and the things we'd recommend against. You get a one-page priority list before any design work starts, so the direction is agreed before money or time goes into details. This is where we usually also flag whether your project will need a council DA, a building approval, or body corporate sign-off.",
  },
  {
    number: "03",
    title: "Design and selections",
    description:
      "Our designer walks you through layout options, cabinetry, benchtops, tapware, tiles, lighting, and appliances. You see 3D renders before anything is ordered. We curate the selections so you're choosing between three strong options, not drowning in a showroom. Every selection is costed in real time, so you never fall in love with a finish that breaks the budget.",
  },
  {
    number: "04",
    title: "Fixed-price quote and timeline",
    description:
      "You receive a written, itemised, QBCC-compliant contract with a fixed price and a realistic timeline. Deposits stay within QBCC limits (5% for contracts over $20,000). Progress payments are tied to real milestones you can verify. You know the total cost, the start date, the handover date, and exactly what's included before you sign anything.",
  },
  {
    number: "05",
    title: "Confirm decisions before we start",
    description:
      "Before demolition begins, every selection is locked in and every long-lead item is ordered. Stone, tapware, tiles, and appliances all arrive on site before the trades that need them. Locking decisions early is the single biggest reason our builds finish on time, because 90% of cost and schedule overruns come from mid-build indecision.",
  },
  {
    number: "06",
    title: "Build and communication",
    description:
      "Work starts on the agreed date. You get a weekly update from Mark by text or email — what happened this week, what's next, what needs a decision from you. Trades are sequenced tightly so the site moves every day. Waterproofing is flood-tested on bathrooms. Electrical and plumbing are signed off by licensed trades with their own compliance certificates.",
  },
  {
    number: "07",
    title: "Handover and settling in",
    description:
      "At handover we walk you through every drawer, tap, and switch. You get the QBCC compliance paperwork, every trade certificate, appliance manuals, and the 10-year waterproofing warranty on wet areas. 30 days later we check in, and 12 months later we check in again, because a good renovation should feel just as right in year one as it did on day one.",
  },
];

const differentiators = [
  {
    icon: FileText,
    title: "Fixed-Price Contracts",
    description:
      "No surprises. Your quote is your price. We lock in costs upfront so you can plan with confidence.",
  },
  {
    icon: User,
    title: "Single Point of Contact",
    description:
      "One person manages your project from start to finish — no being passed around between teams.",
  },
  {
    icon: Paintbrush,
    title: "Design-Led Approach",
    description:
      "Every renovation starts with design. We help you visualise your space before construction begins.",
  },
  {
    icon: Clock,
    title: "Clear Timeline",
    description:
      "Realistic timeframes communicated upfront. You always know what is happening and what comes next.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const HowWeWork = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="How We Work | Our 7-Step Renovation Process"
        description="Discover our structured 7-step renovation process — from understanding your home to handover."
        url="/how-we-work"
      />
      <Header />
      <main id="main-content">

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary mb-6">Our Process</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-8">
              How We Work
            </h1>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Every CDC renovation follows a structured 7-step process designed
              to keep things clear, calm, and on track. From the first
              conversation to handover, you will always know what is happening
              and what comes next.
            </p>
          </div>
        </div>
      </section>

      {/* 7-Step Process */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <p className="text-label text-foreground/60 mb-4">Step by Step</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight">
              Our 7-Step Renovation Process
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {steps.map((step) => (
              <motion.div key={step.number} variants={itemVariants} className="group">
                <span className="block font-serif text-5xl text-primary/35 mb-4 group-hover:text-primary/55 transition-colors duration-300">
                  {step.number}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-primary mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-16 md:py-24 bg-primary relative z-10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-label text-primary-foreground/85 mb-4">
              The CDC Difference
            </p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary-foreground leading-tight">
              What Makes It Different
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto"
          >
            {differentiators.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-primary-foreground/30 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-primary-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-primary-foreground/90 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <BottomInvitation
        title="Start Your Renovation"
        description="Ready to transform your home? Book a free consultation and we will walk you through our process."
        ctaLabel="Book a Consultation"
        ctaTo="/book-renovation-consultation"
        className="mt-0 mb-0"
      />


      </main>
      <Footer />
    </div>
  );
};

export default HowWeWork;
