import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const CostsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const services = [{
    name: "Kitchens",
    subtitle: "Heart of the home"
  }, {
    name: "Bathrooms",
    subtitle: "Daily comfort"
  }, {
    name: "Whole Homes",
    subtitle: "Complete transformation"
  }, {
    name: "Layout Transformations",
    subtitle: "Reimagine your floor plan"
  }, {
    name: "Home Extensions",
    subtitle: "Walls, beams & foundations"
  }, {
    name: "Outdoor Living",
    subtitle: "Extend your living space"
  }];
  return <section ref={ref} className="py-10 md:py-12 lg:py-16 bg-primary relative overflow-hidden z-10">
      {/* Animated background particles */}
      <motion.div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 rounded-full bg-white/5 blur-3xl" animate={{
      scale: [1, 1.2, 1],
      opacity: [0.05, 0.08, 0.05]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }} />
      <motion.div className="absolute bottom-1/4 right-1/4 w-24 md:w-48 h-24 md:h-48 rounded-full bg-white/5 blur-3xl" animate={{
      scale: [1.2, 1, 1.2],
      opacity: [0.08, 0.05, 0.08]
    }} transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }} />

      <div className="container-wide relative z-10 px-5 md:px-8">
        {/* Centered header content */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.p 
            className="text-label text-primary-foreground/60 mb-3 md:mb-4 text-xs md:text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Gold Coast
          </motion.p>
          <motion.h2 
            className="text-primary-foreground font-serif italic text-lg sm:text-xl md:text-3xl leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Gold Coast Renovators, Built For Homeowners Who Value Daily Living
          </motion.h2>
        </motion.div>

        {/* We renovate label - on its own line */}
        <motion.span className="text-primary-foreground/60 text-xs md:text-sm block mb-4 md:mb-6" initial={{
        opacity: 0,
        y: 10
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-50px"
      }} transition={{
        duration: 0.5,
        delay: 0.3
      }}>
          We renovate:
        </motion.span>

        {/* Services - 2 per row on mobile, 3 on desktop */}
        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-4 md:gap-y-6 mb-8 md:mb-12" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-50px"
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          {services.map((service, index) => <motion.div key={index} className="flex flex-col cursor-pointer" initial={{
          opacity: 0,
          y: 10
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.4,
          delay: 0.4 + index * 0.08
        }} whileHover={{
          scale: 1.05,
          y: -2
        }}>
              <span className="text-primary-foreground font-serif text-sm md:text-lg">{service.name}</span>
              <span className="text-primary-foreground/50 text-[10px] md:text-xs uppercase tracking-wider">{service.subtitle}</span>
            </motion.div>)}
        </motion.div>

        {/* Divider */}
        <motion.div className="h-px bg-primary-foreground/20 mb-8 md:mb-12" initial={{
        scaleX: 0
      }} whileInView={{
        scaleX: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} />

        {/* Invitation / CTA Section - Centered */}
        <div className="flex flex-col items-center text-center">
          {/* Left: Invitation content - now centered */}
          <motion.p className="text-label text-primary-foreground/60 mb-4 md:mb-6 text-xs md:text-sm" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.5
        }}>
            Invitation
          </motion.p>
          
          <motion.h2 className="text-primary-foreground font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] mb-6 md:mb-8" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }}>
            See What Your Home Could Become
          </motion.h2>

          <motion.div initial={{
          opacity: 0,
          y: 10
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} whileTap={{
          scale: 0.98
        }} className="mb-6 md:mb-8">
            <Link to="/book-renovation-consultation">
              <Button variant="hero" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Request Your Renovation Consultation
              </Button>
            </Link>
          </motion.div>

          <motion.p className="text-primary-foreground/70 text-sm md:text-base leading-relaxed font-serif italic" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }}>
            Free on-site advice. Clear scope. No obligation.
          </motion.p>
        </div>
      </div>
    </section>;
};
export default CostsSection;
