import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
const StepLine = ({
  index,
  totalSteps,
  containerRef
}: {
  index: number;
  totalSteps: number;
  containerRef: React.RefObject<HTMLElement>;
}) => {
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start 0.3", "end 0.7"]
  });

  // Each step gets a portion of the total scroll progress
  const stepStart = index / totalSteps;
  const stepEnd = (index + 1) / totalSteps;
  const lineHeight = useTransform(scrollYProgress, [stepStart, stepEnd], ["0%", "100%"]);
  return <div className="relative flex-shrink-0 w-px">
      <div className="absolute inset-0 bg-foreground/10" />
      <motion.div className="absolute top-0 left-0 w-full bg-primary/60 origin-top" style={{
      height: lineHeight
    }} />
    </div>;
};
const ProcessSection = () => {
  const ref = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for the left column to animate the title
  const {
    scrollYProgress
  } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Phase 1: Title scrolls in naturally (0 to 0.2)
  // Phase 2: Title is fixed at center (0.2 to 0.8)
  // Phase 3: Title scrolls out (0.8 to 1)
  const titleY = useTransform(scrollYProgress, [0, 0.15, 0.2, 0.75, 0.8, 1], ["30vh", "10vh", "0vh", "0vh", "-10vh", "-30vh"]);

  // Only show title when within the process section - hide earlier at the end
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.7, 0.75, 1], [0, 0, 1, 1, 0, 0]);
  const steps = [{
    number: "01",
    title: "Understand your home and your day",
    description: "We learn how you live, what feels difficult, and what you want to feel different at home."
  }, {
    number: "02",
    title: "Planning with you",
    description: "We turn your needs into clear priorities, a practical scope, and a direction that suits your lifestyle now and later."
  }, {
    number: "03",
    title: "Design and selections",
    description: "We guide design and choices for finishes and fixtures in a way that feels simple, not overwhelming."
  }, {
    number: "04",
    title: "Quote and timeline",
    description: "You receive a clear quote and a realistic outline of timing, so you know what you are committing to before anything begins."
  }, {
    number: "05",
    title: "Confirm decisions before we start",
    description: "We lock in the key decisions early, so the build feels calmer and avoids unnecessary changes mid project."
  }, {
    number: "06",
    title: "Build and communication",
    description: "Work begins with a clear plan. You know what is happening, what is next, and where things stand throughout."
  }, {
    number: "07",
    title: "Handover and settling in",
    description: "We complete the project carefully and walk you through everything, so your home feels easy to live in from the first week."
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };
  const stepVariants = {
    hidden: {
      opacity: 0,
      x: -30
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };
  return (
    <section ref={ref} className="relative bg-background py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="text-primary/50 text-sm tracking-[0.2em] uppercase mb-4">
            Our Gold Coast Renovation Process
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight">
            How We Work
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="group"
            >
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
  );
};
export default ProcessSection;