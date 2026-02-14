import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useResolvedAsset } from "@/hooks/useSiteAssets";

interface HeroProps {
  preloaderComplete?: boolean;
}

const Hero = ({ preloaderComplete = true }: HeroProps) => {
  const ref = useRef<HTMLElement>(null);
  const heroImage = useResolvedAsset("hero-bg", { allowFallbackWhileLoading: true });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Animation variants that wait for preloader
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut" as const,
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const }
    }
  };

  const heroAlt = "Gold Coast home renovation interior";
  
  return (
    <section 
      ref={ref} 
      className="min-h-screen relative z-20 overflow-hidden bg-background"
    >
      {heroImage && (
        <Helmet>
          <link rel="preload" as="image" href={heroImage} />
        </Helmet>
      )}
      {/* Mobile layout - stacked (phones only) */}
      <div className="md:hidden min-h-screen flex flex-col pt-20">
        {/* Mobile hero image - top */}
        <motion.div 
          className="h-[40vh] relative"
          style={{ y: imageY }}
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt={heroAlt}
              className="absolute inset-0 w-full h-full object-cover bg-muted"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </motion.div>
        
        {/* Mobile text content */}
        <motion.div
          className="flex-1 flex items-center px-5 py-8"
          initial="hidden"
          animate={preloaderComplete ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="w-full">
            <motion.h1
              className="text-primary mb-4 text-2xl sm:text-3xl leading-[1.15] font-serif"
              variants={itemVariants}
            >
              Gold Coast Renovations — Locally Trusted.
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-primary leading-relaxed mb-4"
              variants={itemVariants}
            >
              Clear communication, realistic timelines, and quality results.
            </motion.p>

            <motion.p
              className="text-sm text-foreground/70 leading-relaxed mb-4"
              variants={itemVariants}
            >
              We reshape entire homes and apartments — including kitchens and bathrooms — designed around your vision, lifestyle, and the way you live.
            </motion.p>

            <motion.p
              className="text-sm text-foreground/70 leading-relaxed mb-5"
              variants={itemVariants}
            >
              Our experienced Gold Coast team partners with you from first consultation to handover, providing transparent quotes, honest timeframes, and trusted trades who care about the end result.
            </motion.p>

            <motion.p
              className="text-primary/80 font-serif italic text-sm mb-6"
              variants={itemVariants}
            >
              A smooth renovation journey. A better-working home. Hassle-free.
            </motion.p>

            {/* Google Reviews Badge */}
            <motion.div
              className="flex items-center gap-3"
              variants={itemVariants}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>

              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground/80">Google Reviews</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-foreground/60 ml-1">4.9</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Tablet + Desktop layout */}
      <div className="hidden md:flex h-screen items-center">
        <div className="container-wide grid grid-cols-2 items-center gap-12 lg:gap-20">
          <motion.div
            style={{ y: textY, opacity }}
            initial="hidden"
            animate={preloaderComplete ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <div className="max-w-xl">
              <motion.h1
                className="text-primary mb-5 text-[2.5rem] lg:text-[2.8rem] leading-[1.15] font-serif"
                variants={itemVariants}
              >
                Gold Coast Renovations — Locally Trusted.
              </motion.h1>

              <motion.p
                className="text-lg text-primary leading-relaxed mb-5"
                variants={itemVariants}
              >
                Clear communication, realistic timelines, and quality results.
              </motion.p>

              <motion.p
                className="text-base text-foreground/70 leading-relaxed mb-4"
                variants={itemVariants}
              >
                We reshape entire homes and apartments — including kitchens and bathrooms — designed around your vision, lifestyle, and the way you live.
              </motion.p>

              <motion.p
                className="text-base text-foreground/70 leading-relaxed mb-6"
                variants={itemVariants}
              >
                Our experienced Gold Coast team partners with you from first consultation to handover, providing transparent quotes, honest timeframes, and trusted trades who care about the end result.
              </motion.p>

              <motion.p
                className="text-primary/80 font-serif italic text-base mb-8"
                variants={itemVariants}
              >
                A smooth renovation journey. A better-working home. Hassle-free.
              </motion.p>

              {/* Google Reviews Badge */}
              <motion.div
                className="flex items-center gap-3"
                variants={itemVariants}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground/80">Google Reviews</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-foreground/60 ml-1">4.9</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            style={{ y: imageY }}
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt={heroAlt}
                className="w-full max-w-[600px] h-[65vh] max-h-[680px] object-cover bg-muted"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="w-full max-w-[600px] h-[65vh] max-h-[680px] bg-muted" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
