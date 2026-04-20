import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax for vertical text
  const leftTextY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rightTextY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const faqs = [
    {
      question: "How long does a kitchen renovation take?",
      answer: "Planned correctly, a Gold Coast kitchen renovation takes approximately 2 weeks from demolition to completion. We order kitchen joinery and benchtops first, and once delivery dates are confirmed, demolition begins followed by carpentry, electrical and plumbing rough-ins. Joinery is then installed, followed by benchtops, appliances, splashback, fit-offs and painting. Our team coordinates every trade to keep the timeline on track and minimise disruption to your household.",
    },
    {
      question: "How long does a bathroom renovation take?",
      answer: "A standard Gold Coast bathroom renovation typically spans approximately 4 weeks, while luxury bathrooms can take around 6 weeks. This includes strip-out, carpentry, rough-ins, lining, waterproofing, tiling and fit-offs. We provide a detailed schedule during the planning phase so you know exactly what to expect at each stage and can plan around any disruption.",
    },
    {
      question: "How much does a renovation cost on the Gold Coast?",
      answer: "Gold Coast renovation costs range from approximately $10k to $150k or more, depending on the scope of works and the level of quality required. A typical kitchen supply and install starts around $30k, while bathroom renovations generally range from $50k to $100k depending on finishes and fixtures. We provide transparent, itemised quotes during the planning phase so there are no surprises once work begins.",
    },
    {
      question: "Do renovations on the Gold Coast need council approval?",
      answer: "Most internal renovations on the Gold Coast do not require council approval. Generally, approval applies to extensions, new builds, or changes that alter the building footprint. We help identify early in the planning process whether your project needs any permits or certifications, so there are no delays once construction starts.",
    },
    {
      question: "Do you help with design and selections?",
      answer: "Yes, we love assisting with the design process for Gold Coast home renovations. Our experience allows us to recommend layouts that best suit your space while balancing functionality and style. We also guide material and fixture selections to ensure everything works practically and cohesively, helping you avoid costly mistakes and achieve a result that feels considered and complete.",
    },
    {
      question: "Can you renovate one space or the whole home?",
      answer: "We handle everything from single-room updates to complete whole-home renovations on the Gold Coast. It is often more cost-effective to renovate multiple spaces together rather than completing sections at different times. Projects run more smoothly with less disruption and fewer repeated trades, saving both time and cost. We help you prioritise which spaces will make the biggest difference to your daily life.",
    },
    {
      question: "Can I live in the house during renovation?",
      answer: "Yes, you can live in the house during most Gold Coast home renovations. While it may not be at full comfort during certain stages, we plan the work to minimise disruption to your daily routine. Our team keeps the site tidy and communicates the schedule clearly so you always know what to expect. The short-term inconvenience is well worth the transformation.",
    },
  ];

  return (
    <section ref={ref} className="py-12 md:py-20 border-t border-foreground/10 relative z-10 bg-background" id="faq">
      {/* Animated vertical text - Left (desktop only) */}
      <motion.div
        className="hidden 2xl:flex absolute left-6 2xl:left-10 top-1/2 -translate-y-1/2"
        style={{ y: leftTextY }}
      >
        <span 
          className="text-label text-body-text tracking-widest whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Gold Coast, Aus
        </span>
      </motion.div>

      {/* Animated vertical text - Right (desktop only) */}
      <motion.div
        className="hidden 2xl:flex absolute right-6 2xl:right-10 top-1/2 -translate-y-1/2"
        style={{ y: rightTextY }}
      >
        <span 
          className="text-label text-body-text tracking-widest whitespace-nowrap"
          style={{ writingMode: 'vertical-rl' }}
        >
          Established 2000
        </span>
      </motion.div>

      <div className="container-wide px-5 md:px-8">
        <motion.div 
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.p 
            className="text-label text-foreground/80 mb-4 md:mb-8 text-xs md:text-sm"
            whileInView={{ 
              letterSpacing: ["0.1em", "0.2em", "0.1em"],
            }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            FAQ
          </motion.p>
          <h2 className="text-primary font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
            Renovation FAQ, Gold Coast
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border-t border-foreground/20 last:border-b relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Animated highlight bar on open */}
              <motion.div 
                className="absolute left-0 top-0 w-1 h-full bg-primary"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ originY: 0 }}
              />
              
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-5 md:py-8 flex items-center justify-between text-left gap-4 md:gap-6 group pl-3 md:pl-4 min-h-[60px]"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <motion.span
                  className="text-foreground text-sm md:text-base lg:text-lg uppercase tracking-wide font-medium group-hover:text-foreground/70 transition-colors leading-tight"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {faq.question}
                </motion.span>
                <motion.span
                  className="text-foreground/70 flex-shrink-0 text-xl leading-none"
                  animate={{
                    rotate: openIndex === index ? 45 : 0,
                    scale: openIndex === index ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </motion.span>
              </button>
              <motion.div
                id={`faq-answer-${index}`}
                role="region"
                aria-hidden={openIndex !== index}
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                className="overflow-hidden"
              >
                <motion.p
                  className="text-body-text text-sm md:text-base leading-relaxed pb-5 md:pb-8 pl-3 md:pl-4 pr-4"
                  initial={{ x: -10 }}
                  animate={{ x: openIndex === index ? 0 : -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {faq.answer}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
