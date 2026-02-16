import { useState, useRef, useCallback, useEffect } from "react";
import ResponsiveImage from "@/components/ResponsiveImage";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const ImageComparisonSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: ImageComparisonSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Global mouse/touch listeners for smooth dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      updatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.touches[0].clientX);
    };

    const handleUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [updatePosition]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    updatePosition(clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg cursor-ew-resize select-none bg-muted/20"
      style={{
        aspectRatio: "4 / 3",
      }}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      {/* Before Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ResponsiveImage
          src={beforeImage}
          alt={`${beforeLabel} room image for renovation comparison`}
          width={1200}
          height={900}
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 44vw, 560px"
          loading="lazy"
          decoding="async"
          quality={58}
          responsiveWidths={[320, 480, 640, 800, 960]}
          className="w-full h-full object-contain"
        />
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <ResponsiveImage
          src={afterImage}
          alt={`${afterLabel} room image for renovation comparison`}
          width={1200}
          height={900}
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 44vw, 560px"
          loading="lazy"
          decoding="async"
          quality={58}
          responsiveWidths={[320, 480, 640, 800, 960]}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-primary rounded-full shadow-md flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8L2 5.5M2 5.5L5 3M2 5.5H7M11 8L14 10.5M14 10.5L11 13M14 10.5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs uppercase tracking-wider px-2 py-1 rounded">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs uppercase tracking-wider px-2 py-1 rounded">
        {afterLabel}
      </div>
    </div>
  );
};

export default ImageComparisonSlider;
