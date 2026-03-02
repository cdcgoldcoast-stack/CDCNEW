"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BottomInvitation from "@/components/BottomInvitation";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";
import ResponsiveImage from "@/components/ResponsiveImage";
import masterBuildersLogo from "@/assets/master-builders.webp";
import qbccLogo from "@/assets/qbcc.webp";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Paintbrush,
  FileText,
  ShieldCheck,
  Sparkles,
  User,
  MessageCircle,
} from "lucide-react";

const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "4.9", label: "Google Rating" },
  { value: "47", label: "Reviews" },
  { value: "QBCC", label: "Licensed" },
];

const differentiators = [
  {
    icon: Paintbrush,
    title: "Design-Led Process",
    description:
      "Every renovation starts with design. We help you visualise your space with layouts, material selections, and AI concept renders before any construction begins.",
  },
  {
    icon: FileText,
    title: "Fixed-Price Contracts",
    description:
      "No surprises. Your quote is your price. We lock in costs upfront with a detailed scope so you can plan with total confidence.",
  },
  {
    icon: ShieldCheck,
    title: "QBCC Licensed & Master Builders",
    description:
      "Fully QBCC licensed with Master Builders Queensland membership. All work is covered by statutory home warranty insurance.",
  },
  {
    icon: Sparkles,
    title: "AI Design Visualisation",
    description:
      "Preview your renovation before it starts with our AI design tool. Upload a photo of your space and see concept renders in seconds.",
  },
  {
    icon: User,
    title: "Single Point of Contact",
    description:
      "One project manager from consultation to handover. No being passed between teams — you always know who to talk to.",
  },
  {
    icon: MessageCircle,
    title: "Clear Communication Throughout",
    description:
      "Regular updates, honest timelines, and no jargon. You will always know what is happening, what is next, and where things stand.",
  },
];

const reviews = [
  {
    quote:
      "They kept us informed at every stage — no surprises, no hidden costs. The whole process felt straightforward from start to finish.",
    name: "Sarah M.",
    suburb: "Broadbeach",
  },
  {
    quote:
      "We were nervous about the disruption, but the team had a clear plan and stuck to it. Our home feels completely different now — in the best way.",
    name: "James & Lisa T.",
    suburb: "Robina",
  },
  {
    quote:
      "From the first consultation to handover, communication was excellent. They genuinely cared about getting it right for our family.",
    name: "Mark D.",
    suburb: "Helensvale",
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const WhyCDC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Why Choose CDC | Gold Coast Renovation Builders"
        description="25+ years experience, 4.9 Google rating, QBCC licensed. Discover why Gold Coast homeowners choose Concept Design Construct."
        url="/why-cdc"
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-primary relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary-foreground/60 mb-6">
              Why CDC
            </p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-primary-foreground leading-tight mb-8">
              Why Gold Coast Homeowners Choose Us
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              For over 25 years, we have helped Gold Coast families transform
              their homes with a design-led process, fixed-price contracts, and
              clear communication from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 md:py-16 bg-background relative z-10 border-b border-foreground/10">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-4xl md:text-5xl font-serif text-primary block mb-2">
                  {stat.value}
                </span>
                <p className="text-sm text-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-label text-foreground/60 mb-4">
              What Sets Us Apart
            </p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight">
              The CDC Difference
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto"
          >
            {differentiators.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {item.title === "AI Design Visualisation" && (
                    <Link
                      to="/renovation-ai-generator"
                      className="inline-block mt-3 text-xs uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                    >
                      Try the AI Tool &rarr;
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-label text-foreground/60 mb-4">
              Trusted by Homeowners
            </p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-8">
              What Our Clients Say
            </h2>
            <div className="flex justify-center mb-10">
              <GoogleReviewBadge
                iconSize="w-8 h-8"
                starSize="w-4 h-4"
                labelSize="text-sm"
                starGap="gap-1"
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <motion.blockquote
                key={index}
                className="text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <p className="text-body-text font-serif italic text-base md:text-lg leading-relaxed mb-6">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <footer className="mt-auto">
                  <p className="text-foreground font-medium text-sm">
                    {review.name}
                  </p>
                  <p className="text-foreground/60 text-xs uppercase tracking-wider mt-1">
                    {review.suburb}
                  </p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation Logos */}
      <section className="py-12 md:py-16 bg-background relative z-10 border-t border-foreground/10">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-3">
              <ResponsiveImage
                src={qbccLogo}
                alt="QBCC Licensed Builder"
                width={1080}
                height={1080}
                sizes="80px"
                loading="lazy"
                className="h-20 w-auto"
              />
              <p className="text-xs text-foreground/50 uppercase tracking-wider">
                QBCC Licensed
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ResponsiveImage
                src={masterBuildersLogo}
                alt="Master Builders Queensland Member"
                width={1080}
                height={1080}
                sizes="80px"
                loading="lazy"
                className="h-20 w-auto"
              />
              <p className="text-xs text-foreground/50 uppercase tracking-wider">
                Master Builders Member
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <BottomInvitation
          title="Ready to Get Started?"
          description="Book a free consultation and discover why Gold Coast homeowners trust CDC with their renovation projects."
          ctaLabel="Book a Consultation"
          ctaTo="/book-renovation-consultation"
          className="mt-0 mb-0"
        />
      </div>

      <Footer />
    </div>
  );
};

export default WhyCDC;
