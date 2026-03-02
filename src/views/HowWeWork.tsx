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
      "We learn how you live, what feels difficult, and what you want to feel different at home.",
  },
  {
    number: "02",
    title: "Planning with you",
    description:
      "We turn your needs into clear priorities, a practical scope, and a direction that suits your lifestyle now and later.",
  },
  {
    number: "03",
    title: "Design and selections",
    description:
      "We guide design and choices for finishes and fixtures in a way that feels simple, not overwhelming.",
  },
  {
    number: "04",
    title: "Quote and timeline",
    description:
      "You receive a clear quote and a realistic outline of timing, so you know what you are committing to before anything begins.",
  },
  {
    number: "05",
    title: "Confirm decisions before we start",
    description:
      "We lock in the key decisions early, so the build feels calmer and avoids unnecessary changes mid project.",
  },
  {
    number: "06",
    title: "Build and communication",
    description:
      "Work begins with a clear plan. You know what is happening, what is next, and where things stand throughout.",
  },
  {
    number: "07",
    title: "Handover and settling in",
    description:
      "We complete the project carefully and walk you through everything, so your home feels easy to live in from the first week.",
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

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary mb-6">Our Process</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-8">
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
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight">
              Our 7-Step Renovation Process
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {steps.map((step) => (
              <motion.div key={step.number} variants={itemVariants} className="group">
                <span className="block font-serif text-5xl text-primary/15 mb-4 group-hover:text-primary/30 transition-colors duration-300">
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
            <p className="text-label text-primary-foreground/60 mb-4">
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
            viewport={{ once: true, margin: "-50px" }}
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
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="relative z-10">
        <BottomInvitation
          title="Start Your Renovation"
          description="Ready to transform your home? Book a free consultation and we will walk you through our process."
          ctaLabel="Book a Consultation"
          ctaTo="/book-renovation-consultation"
          className="mt-0 mb-0"
        />
      </div>

      <Footer />
    </div>
  );
};

export default HowWeWork;
