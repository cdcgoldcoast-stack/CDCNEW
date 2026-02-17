import { useResolvedAsset } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";

const revealed = "opacity-100 translate-y-0 transition-all duration-700 ease-out";

interface HeroProps {
  /** Pre-resolved hero image URL from server to avoid client-side hook waterfall */
  heroImageUrl?: string;
}

const Hero = ({ heroImageUrl }: HeroProps = {}) => {
  const resolvedAsset = useResolvedAsset("hero-bg", { staticFirst: true });
  // Server-provided URL already includes the correct override (fetched server-side).
  // The hook is a fallback for client-side navigation where no server prop is available.
  const heroImage = heroImageUrl || resolvedAsset;

  return (
    <section className="min-h-screen relative z-20 overflow-hidden bg-background">
      <p className="sr-only">Gold Coast renovations by Concept Design Construct.</p>

      {/* Mobile layout - stacked (phones only) */}
      <div className="md:hidden min-h-screen flex flex-col pt-20">
        <div className="h-[40vh] relative">
          {heroImage ? (
            <ResponsiveImage
              src={heroImage}
              alt="Gold Coast kitchen renovation in Helensvale by Concept Design Construct"
              className="absolute inset-0 w-full h-full object-cover bg-muted"
              width={1200}
              height={800}
              sizes="100vw"
              loading="eager"
              decoding="async"
              priority
              quality={54}
              responsiveWidths={[320, 420, 560, 720, 860]}
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>

        <div className={`flex-1 flex items-center px-5 py-8 ${revealed}`}>
          <div className="w-full">
            <h1 className="text-primary mb-4 text-2xl sm:text-3xl leading-[1.15] font-serif">
              Gold Coast Renovations - Locally Trusted.
            </h1>

            <p className="text-base sm:text-lg text-primary leading-relaxed mb-4">
              Clear communication, realistic timelines, and quality results.
            </p>

            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              We reshape entire homes and apartments - including kitchens and bathrooms - designed around your vision,
              lifestyle, and the way you live.
            </p>

            <p className="text-sm text-foreground/70 leading-relaxed mb-5">
              Our experienced Gold Coast team partners with you from first consultation to handover, providing
              transparent quotes, honest timeframes, and trusted trades who care about the end result.
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

              <p className="text-base text-foreground/70 leading-relaxed mb-4">
                We reshape entire homes and apartments - including kitchens and bathrooms - designed around your
                vision, lifestyle, and the way you live.
              </p>

              <p className="text-base text-foreground/70 leading-relaxed mb-6">
                Our experienced Gold Coast team partners with you from first consultation to handover, providing
                transparent quotes, honest timeframes, and trusted trades who care about the end result.
              </p>

              <p className="text-primary/80 font-serif italic text-base mb-8">
                A smooth renovation journey. A better-working home. Hassle-free.
              </p>

              <GoogleReviewBadge iconSize="w-8 h-8" starSize="w-4 h-4" labelSize="text-sm" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            {heroImage ? (
              <ResponsiveImage
                src={heroImage}
                alt="Gold Coast home renovation interior by Concept Design Construct"
                className="w-full max-w-[600px] h-[65vh] max-h-[680px] object-cover bg-muted"
                width={1200}
                height={800}
                sizes="(min-width: 768px) 50vw, 100vw"
                loading="eager"
                decoding="async"
                priority
                quality={60}
                responsiveWidths={[640, 800, 960, 1200]}
              />
            ) : (
              <div className="w-full max-w-[600px] h-[65vh] max-h-[680px] bg-muted" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
