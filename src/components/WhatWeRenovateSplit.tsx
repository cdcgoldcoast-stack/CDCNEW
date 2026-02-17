import { motion } from "framer-motion";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";

const sectionImageQuality = 56;
const sectionBgWidths = [320, 480, 640, 800, 960] as const;
const sectionCardWidths = [240, 360, 480, 640, 800] as const;

const WhatWeRenovateSplit = () => {
  const { assets } = useSiteAssets();

  const services = [
    {
      title: "Whole Home Renovations",
      description: "Improve layout, light, storage, and flow so the home feels easier to live in. We take a holistic approach to reshape how your entire space functions. From the moment you walk through the door, every element works together to support your daily routines.",
      tags: ["Layout", "Flow"],
      bgImage: assets["service-bg-whole-home"],
      image: assets["service-whole-home"],
    },
    {
      title: "Bathroom Renovations",
      description: "Comfort, safety, and calm, with practical choices that improve daily use. A space designed for both relaxation and efficiency. We balance beautiful materials with functional layouts that make your morning and evening routines feel effortless.",
      tags: ["Comfort", "Safety"],
      bgImage: assets["service-bg-bathroom"],
      image: assets["service-bathroom"],
    },
    {
      title: "Kitchen Renovations",
      description: "Better movement, smarter storage, and a kitchen that supports real routines. From meal prep to morning coffee, every detail is considered. We create kitchens that become the heart of your home, where cooking and gathering happen effortlessly.",
      tags: ["Storage", "Function"],
      bgImage: assets["service-bg-kitchen"],
      image: assets["service-kitchen"],
    },
    {
      title: "Connected Spaces",
      description: "Laundry, living zones, and the spaces you use most, improved without unnecessary scope. Thoughtful upgrades that make everyday life smoother. We focus on the transitions between rooms, creating flow and harmony throughout your home.",
      tags: ["Laundry", "Living"],
      bgImage: assets["service-bg-living"],
      image: assets["service-living"],
    },
    {
      title: "Home Extensions",
      description: "Add the space your family needs without leaving the location you love. Whether it's an extra bedroom, expanded living area, or a new wing entirely, we design extensions that blend seamlessly with your existing home while maximizing natural light and flow.",
      tags: ["Space", "Growth"],
      bgImage: assets["service-bg-extensions"],
      image: assets["service-extensions"],
    },
  ];

  return (
    <section className="bg-background relative z-10" id="services">
      {services.map((service, index) => (
        <ServiceSection
          key={service.title}
          service={service}
          index={index}
          isReversed={index % 2 === 1}
          totalServices={services.length}
          isLast={index === services.length - 1}
        />
      ))}
    </section>
  );
};

interface ServiceSectionProps {
  service: {
    title: string;
    description: string;
    tags: string[];
    bgImage: string | null;
    image: string | null;
  };
  index: number;
  isReversed: boolean;
  totalServices: number;
  isLast: boolean;
}

const ServiceSection = ({ service, index, isReversed, totalServices, isLast }: ServiceSectionProps) => {
  return (
    <div
      className={`relative flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} min-h-[85vh] md:min-h-screen md:h-screen ${!isLast ? "md:sticky md:top-0" : ""} bg-background`}
      style={{ zIndex: index + 1 }}
    >
      {/* Image panel */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-full">
        {service.bgImage ? (
          <ResponsiveImage
            src={service.bgImage}
            alt={`${service.title} background example`}
            width={1200}
            height={900}
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            quality={sectionImageQuality}
            responsiveWidths={sectionBgWidths}
            className="absolute inset-0 w-full h-full object-cover bg-muted"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Smaller overlaid image */}
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
          <motion.div
            className="w-[55%] sm:w-[48%] md:w-[40%] lg:w-[44%] shadow-2xl overflow-hidden cursor-pointer bg-muted"
            style={{ aspectRatio: "3/4" }}
            whileHover={{ scale: 1.03 }}
          >
            {service.image && (
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ResponsiveImage
                  src={service.image}
                  alt={`${service.title} project example`}
                  width={800}
                  height={1200}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 48vw, 55vw"
                  loading="lazy"
                  quality={sectionImageQuality}
                  responsiveWidths={sectionCardWidths}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Vertical dots indicator - hidden on mobile, visible on tablet+ */}
        <div
          className={`hidden md:flex absolute ${isReversed ? "right-6" : "left-6"} top-1/2 -translate-y-1/2 flex-col gap-3 z-20`}
        >
          {Array.from({ length: totalServices }).map((_, dotIndex) => (
            <div
              key={dotIndex}
              className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                dotIndex === index ? "bg-white border-white" : "bg-transparent border-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Text content panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-16 xl:p-20 bg-background">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Label */}
          <p className="text-label text-primary mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm">
            Our Gold Coast Renovation Services
          </p>

          {/* Title */}
          <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight mb-4 md:mb-6">
            {service.title}
          </h2>

          {/* Description */}
          <p className="text-foreground/70 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
            {service.description}
          </p>

          {/* Tags */}
          <div className="flex gap-2 md:gap-3">
            {service.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="text-[10px] md:text-xs uppercase tracking-[0.1em] text-foreground/60 border border-foreground/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhatWeRenovateSplit;
