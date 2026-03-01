import Image from "next/image";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";

const revealed = "opacity-100 translate-y-0 transition-all duration-700 ease-out";
const HERO_IMAGE = "/home/hero-unified.webp";

const Hero = () => {
  return (
    <section className="min-h-screen relative z-20 overflow-hidden bg-background">
      <p className="sr-only">Gold Coast renovations by Concept Design Construct.</p>

      {/* Mobile layout - stacked (phones only) */}
      <div className="md:hidden min-h-screen flex flex-col pt-20">
        <div className="h-[40vh] relative">
          <Image
            src={HERO_IMAGE}
            alt="Gold Coast kitchen renovation in Helensvale by Concept Design Construct"
            fill
            className="absolute inset-0 w-full h-full object-cover bg-muted"
            sizes="100vw"
            priority
            fetchPriority="high"
            quality={60}
          />
        </div>

        <div className={`flex-1 flex items-center px-5 py-8 ${revealed}`}>
          <div className="w-full">
            <h1 className="text-primary mb-4 text-2xl sm:text-3xl leading-[1.15] font-serif">
              Gold Coast Renovations - Locally Trusted.
            </h1>

            <p className="text-base sm:text-lg text-primary leading-relaxed mb-4">
              Clear communication, realistic timelines, and quality results.
            </p>

            <p className="text-sm text-body-text leading-relaxed mb-5">
              We reshape homes and apartments — kitchens, bathrooms, and whole-home layouts — designed around your
              vision, lifestyle, and how you actually live. From first consultation to handover, our Gold Coast team
              provides transparent quotes, honest timeframes, and trusted trades who care about the result.
            </p>

            <p className="text-primary/80 font-serif italic text-sm mb-6">
              A smooth renovation journey. A better-working home. Hassle-free.
            </p>

            <GoogleReviewBadge
              iconSize="w-7 h-7"
              starSize="w-3.5 h-3.5"
              labelSize="text-xs"
              starGap="gap-0.5"
            />

            <a
              href="/book-renovation-consultation"
              className="bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity inline-block mt-6"
            >
              Book Your Free Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Tablet + Desktop layout */}
      <div className="hidden md:flex h-screen items-center">
        <div className="container-wide grid grid-cols-2 items-center gap-12 lg:gap-20">
          <div className={revealed}>
            <div className="max-w-xl">
              <p className="text-primary mb-5 text-[2.5rem] lg:text-[2.8rem] leading-[1.15] font-serif">
                Gold Coast Renovations - Locally Trusted.
              </p>

              <p className="text-lg text-primary leading-relaxed mb-5">
                Clear communication, realistic timelines, and quality results.
              </p>

              <p className="text-base text-body-text leading-relaxed mb-6">
                We reshape homes and apartments — kitchens, bathrooms, and whole-home layouts — designed around your
                vision, lifestyle, and how you actually live. From first consultation to handover, our Gold Coast team
                provides transparent quotes, honest timeframes, and trusted trades who care about the result.
              </p>

              <p className="text-primary/80 font-serif italic text-base mb-8">
                A smooth renovation journey. A better-working home. Hassle-free.
              </p>

              <GoogleReviewBadge iconSize="w-8 h-8" starSize="w-4 h-4" labelSize="text-sm" />

              <a
                href="/book-renovation-consultation"
                className="bg-primary text-primary-foreground mt-8 px-8 py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity inline-block"
              >
                Book Your Free Consultation
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src={HERO_IMAGE}
              alt="Gold Coast home renovation interior by Concept Design Construct"
              className="w-full max-w-[600px] h-[65vh] max-h-[680px] object-cover bg-muted"
              width={1200}
              height={800}
              sizes="(min-width: 768px) 50vw, 100vw"
              loading="lazy"
              fetchPriority="low"
              quality={60}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
