import { useResolvedAsset } from "@/hooks/useSiteAssets";
import ResponsiveImage from "@/components/ResponsiveImage";

interface HeroProps {
  preloaderComplete?: boolean;
}

const revealClass = (preloaderComplete: boolean) =>
  preloaderComplete
    ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
    : "opacity-0 translate-y-4";

const Hero = ({ preloaderComplete = true }: HeroProps) => {
  const heroImage = useResolvedAsset("hero-bg", { staticFirst: true });
  const revealed = revealClass(preloaderComplete);

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

            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
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
            </div>
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

              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
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
              </div>
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
                loading="lazy"
                decoding="async"
                fetchPriority="low"
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
