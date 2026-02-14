import { useState, useRef, useCallback, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
  const [containerAspectRatio, setContainerAspectRatio] = useState<number | null>(null);
  const [orientationMismatch, setOrientationMismatch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!beforeImage || !afterImage) return;

    const beforeImg = new Image();
    const afterImg = new Image();

    let beforeLoaded = false;
    let afterLoaded = false;
    let beforeDimensions = { width: 0, height: 0 };
    let afterDimensions = { width: 0, height: 0 };

    const checkMismatch = () => {
      if (!beforeLoaded || !afterLoaded) return;
      const beforeIsPortrait = beforeDimensions.height > beforeDimensions.width;
      const afterIsPortrait = afterDimensions.height > afterDimensions.width;
      const mismatch = beforeIsPortrait !== afterIsPortrait;
      setOrientationMismatch(mismatch);
    };

    beforeImg.onload = () => {
      beforeDimensions = { width: beforeImg.naturalWidth, height: beforeImg.naturalHeight };
      setContainerAspectRatio(beforeImg.naturalWidth / beforeImg.naturalHeight);
      beforeLoaded = true;
      checkMismatch();
    };

    afterImg.onload = () => {
      afterDimensions = { width: afterImg.naturalWidth, height: afterImg.naturalHeight };
      afterLoaded = true;
      checkMismatch();
    };

    beforeImg.src = beforeImage;
    afterImg.src = afterImage;
  }, [beforeImage, afterImage]);

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
        aspectRatio: containerAspectRatio ? containerAspectRatio : undefined,
      }}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      {/* Before Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={beforeImage}
          alt={beforeLabel}
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          draggable={false}
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

      {/* Orientation Mismatch Warning */}
      {orientationMismatch && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Orientation mismatch</span>
        </div>
      )}
    </div>
  );
};

export default ImageComparisonSlider;
