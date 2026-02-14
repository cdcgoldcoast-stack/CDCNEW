import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";

interface ImageSliderProps {
  images: string[];
  projectName: string;
}

const ImageSlider = ({ images, projectName }: ImageSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPosRef = useRef(0);

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const speed = 0.8; // pixels per frame

    const animate = () => {
      if (!isPaused) {
        scrollPosRef.current += speed;

        // Reset when we've scrolled through one set of images
        const singleSetWidth = scrollContainer.scrollWidth / 3;
        if (scrollPosRef.current >= singleSetWidth) {
          scrollPosRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollPosRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-foreground/5">
      {/* Sliding images container */}
      <div
        ref={scrollRef}
        className="flex h-full overflow-x-hidden scrollbar-hide"
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="flex-shrink-0 h-full w-[80vw] md:w-[50vw] lg:w-[35vw]"
          >
            <ResponsiveImage
              src={image}
              alt={`${projectName} ${(index % images.length) + 1}`}
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 35vw, (min-width: 768px) 50vw, 80vw"
              className="w-full h-full object-cover"
              loading={index < 2 ? "eager" : "lazy"}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Pause/Play button */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-foreground ml-0.5" />
          ) : (
            <Pause className="w-5 h-5 text-foreground" />
          )}
        </button>
        <span className="text-sm text-white/80 drop-shadow-md hidden md:block">
          Press button or 'Space' to {isPaused ? "play" : "pause"}
        </span>
      </div>
    </div>
  );
};

export default ImageSlider;
