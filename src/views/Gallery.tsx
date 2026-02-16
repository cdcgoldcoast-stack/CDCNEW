import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { resolveImageUrl } from "@/lib/gallery-assets";
import BottomInvitation from "@/components/BottomInvitation";
import ResponsiveImage from "@/components/ResponsiveImage";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

const normalizeAltText = (value: string) => value.trim().replace(/\s+/g, " ");

const hasDescriptiveAltText = (value: string) => {
  const normalized = normalizeAltText(value).toLowerCase();
  if (!normalized || normalized === "gallery image") return false;
  return normalized.split(" ").length >= 3;
};

const Gallery = () => {
  // Fetch gallery items from database
  const { data: dbItems, isLoading, isError } = useQuery({
    queryKey: ["gallery-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Convert database items to gallery format without fallback imagery.
  const galleryItems: GalleryItem[] = (dbItems || [])
    .filter((item) => item.type === "image")
    .map((item, index) => {
      const src = resolveImageUrl(item.image_url);
      if (!src) return null;

      const rawAlt = normalizeAltText(item.alt_text || "");
      const alt = hasDescriptiveAltText(rawAlt)
        ? rawAlt
        : `Gold Coast renovation gallery image ${index + 1} with service and finish inspiration`;

      return {
        id: item.id,
        src,
        alt,
      };
    })
    .filter((item): item is GalleryItem => item !== null);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gallery | Gold Coast Home Renovation Inspiration"
        description="Get inspired by our Gold Coast renovation gallery. Browse beautiful kitchen, bathroom, and living space transformations by Concept Design Construct."
        url="/project-gallery"
      />
      <Header />
      
      {/* Main content */}
      <main className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container-wide">
          {/* Title */}
          <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
              Gold Coast Renovation Gallery
            </h1>
            <p className="text-foreground/70 text-lg md:text-xl leading-relaxed mb-3">
              Inspiration for your next renovation.
            </p>
            <p className="text-foreground/50 text-sm md:text-base">
              Browse our collection of completed projects across the Gold Coast.
            </p>
          </div>

          {/* Simple Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 max-w-[1600px] mx-auto animate-pulse">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="relative overflow-hidden aspect-[1/1.2] sm:aspect-[1/1.5] bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/30" />
                </div>
              ))}
            </div>
          ) : isError && galleryItems.length === 0 ? (
            <div className="max-w-[900px] mx-auto rounded-sm border border-foreground/15 bg-background/70 p-8 text-center">
              <h2 className="font-serif italic text-2xl text-primary mb-3">Gallery unavailable right now</h2>
              <p className="text-foreground/70">
                We could not load the project gallery. Please try again shortly.
              </p>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="max-w-[900px] mx-auto rounded-sm border border-foreground/15 bg-background/70 p-8 text-center">
              <h2 className="font-serif italic text-2xl text-primary mb-3">No gallery images published</h2>
              <p className="text-foreground/70">
                Add active images in admin to display them on this page.
              </p>
            </div>
          ) : (
            <>
              <h2 className="sr-only">Gold Coast renovation project gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 max-w-[1600px] mx-auto">
              {galleryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative overflow-hidden aspect-[1/1.2] sm:aspect-[1/1.5]"
                >
                  <ResponsiveImage
                    src={item.src}
                    alt={item.alt}
                    width={800}
                    height={1200}
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    quality={60}
                    responsiveWidths={[320, 480, 640, 800, 960]}
                  />
                  
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
                </div>
              ))}
              </div>
            </>
          )}

          <BottomInvitation
            title="Like what you see?"
            description="Let's talk about bringing your vision to life."
            className="mt-16 md:mt-24 mb-0"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
