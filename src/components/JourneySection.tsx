import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Contact Gold Coast Renovations",
    lines: [
      "Stop thinking about it and do it.",
      "Just this one step and we will take care",
      "of the rest. No pressure. No sales talk.",
    ],
  },
  {
    number: "02",
    title: "Free On-Site Consultation",
    lines: [
      "Free design advice shaped around you.",
      "We align your budget with your life needs.",
      "We walk the space and talk it through.",
    ],
  },
  {
    number: "03",
    title: "Quote Submission",
    lines: [
      "Clear, transparent, and considered.",
      "Based on what we discussed together.",
      "Clear quotation, no surprises.",
    ],
  },
  {
    number: "04",
    title: "Quote Acceptance",
    lines: [
      "Co-sign Master Builders contract.",
      "Provide home warranty insurance.",
      "Timelines and expectations locked in.",
    ],
  },
  {
    number: "05",
    title: "Renovation Selections",
    lines: ["The fun part starts here.", "Selections, finishes, fixtures, details.", "Your ideas start becoming real."],
  },
  {
    number: "06",
    title: "Gold Coast Renovations Build",
    lines: ["The transformation happens here.", "Yes, it is messy at times.", "But this is where the magic happens."],
  },
  {
    number: "07",
    title: "Renovations Handover",
    lines: ["Into your new space.", "The build is complete.", "You start enjoying living."],
  },
];

const JourneySection = () => {
  return (
    <section className="relative z-10 bg-background min-h-screen flex flex-col justify-center py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-5 md:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
        {/* Header - Large Editorial Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-4 md:mb-6"
        >
          <p className="text-primary/50 text-xs md:text-sm tracking-[0.2em] uppercase mb-4 md:mb-6">The Journey</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-primary leading-[1.1] tracking-tight italic">
            Steps Away From Your Dream Space!
          </h2>
        </motion.div>

        {/* Divider with gradient */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent origin-left mb-6 md:mb-8"
        />

        {/* Mobile only: Horizontal scroll */}
        <div className="md:hidden mb-8 -mx-5 px-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="w-[200px] flex-shrink-0 border-l-2 border-primary/20 pl-4"
              >
                <span className="font-serif text-3xl text-primary/30 block mb-2">
                  {step.number}
                </span>
                <p className="font-serif text-sm text-primary italic mb-2">
                  {step.title}
                </p>
                <p className="text-xs leading-relaxed text-primary/70">
                  {step.lines.join(" ")}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tablet + Desktop: Shared responsive grid */}
        <div className="hidden md:block mb-6 md:mb-8">
          <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`border-l-2 border-primary/20 pl-4 lg:border-primary/10 lg:pl-6 lg:pr-3 xl:pl-8 xl:pr-4 ${
                  index === 0 ? "lg:border-l-0" : "lg:border-l"
                }`}
              >
                <span className="block font-serif text-4xl lg:text-5xl xl:text-6xl mb-3 lg:mb-5 text-primary/20 h-12 lg:h-[60px] xl:h-[72px]">
                  {step.number}
                </span>
                <h3 className="font-serif text-sm lg:text-base xl:text-lg mb-2 lg:mb-4 leading-snug text-primary italic md:h-10 lg:h-[68px] xl:h-[76px]">
                  {step.title}
                </h3>
                <p className="text-xs lg:text-sm leading-relaxed text-primary/70 md:min-h-[6.5rem] lg:min-h-[8.5rem]">
                  {step.lines.join(" ")}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-6 md:mb-8" />

        {/* Outro Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 md:grid md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10"
        >
          <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl text-primary italic">Do it now!</h3>
          <div />
          <div className="flex justify-center md:justify-end">
            <Link
              to="/book-renovation-consultation"
              className="inline-flex items-center justify-center h-11 px-7 bg-primary text-primary-foreground text-xs tracking-[0.22em] uppercase hover:bg-primary/90 transition-colors"
            >
              Get Best Offers
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySection;
