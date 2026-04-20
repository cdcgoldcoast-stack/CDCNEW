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
  { value: "2000", label: "Founded" },
  { value: "4.9", label: "Google Rating" },
  { value: "50", label: "Reviews" },
  { value: "QBCC", label: "Licensed" },
];

const differentiators = [
  {
    icon: Paintbrush,
    title: "Design-Led Process",
    description:
      "Every renovation starts with design, not a ballpark price. We walk you through layout options, cabinetry, benchtops, tapware, and lighting with 3D renders and AI concept visuals before anything is ordered. Selections are curated down to three strong choices per category, so you're making confident decisions, not drowning in a showroom.",
  },
  {
    icon: FileText,
    title: "Fixed-Price Contracts",
    description:
      "Your quote is your price. Every contract is QBCC-compliant, itemised, and fixed before work starts. Deposits stay within QBCC limits (5% for contracts over $20,000). Progress payments are tied to verifiable milestones, not arbitrary dates. You know the total cost, start date, and handover date before you sign.",
  },
  {
    icon: ShieldCheck,
    title: "QBCC Licensed & Master Builders",
    description:
      "QBCC licence 15155156, ABN 88 624 756 476, and Master Builders Queensland membership. All work is covered by statutory Queensland Home Warranty Insurance through QBCC, plus our own 10-year waterproofing warranty on wet areas — well above the minimum AS 3740 compliance required on the Gold Coast.",
  },
  {
    icon: Sparkles,
    title: "AI Design Visualisation",
    description:
      "Preview your renovation before a single trade sets foot on site. Upload a photo of your existing kitchen, bathroom, or living area and our AI design tool returns concept renders in seconds. It's a low-commitment way to explore styles before we sit down for a paid design session.",
  },
  {
    icon: User,
    title: "Single Point of Contact",
    description:
      "Mark Mayne personally runs every project from quote through handover. You're not passed between a salesperson, a designer, an estimator, and a site supervisor — Mark is the one person you speak to. That continuity is how decisions get made quickly and how details don't fall between the cracks.",
  },
  {
    icon: MessageCircle,
    title: "Clear Communication Throughout",
    description:
      "Weekly written updates during the build — what happened this week, what's planned for next week, and any decisions that need your input. No jargon, no surprises. 30 days after handover we check in on how the space is living, and we do it again at 12 months to address any settlement or defect items under warranty.",
  },
];

const reviews = [
  {
    quote:
      "We were so impressed by the timeliness, attitude and workmanship that when we needed an insurance repair on our main bathroom, we engaged CDC again. A builder who does what he says he will do.",
    name: "Daryl Weavers",
    suburb: "Gold Coast",
  },
  {
    quote:
      "They are on time, efficient, well mannered and clean up after themselves. You can't ask for more. I would highly recommend them for any building or renovation.",
    name: "Fran",
    suburb: "Gold Coast",
  },
  {
    quote:
      "Mark managed to deliver great work within really tight timelines for our bathroom renovation. Really happy with the outcome and the result didn't disappoint our expectations.",
    name: "Jonathan",
    suburb: "Gold Coast",
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
        description="Operating since 2000, 4.9 Google rating, QBCC licensed. Discover why Gold Coast homeowners choose Concept Design Construct."
        url="/why-cdc"
      />
      <Header />
      <main id="main-content">

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-primary relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary-foreground/85 mb-6">
              Why CDC
            </p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-primary-foreground leading-tight mb-8">
              Why Gold Coast Homeowners Choose Us
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6">
              Since 2000, we have helped Gold Coast families transform
              their homes with a design-led process, fixed-price contracts, and
              clear communication from start to finish.
            </p>
            <p className="text-primary-foreground/75 text-base md:text-lg leading-relaxed">
              CDC operates locally from the Gold Coast. That matters because renovating here
              comes with its own set of constraints — council overlays in Surfers Paradise and
              Broadbeach, body corporate approvals for apartments from Main Beach to Coolangatta,
              coastal corrosion on fixtures, salt-air-rated ventilation, and waterproofing to
                AS 3740 that has to stand up to a subtropical climate. We've built through all of it.
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
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight">
              The CDC Difference
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
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
                  <h3 className="font-serif text-lg text-primary mb-2">
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

      {/* How We Operate */}
      <section className="py-16 md:py-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <p className="text-label text-foreground/60 mb-4">How We Operate</p>
              <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight">
                Built for long-term Gold Coast homeowners
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 text-foreground/80 leading-relaxed"
            >
              <p>
                Most renovation stress comes from the same two places: decisions made too late,
                and costs that weren't locked in up front. We built our process to remove both.
                Every selection is made and signed off before demolition. Every long-lead item —
                stone, tapware, tiles, appliances — is ordered and on site before the trades that
                need them. That's why our builds finish on time while others drift.
              </p>
              <p>
                Fixed-price is only meaningful if the scope is specific. Our contracts itemise
                every fixture, every finish, every inclusion by brand and model. If something
                changes mid-build, we price the variation in writing before we proceed — no
                creeping invoices, no handshake add-ons. All contracts over $3,300 are QBCC-
                regulated and you have statutory cooling-off rights. Full details are in our{' '}
                <Link
                  to="/blog/qbcc-licensing-explained-gold-coast-homeowners"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  guide to QBCC licensing
                </Link>
                .
              </p>
              <p>
                Our trades are the same people, job after job. Licensed electricians, licensed
                plumbers, certified waterproofers, a single cabinetmaker, a single tiler. Each
                one signs their own compliance certificate. We keep a tight sub-contractor roster
                deliberately — it's how you protect finish quality, and it's how we can offer a
                10-year waterproofing warranty on wet areas without hedging.
              </p>
              <p>
                We work across kitchens, bathrooms, laundries, whole-home renovations, home
                extensions, outdoor renovations, and apartment renovations from Main Beach to
                Coolangatta. If your project touches council planning, a body corporate, or
                certifier sign-off, we handle the paperwork so you don't spend your weekends
                chasing approvals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
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
              Trusted by Homeowners
            </p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-primary leading-tight mb-8">
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
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <p className="text-body-text font-serif italic text-base md:text-lg leading-relaxed mb-6">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <footer className="mt-auto">
                  <p className="text-primary font-medium text-sm">
                    {review.name}
                  </p>
                  <p className="text-primary/60 text-xs uppercase tracking-wider mt-1">
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


      </main>
      <Footer />
    </div>
  );
};

export default WhyCDC;
