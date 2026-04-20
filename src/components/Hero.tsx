import Image from "next/image";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";

const revealed = "opacity-100 translate-y-0 transition-all duration-700 ease-out";
const HERO_IMAGE = "/home/hero-v2.webp";

const Hero = () => {
  return (
    <section className="min-h-screen relative z-20 overflow-hidden bg-background">
      {/*
        Single layout container:
        - Mobile:  flex-col, pt-20, image top (40vh) + text bottom (fills rest)
        - Desktop: grid 2-col, h-screen, text left + image right (contained)
      */}
      <div className="min-h-screen flex flex-col pt-20 md:pt-0 md:grid md:grid-cols-2 md:h-screen md:items-center md:gap-12 lg:gap-20 md:max-w-7xl md:mx-auto md:px-12">

        {/* Image — stacked full-bleed on mobile, contained on desktop */}
        <div className="flex-shrink-0 md:order-2 md:flex md:items-center md:justify-center">
          <Image
            src={HERO_IMAGE}
            alt="Gold Coast kitchen renovation in Helensvale by Concept Design Construct"
            width={1200}
            height={800}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            fetchPriority="high"
            quality={60}
            className="block w-full h-[40vh] md:h-[65vh] md:max-h-[680px] md:max-w-[600px] object-cover object-[70%_center] bg-muted"
          />
        </div>

        {/* Text content — single instance, always visible, never inside a hidden container */}
        <div className={`flex-1 flex items-center md:order-1 ${revealed}`}>
          <div className="max-w-xl px-5 py-8 md:px-0 md:py-0">
            <h1 className="text-primary mb-4 md:mb-5 text-2xl sm:text-3xl md:text-[2.5rem] lg:text-[2.8rem] leading-[1.15] font-serif">
              Gold Coast Renovations - Locally Trusted.
            </h1>

            <p className="text-base sm:text-lg md:text-lg text-primary leading-relaxed mb-4 md:mb-5">
              Kitchen renovations from 2 weeks. Bathroom renovations from 4 weeks. Fixed-price quotes, no surprises.
            </p>

            <p className="text-sm md:text-base text-body-text leading-relaxed mb-5 md:mb-6">
              We reshape homes and apartments — kitchens, bathrooms, and whole-home layouts — designed around your
              vision, lifestyle, and how you actually live. From first consultation to handover, our Gold Coast team
              provides transparent quotes, honest timeframes, and trusted trades who care about the result.
            </p>

            <p className="text-primary/80 font-serif italic text-sm md:text-base mb-6 md:mb-8">
              A smooth renovation journey. A better-working home. Hassle-free.
            </p>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] md:text-xs uppercase tracking-widest text-foreground/60">
                QBCC Lic. 15155156 &middot; Building since 2000 &middot; 25+ years on the Gold Coast
              </p>
              <GoogleReviewBadge
                iconSize="w-7 h-7 md:w-8 md:h-8"
                starSize="w-3.5 h-3.5 md:w-4 md:h-4"
                labelSize="text-xs md:text-sm"
                starGap="gap-0.5 md:gap-1"
              />
            </div>

            <a
              href="/book-renovation-consultation"
              className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity inline-block mt-6 md:mt-8"
            >
              Book Your Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
