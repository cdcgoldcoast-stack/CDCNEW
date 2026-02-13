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
  const [isDragging, setIsDragging] = useState(false);
  const [containerAspectRatio, setContainerAspectRatio] = useState<number | null>(null);
  const [orientationMismatch, setOrientationMismatch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the BEFORE image to determine the aspect ratio (source of truth) and detect mismatches
  useEffect(() => {
    if (!beforeImage || !afterImage) return;
    
    // Load both images to compare orientations
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
      
      // Detect orientation mismatch (portrait vs landscape)
      const mismatch = beforeIsPortrait !== afterIsPortrait;
      setOrientationMismatch(mismatch);
      
      if (mismatch) {
        console.warn("Image orientation mismatch detected in slider:", {
          before: beforeIsPortrait ? 'portrait' : 'landscape',
          after: afterIsPortrait ? 'portrait' : 'landscape',
          beforeDimensions,
          afterDimensions
        });
      }
    };
    
    beforeImg.onload = () => {
      beforeDimensions = { width: beforeImg.naturalWidth, height: beforeImg.naturalHeight };
      const aspectRatio = beforeImg.naturalWidth / beforeImg.naturalHeight;
      setContainerAspectRatio(aspectRatio);
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

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  // Calculate max height based on viewport
  const maxHeight = "70vh";

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg cursor-ew-resize select-none bg-muted/20"
      style={{
        // Use aspect-ratio to maintain the before image's proportions
        aspectRatio: containerAspectRatio ? containerAspectRatio : undefined,
        maxHeight: maxHeight,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      {/* Before Image (defines the container size - source of truth) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* After Image (Clipped overlay - must match before image positioning) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* Slider Handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize"
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-foreground/70"
          >
            <path
              d="M6 10L3 7M3 7L6 4M3 7H8M14 10L17 13M17 13L14 16M17 13H12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
