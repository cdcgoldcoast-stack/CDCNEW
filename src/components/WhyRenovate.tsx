import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const WhyRenovate = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.2"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const paddingY = useTransform(scrollYProgress, [0, 1], [120, 96]);

  const { scrollYProgress: contentProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const quoteY = useTransform(contentProgress, [0, 1], [0, -50]);
  const floatY1 = useTransform(contentProgress, [0, 1], [0, -80]);
  const floatY2 = useTransform(contentProgress, [0, 1], [0, -120]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-background py-4 md:py-10"
    >
      <motion.div
        className="bg-primary relative overflow-hidden w-screen min-h-[60vh] md:min-h-[70vh] flex items-center justify-center py-16 md:py-24"
        style={{
          scale,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
      >
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
            <motion.blockquote
              style={{ y: quoteY }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-10 md:mb-14"
            >
              <p className="text-white font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2]">
                "A renovation should improve your life, not take over life"
              </p>
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                to="/book-renovation-consultation"
                className="inline-flex items-center justify-center h-11 px-7 bg-white text-primary text-xs tracking-[0.22em] uppercase hover:bg-white/90 transition-colors"
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
