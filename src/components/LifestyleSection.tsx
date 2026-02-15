import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";

const LifestyleSection = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Start with center image active
  const sectionRef = useRef<HTMLDivElement>(null);
  const { assets, ready } = useSiteAssets();
  const shouldLoadImages = useInView(sectionRef, { margin: "200px 0px", once: true });

  // Track scroll progress for parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Subtle parallax: header moves slower, panels move slightly faster
  const headerY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const panelsY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const quoteY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const benefits = [
    {
      number: "01",
      title: "Smoother mornings",
      description: "It is the morning that runs smoother because the kitchen supports your routine.",
      color: "hsl(var(--primary))",
      image: assets["lifestyle-morning"],
    },
    {
      number: "02",
      title: "Less clutter",
      description: "It is less clutter because storage is planned properly.",
      color: "hsl(var(--primary) / 0.85)",
      image: assets["lifestyle-storage"],
    },
    {
      number: "03",
      title: "Easier movement",
      description: "It is easier movement through the home, especially when carrying things, hosting, or tired at night.",
      color: "hsl(var(--primary) / 0.7)",
      image: assets["lifestyle-movement"],
    },
    {
      number: "04",
      title: "Safer bathrooms",
      description: "It is a bathroom that feels safer and more comfortable, not just newer.",
      color: "hsl(var(--primary) / 0.55)",
      image: assets["lifestyle-bathroom"],
    },
    {
      number: "05",
      title: "Calmer spaces",
      description: "It is light, privacy, and layout that make the home feel calmer.",
      color: "hsl(var(--primary) / 0.4)",
      image: assets["lifestyle-calm"],
    },
  ];

  return (
    <section ref={sectionRef} className="border-t border-foreground/10 relative z-20 bg-background overflow-hidden" id="approach">
      {/* Header section with parallax */}
      <motion.div style={{ y: headerY }} className="py-12 md:py-20 container-wide px-5 md:px-8">
        <div className="max-w-3xl">
          <p className="text-label text-foreground/60 mb-4 md:mb-6 text-xs md:text-sm">
            Our Approach
          </p>
          <h2 className="text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-2 md:mb-3">
            Lifestyle enhancement, through renovation
          </h2>
          <p className="text-foreground/70 text-base md:text-xl leading-relaxed">
            Lifestyle enhancement is the quiet improvement you feel every day.
          </p>
        </div>
      </motion.div>

      {/* Mobile only: Horizontal scroll cards */}
      <div className="md:hidden -mx-5 px-5 pb-8 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative w-[260px] h-48 flex-shrink-0 rounded-lg overflow-hidden"
            >
              {shouldLoadImages && benefit.image ? (
                <ResponsiveImage
                  src={benefit.image}
                  alt={`${benefit.title} renovation lifestyle improvement`}
                  width={1200}
                  height={800}
                  sizes="260px"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover bg-muted"
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-background text-sm font-medium italic mb-1">
                  {benefit.title}
                </h3>
                <p className="text-background/80 text-xs leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tablet + Desktop: Expandable panels with parallax */}
      <motion.div style={{ y: panelsY }} className="hidden md:flex h-[400px] lg:h-[546px] overflow-hidden">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`relative overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
              activeIndex === index ? "flex-[3]" : "flex-[0.6]"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {/* Background image - only set when URL is ready */}
            {shouldLoadImages && benefit.image ? (
              <ResponsiveImage
                src={benefit.image}
                alt={`${benefit.title} renovation lifestyle improvement`}
                width={1200}
                height={800}
                sizes={`${activeIndex === index ? "48vw" : "12vw"}`}
                loading={index === activeIndex ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover bg-muted transition-transform duration-700"
                style={{
                  transform: activeIndex === index ? "scale(1)" : "scale(1.1)",
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            {/* Dark overlay for collapsed panels */}
            <div 
              className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${
                activeIndex === index ? "opacity-0" : "opacity-100"
              }`}
            />
            {/* Gradient overlay for text readability on expanded panel */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Vertical title - shown when collapsed */}
            <div 
              className={`absolute bottom-5 left-5 transition-opacity duration-300 z-10 ${
                activeIndex === index ? "opacity-0" : "opacity-100"
              }`}
            >
              <span 
                className="text-background text-xs font-medium uppercase tracking-[0.15em] whitespace-nowrap drop-shadow-md"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {benefit.title}
              </span>
            </div>

            {/* Content - shown when expanded */}
            <div 
              className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 transition-all duration-500 z-10 ${
                activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h3 className="text-background text-lg md:text-xl font-medium mb-3 drop-shadow-md">
                {benefit.title}
              </h3>
              <p className="text-background/90 text-sm md:text-base leading-relaxed max-w-sm drop-shadow-sm">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quote with parallax */}
      <motion.div style={{ y: quoteY }} className="py-12 md:py-28 container-wide px-5 md:px-8 flex justify-center">
        <p className="text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic leading-relaxed max-w-3xl text-center">
          "When it is done well, you stop noticing the house and simply enjoy living in it."
        </p>
      </motion.div>
    </section>
  );
};

export default LifestyleSection;
