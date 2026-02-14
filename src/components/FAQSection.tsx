import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
      answer: "Planned correctly, approximately 2 weeks. Order kitchen joinery and benchtops first. Once delivery dates are confirmed, demolition begins, followed by carpentry, electrical and plumbing rough ins. Joinery is then installed, followed by benchtops, appliances, splashback, fit offs and painting.",
    },
    {
      question: "How long does a bathroom renovation take?",
      answer: "A standard bathroom typically spans approximately 4 weeks. Luxury bathrooms can take around 6 weeks. This includes strip out, carpentry, rough ins, lining, waterproofing, tiling and fit offs.",
    },
    {
      question: "How much does a renovation cost on the Gold Coast?",
      answer: "Renovation costs can range from approximately $10k to $150k+, depending on the scope of works and level of quality required. A typical kitchen supply and install is around $30k. Bathrooms generally range from $50k to $100k, depending on finishes and fixtures.",
    },
    {
      question: "Do renovations on the Gold Coast need council approval?",
      answer: "No. Generally, council approval applies to extensions and new builds. Most internal renovations do not require approval.",
    },
    {
      question: "Do you help with design and selections?",
      answer: "Yes. We love assisting with the design process. Our experience allows us to recommend layouts that best suit your space while balancing functionality and style. We also help guide selections to ensure everything works practically and cohesively.",
    },
    {
      question: "Can you renovate one space or the whole home?",
      answer: "It is often more cost effective to renovate multiple spaces together rather than completing sections at different times. Projects run more smoothly, with less disruption and fewer repeated trades, saving both time and cost.",
    },
    {
      question: "Can I live in the house during renovation?",
      answer: "Yes, you can live in the house during renovation. It may not be at full comfort, but the wait will be worth it.",
    },
  ];

  return (
    <section ref={ref} className="py-12 md:py-28 border-t border-foreground/10 relative z-10 bg-background" id="faq">
      {/* Animated vertical text - Left (desktop only) */}
      <motion.div 
        className="hidden lg:flex absolute left-6 xl:left-10 top-1/2 -translate-y-1/2"
        style={{ y: leftTextY }}
      >
        <span 
          className="text-label text-foreground/60 tracking-widest whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Gold Coast, Aus
        </span>
      </motion.div>

      {/* Animated vertical text - Right (desktop only) */}
      <motion.div 
        className="hidden lg:flex absolute right-6 xl:right-10 top-1/2 -translate-y-1/2"
        style={{ y: rightTextY }}
      >
        <span 
          className="text-label text-foreground/60 tracking-widest whitespace-nowrap"
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
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.p 
            className="text-label text-foreground/60 mb-4 md:mb-8 text-xs md:text-sm"
            whileInView={{ 
              letterSpacing: ["0.1em", "0.2em", "0.1em"],
            }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            FAQ
          </motion.p>
          <h2 className="text-foreground font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
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
              viewport={{ once: true, margin: "-50px" }}
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
              >
                <motion.span 
                  className="text-foreground text-sm md:text-base lg:text-lg uppercase tracking-wide font-medium group-hover:text-foreground/70 transition-colors leading-tight"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {faq.question}
                </motion.span>
                <motion.span 
                  className="text-foreground/40 flex-shrink-0 text-xl leading-none"
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
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                className="overflow-hidden"
              >
                <motion.p 
                  className="text-foreground/70 text-sm md:text-base leading-relaxed pb-5 md:pb-8 pl-3 md:pl-4 pr-4"
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
