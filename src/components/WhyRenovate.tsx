import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const WhyRenovate = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.2"]
  });

  // Scale from 0.2 to 1 as user scrolls into view
  const scale = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  // Vertical padding reduces as section expands (creating immersive feel)
  const paddingY = useTransform(scrollYProgress, [0, 1], [120, 96]);

  // Parallax for internal scroll after section is visible
  const { scrollYProgress: contentProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Subtle parallax movements for depth layers
  const labelY = useTransform(contentProgress, [0, 1], [0, -30]);
  const quoteY = useTransform(contentProgress, [0, 1], [0, -50]);
  const dividerY = useTransform(contentProgress, [0, 1], [0, -40]);
  const paragraphY = useTransform(contentProgress, [0, 1], [0, -20]);
  
  // Floating decorative elements
  const floatY1 = useTransform(contentProgress, [0, 1], [0, -80]);
  const floatY2 = useTransform(contentProgress, [0, 1], [0, -120]);

  return (
    <section 
      ref={sectionRef}
      className="relative z-10 bg-background py-4 md:py-10"
    >
      <motion.div 
        className="bg-primary relative overflow-hidden w-screen min-h-[80vh] md:h-screen flex items-center justify-center py-12 md:py-0"
        style={{ 
          scale,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
      >
        {/* Subtle floating decorative circles for depth */}
        <motion.div 
          className="absolute top-20 left-[10%] w-32 md:w-64 h-32 md:h-64 rounded-full bg-white/[0.03] blur-3xl pointer-events-none"
          style={{ y: floatY1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-[15%] w-48 md:w-96 h-48 md:h-96 rounded-full bg-white/[0.02] blur-3xl pointer-events-none"
          style={{ y: floatY2 }}
        />
        
        <div className="container-wide relative z-10 px-5 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p 
              className="text-label text-white/70 mb-6 md:mb-10 text-xs md:text-sm"
              style={{ y: labelY }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Why Renovate
            </motion.p>
            
            {/* Quote with parallax */}
            <motion.blockquote 
              className="mb-8 md:mb-12"
              style={{ y: quoteY }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-white font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2]">
                "A renovation should improve your life, not take over life"
              </p>
            </motion.blockquote>
            
            {/* Divider with parallax */}
            <motion.div 
              className="h-px bg-white/30 mx-auto my-8 md:my-12 max-w-xs md:max-w-md"
              style={{ y: dividerY }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            
            <motion.div
              className="text-left max-w-2xl mx-auto space-y-6"
              style={{ y: paragraphY }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="grid gap-5 md:gap-6">
                <div className="flex gap-4 items-start">
                  <span className="text-white/50 text-xs uppercase tracking-wider mt-1 w-32 flex-shrink-0 text-right">Cost surprises</span>
                  <span className="text-white/80 text-sm md:text-base leading-relaxed">Transparent, itemised quotes before work begins.</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white/50 text-xs uppercase tracking-wider mt-1 w-32 flex-shrink-0 text-right">Unclear timelines</span>
                  <span className="text-white/80 text-sm md:text-base leading-relaxed">Realistic schedules locked in at contract, with regular updates.</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white/50 text-xs uppercase tracking-wider mt-1 w-32 flex-shrink-0 text-right">Disruption</span>
                  <span className="text-white/80 text-sm md:text-base leading-relaxed">Structured process so you know what happens and when.</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white/50 text-xs uppercase tracking-wider mt-1 w-32 flex-shrink-0 text-right">Too many decisions</span>
                  <span className="text-white/80 text-sm md:text-base leading-relaxed">We guide selections step by step.</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-8 md:mt-10"
            >
              <Link
                to="/book-renovation-consultation"
                className="text-white/80 text-sm border-b border-white/40 pb-1 inline-block hover:text-white transition-colors"
              >
                Book a No-Pressure Chat
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WhyRenovate;
