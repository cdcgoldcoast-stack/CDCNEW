import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Cloud, Check, X, Type, Palette, Image as ImageIcon, Search, Lock, Unlock, RotateCcw, LayoutGrid, Download, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import Header from "@/components/Header";
import { useMoodboard } from "@/hooks/useMoodboard";
// Images are now loaded dynamically from API only
import { useImageSearch, ImageResult } from "@/hooks/useImageSearch";
import { useColorExtraction } from "@/hooks/useColorExtraction";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import { useIsMobile } from "@/hooks/use-mobile";
import SEO from "@/components/SEO";
import { FUNCTION_ENDPOINTS } from "@/config/endpoints";
import type { Json } from "@/integrations/supabase/types";

type Step = "layout" | "photos" | "notes" | "download";

type FrameType = "image" | "colors" | "notes";

interface LayoutFrame {
  id: string;
  type: FrameType;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
}

interface Layout {
  id: string;
  label: string;
  description: string;
  imageFrames: number;
  cols: number;
  rows: number;
  grid: LayoutFrame[];
}

// Layout definitions with dedicated frames for colours and notes
const LAYOUTS: Layout[] = [
  {
    id: "minimal",
    label: "Minimal",
    description: "3 photos + colours + notes",
    imageFrames: 3,
    cols: 3,
    rows: 2,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 2 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "classic",
    label: "Classic",
    description: "4 photos + colours + notes",
    imageFrames: 4,
    cols: 3,
    rows: 2,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "4 photos with feature + colours + notes",
    imageFrames: 4,
    cols: 3,
    rows: 3,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 2, rowSpan: 2 },
      { id: "img-2", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 1, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 2, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 3, row: 3, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    description: "6 photos + colours + notes",
    imageFrames: 6,
    cols: 4,
    rows: 2,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-5", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-6", type: "image", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 4, row: 2, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "compact-grid",
    label: "Compact Grid",
    description: "8 photos + colours + notes",
    imageFrames: 8,
    cols: 5,
    rows: 2,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 5, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-5", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-6", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-7", type: "image", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-8", type: "image", col: 4, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 5, row: 2, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "inspiration-grid",
    label: "Inspiration Grid",
    description: "9 photos + colours + notes",
    imageFrames: 9,
    cols: 4,
    rows: 3,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-5", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-6", type: "image", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 4, row: 2, colSpan: 1, rowSpan: 2 },
      { id: "img-7", type: "image", col: 1, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-8", type: "image", col: 2, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-9", type: "image", col: 3, row: 3, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "project-board",
    label: "Project Board",
    description: "10 photos + colours + notes",
    imageFrames: 10,
    cols: 4,
    rows: 3,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-5", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-6", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-7", type: "image", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 4, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-8", type: "image", col: 1, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-9", type: "image", col: 2, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-10", type: "image", col: 3, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 4, row: 3, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "room-collection",
    label: "Room Collection",
    description: "12 photos (3 rows of 4) + colours + notes",
    imageFrames: 12,
    cols: 5,
    rows: 3,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 5, row: 1, colSpan: 1, rowSpan: 2 },
      { id: "img-5", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-6", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-7", type: "image", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-8", type: "image", col: 4, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-9", type: "image", col: 1, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-10", type: "image", col: 2, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-11", type: "image", col: 3, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-12", type: "image", col: 4, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 5, row: 3, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "visual-heavy",
    label: "Visual Heavy",
    description: "11 photos + small notes section",
    imageFrames: 11,
    cols: 4,
    rows: 3,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-5", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-6", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-7", type: "image", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-8", type: "image", col: 4, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-9", type: "image", col: 1, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-10", type: "image", col: 2, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-11", type: "image", col: 3, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "notes", type: "notes", col: 4, row: 3, colSpan: 1, rowSpan: 1 },
    ],
  },
  {
    id: "reference-board",
    label: "Reference Board",
    description: "12 photos + small colour strip",
    imageFrames: 12,
    cols: 4,
    rows: 3,
    grid: [
      { id: "img-1", type: "image", col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-2", type: "image", col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-3", type: "image", col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-4", type: "image", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "img-5", type: "image", col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-6", type: "image", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-7", type: "image", col: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-8", type: "image", col: 4, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "img-9", type: "image", col: 1, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-10", type: "image", col: 2, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-11", type: "image", col: 3, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "img-12", type: "image", col: 4, row: 3, colSpan: 1, rowSpan: 1 },
      { id: "colors", type: "colors", col: 1, row: 4, colSpan: 4, rowSpan: 1 },
    ],
  },
];

const STEPS: { key: Step; label: string }[] = [
  { key: "layout", label: "Pick a layout" },
  { key: "photos", label: "Add photos" },
  { key: "notes", label: "Add notes" },
  { key: "download", label: "Download" },
];

const STEP_TABS: { key: Step; label: string; icon: typeof LayoutGrid }[] = [
  { key: "layout", label: "Layout", icon: LayoutGrid },
  { key: "photos", label: "Photos", icon: ImageIcon },
  { key: "notes", label: "Notes", icon: Type },
  { key: "download", label: "Download", icon: Download },
];



const DEFAULT_COLORS = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
const DEFAULT_LOCKS = [false, false, false, false, false];
const BOARD_BASE_WIDTH = 960;

// Helper to get contrasting text color for hex background
const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
};

interface FrameContent {
  [frameId: string]: {
    imageUrl?: string;
    exportUrl?: string;
    imageAlt?: string;
  };
}

interface SavedMoodboardData {
  layout?: string;
  frameContent?: FrameContent;
  noteText?: string;
  colors?: string[];
  lockedSwatches?: boolean[];
  autoExtractEnabled?: boolean;
}

const MoodboardCreator = () => {
  const [currentStep, setCurrentStep] = useState<Step>("layout");
  const isMobile = useIsMobile();
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [frameContent, setFrameContent] = useState<FrameContent>({});
  const [noteText, setNoteText] = useState("");
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
  const [lockedSwatches, setLockedSwatches] = useState<boolean[]>(DEFAULT_LOCKS);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Preparing your page...");
  const [isExporting, setIsExporting] = useState(false);
  const [autoExtractEnabled, setAutoExtractEnabled] = useState(true);
  const boardRef = useRef<HTMLDivElement>(null);
  const boardViewportRef = useRef<HTMLDivElement>(null);
  const [boardScale, setBoardScale] = useState(1);
  const [desktopZoom, setDesktopZoom] = useState(1);

  const handleZoomIn = useCallback(() => {
    setDesktopZoom((prev) => Math.min(prev + 0.15, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setDesktopZoom((prev) => Math.max(prev - 0.15, 0.4));
  }, []);

  const handleZoomReset = useCallback(() => {
    setDesktopZoom(1);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState(""); // Track the actual searched term
  const [searchPage, setSearchPage] = useState(1);
  const [allSearchResults, setAllSearchResults] = useState<ImageResult[]>([]);
  const { results: searchResults, isLoading: isSearching, search, clearResults } = useImageSearch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isLoading, isSaving, saveMoodboard, loadMoodboard } = useMoodboard();
  const { extractFromImages, isExtracting } = useColorExtraction();

  const scrollToTop = useCallback(() => {
    if (isMobile) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      return;
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isMobile]);

  // Drag and drop state
  const [draggedImage, setDraggedImage] = useState<{ url: string; alt: string; exportUrl?: string } | null>(null);
  const [draggedFromFrame, setDraggedFromFrame] = useState<string | null>(null);
  const [dragOverFrame, setDragOverFrame] = useState<string | null>(null);

  // Accumulate search results for pagination
  useEffect(() => {
    if (searchResults.length > 0) {
      if (searchPage === 1) {
        setAllSearchResults(searchResults);
      } else {
        setAllSearchResults((prev) => [...prev, ...searchResults]);
      }
    }
  }, [searchResults, searchPage]);

  // Load initial images when entering photos step
  const hasLoadedInitialImages = useRef(false);
  useEffect(() => {
    if (currentStep === "photos" && isInitialized && !hasLoadedInitialImages.current) {
      hasLoadedInitialImages.current = true;
      // Load initial images from API
      search("all", "interior design home", 1);
    }
  }, [currentStep, isInitialized, search]);


  // Initialize board (create/load backend record + restore saved layout)
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setLoadingProgress(10);
        setLoadingMessage("Loading your moodboard...");

        const saved = await loadMoodboard();
        if (cancelled) return;

        setLoadingProgress(70);
        setLoadingMessage("Preparing your page...");

        if (saved && typeof saved === "object") {
          const data = saved as SavedMoodboardData;

          if (typeof data.layout === "string") {
            setSelectedLayout(data.layout);
            setCurrentStep("photos");
          }

          if (data.frameContent && typeof data.frameContent === "object" && !Array.isArray(data.frameContent)) {
            setFrameContent(data.frameContent);
          }

          if (typeof data.noteText === "string") {
            setNoteText(data.noteText);
          }

          if (Array.isArray(data.colors) && data.colors.every((color): color is string => typeof color === "string")) {
            setColors(data.colors);
          }

          if (
            Array.isArray(data.lockedSwatches) &&
            data.lockedSwatches.every((lock): lock is boolean => typeof lock === "boolean")
          ) {
            setLockedSwatches(data.lockedSwatches);
          }

          if (typeof data.autoExtractEnabled === "boolean") {
            setAutoExtractEnabled(data.autoExtractEnabled);
          }
        }

        setLoadingProgress(100);
        setLoadingMessage("Ready!");
        setIsInitialized(true);
      } catch {
        setLoadingProgress(100);
        setLoadingMessage("Ready!");
        setIsInitialized(true);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [loadMoodboard]);

  // Auto-save when content changes
  useEffect(() => {
    if (isInitialized && selectedLayout) {
      const data = {
        layout: selectedLayout,
        frameContent,
        noteText,
        colors,
        lockedSwatches,
        autoExtractEnabled,
      };
      saveMoodboard(data as Json);
    }
  }, [frameContent, noteText, colors, lockedSwatches, autoExtractEnabled, selectedLayout, isInitialized, saveMoodboard]);

  // Auto-extract colors when images change
  useEffect(() => {
    if (!isInitialized || !autoExtractEnabled) return;

    const imageUrls = Object.values(frameContent)
      .map((c) => c?.imageUrl)
      .filter((url): url is string => !!url);

    if (imageUrls.length === 0) {
      // Reset unlocked swatches to white when no images
      setColors((prev) => prev.map((c, i) => (lockedSwatches[i] ? c : "#FFFFFF")));
      return;
    }

    const extractColors = async () => {
      const extractedColors = await extractFromImages(imageUrls);

      setColors((prev) => {
        const newColors = [...prev];
        let extractedIndex = 0;

        // Assign extracted colors to unlocked swatches in order
        for (let i = 0; i < 5; i++) {
          if (!lockedSwatches[i]) {
            if (extractedIndex < extractedColors.length) {
              newColors[i] = extractedColors[extractedIndex];
              extractedIndex++;
            } else {
              // No more extracted colors, set to white
              newColors[i] = "#FFFFFF";
            }
          }
        }

        return newColors;
      });
    };

    extractColors();
  }, [frameContent, isInitialized, autoExtractEnabled, lockedSwatches, extractFromImages]);

  const currentLayout = LAYOUTS.find((l) => l.id === selectedLayout);
  const imageFrames = currentLayout?.grid.filter((f) => f.type === "image") || [];
  const filledFrames = Object.keys(frameContent).filter((k) => frameContent[k]?.imageUrl);
  const nextEmptyFrame = imageFrames.find((f) => !frameContent[f.id]?.imageUrl);
  const canAdvanceStep = currentStep !== "layout" || !!selectedLayout;
  const showPrevStep = currentStep !== "layout";
  const showNextStep = currentStep !== "download";
  const boardBaseHeight = currentLayout
    ? Math.round(BOARD_BASE_WIDTH * (currentLayout.rows / currentLayout.cols))
    : Math.round(BOARD_BASE_WIDTH * (2 / 3));
  const boardPaddingClass = isMobile ? "p-4" : "p-2 sm:p-4";
  const gridGapClass = isMobile ? "gap-3" : "gap-2 sm:gap-3";

  useEffect(() => {
    if (!isMobile || !currentLayout) {
      setBoardScale(1);
      return;
    }

    const updateScale = () => {
      const viewport = boardViewportRef.current;
      if (!viewport) return;
      const availableWidth = viewport.clientWidth;
      if (!availableWidth) return;
      const nextScale = Math.min(1, availableWidth / BOARD_BASE_WIDTH);
      setBoardScale((prev) => (Math.abs(prev - nextScale) < 0.001 ? prev : nextScale));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (boardViewportRef.current) {
      observer.observe(boardViewportRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMobile, currentLayout]);

  const handleLoadMore = useCallback(() => {
    const nextPage = searchPage + 1;
    setSearchPage(nextPage);
    // Use active search term or default query
    const queryToUse = activeSearchTerm || "interior design home";
    search("all", queryToUse, nextPage);
  }, [activeSearchTerm, searchPage, search]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      clearResults();
      setAllSearchResults([]);
      setActiveSearchTerm("");
      return;
    }
    // Reset everything for the new search
    setAllSearchResults([]);
    setSearchPage(1);
    setActiveSearchTerm(trimmedQuery);
    clearResults();
    // Scroll to top
    scrollToTop();
    search("all", trimmedQuery, 1);
  }, [searchQuery, search, clearResults, scrollToTop]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setActiveSearchTerm("");
    clearResults();
    setAllSearchResults([]);
    setSearchPage(1);
    // Scroll to top when clearing
    scrollToTop();
    // Reload initial images
    search("all", "interior design home", 1);
  }, [clearResults, search, scrollToTop]);

  const handleSelectLayout = useCallback((layoutId: string) => {
    setSelectedLayout(layoutId);
    setFrameContent({});
  }, []);

  const handleAddPhoto = useCallback(
    (image: { url: string; alt: string; exportUrl?: string }) => {
      if (!nextEmptyFrame) {
        toast.error("All photo frames are filled. Remove a photo first.");
        return;
      }

      setFrameContent((prev) => ({
        ...prev,
        [nextEmptyFrame.id]: {
          imageUrl: image.url,
          exportUrl: image.exportUrl,
          imageAlt: image.alt,
        },
      }));
    },
    [nextEmptyFrame]
  );

  const handleReplacePhoto = useCallback(
    (frameId: string, image: { url: string; alt: string; exportUrl?: string }) => {
      setFrameContent((prev) => ({
        ...prev,
        [frameId]: {
          imageUrl: image.url,
          exportUrl: image.exportUrl,
          imageAlt: image.alt,
        },
      }));
      setSelectedFrame(null);
    },
    []
  );

  const handleRemovePhoto = useCallback((frameId: string) => {
    setFrameContent((prev) => {
      const updated = { ...prev };
      delete updated[frameId];
      return updated;
    });
    setSelectedFrame(null);
  }, []);

  // Drag and drop handlers
  const handleDragStartFromPicker = useCallback(
    (e: React.DragEvent, image: { url: string; alt: string; exportUrl?: string }) => {
    setDraggedImage(image);
    setDraggedFromFrame(null);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", JSON.stringify(image));
    },
    []
  );

  const handleDragStartFromFrame = useCallback((e: React.DragEvent, frameId: string) => {
    const content = frameContent[frameId];
    if (!content?.imageUrl) return;
    
    setDraggedImage({
      url: content.imageUrl,
      exportUrl: content.exportUrl,
      alt: content.imageAlt || "",
    });
    setDraggedFromFrame(frameId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        url: content.imageUrl,
        exportUrl: content.exportUrl,
        alt: content.imageAlt,
        fromFrame: frameId,
      })
    );
  }, [frameContent]);

  const handleDragOver = useCallback((e: React.DragEvent, frameId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedFromFrame ? "move" : "copy";
    setDragOverFrame(frameId);
  }, [draggedFromFrame]);

  const handleDragLeave = useCallback(() => {
    setDragOverFrame(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetFrameId: string) => {
    e.preventDefault();
    setDragOverFrame(null);

    if (!draggedImage) return;

    // If dragging from another frame, swap the images
    if (draggedFromFrame && draggedFromFrame !== targetFrameId) {
      setFrameContent((prev) => {
        const sourceContent = prev[draggedFromFrame];
        const targetContent = prev[targetFrameId];
        
        const updated = { ...prev };
        
        // Move source to target
        if (sourceContent) {
          updated[targetFrameId] = sourceContent;
        }
        
        // Move target to source (swap) or clear source
        if (targetContent?.imageUrl) {
          updated[draggedFromFrame] = targetContent;
        } else {
          delete updated[draggedFromFrame];
        }
        
        return updated;
      });
    } else {
      // Dragging from picker - add or replace
      setFrameContent((prev) => ({
        ...prev,
        [targetFrameId]: {
          imageUrl: draggedImage.url,
          exportUrl: draggedImage.exportUrl,
          imageAlt: draggedImage.alt,
        },
      }));
    }

    setDraggedImage(null);
    setDraggedFromFrame(null);
  }, [draggedImage, draggedFromFrame]);

  const handleDragEnd = useCallback(() => {
    setDraggedImage(null);
    setDraggedFromFrame(null);
    setDragOverFrame(null);
  }, []);

  const handleColorChange = useCallback((index: number, color: string) => {
    setColors((prev) => {
      const updated = [...prev];
      updated[index] = color;
      return updated;
    });
    // Lock the swatch when manually edited
    setLockedSwatches((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  }, []);

  const handleToggleLock = useCallback((index: number) => {
    setLockedSwatches((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  }, []);

  const handleResetPalette = useCallback(() => {
    setColors(DEFAULT_COLORS);
    setLockedSwatches(DEFAULT_LOCKS);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!boardRef.current) return;

    setIsExporting(true);
    try {
      // Export at a consistent base size regardless of device
      const exportWidth = BOARD_BASE_WIDTH;
      const exportHeight = currentLayout
        ? Math.round(exportWidth * (currentLayout.rows / currentLayout.cols))
        : Math.round(exportWidth * (2 / 3));

      // Use high scale for HD export (4x for print-quality output)
      const exportScale = 4;
      
      const canvas = await html2canvas(boardRef.current, {
        scale: exportScale,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: exportWidth,
        height: exportHeight,
        // Keep the same responsive viewport as the export size
        windowWidth: exportWidth,
        windowHeight: exportHeight,
        scrollX: 0,
        scrollY: 0,
        proxy: `${FUNCTION_ENDPOINTS.imageProxy}?url=`,
        imageTimeout: 30000, // Allow more time for high-res images to load
        onclone: (clonedDoc, element) => {
          // Force the cloned board to exact export dimensions to prevent reflow
          element.style.width = `${exportWidth}px`;
          element.style.height = `${exportHeight}px`;
          element.style.maxWidth = "none";
          element.style.maxHeight = "none";
          element.style.aspectRatio = "unset";
          element.style.position = "relative";

          const boardContent = element.querySelector('[data-board-content="true"]') as HTMLElement | null;
          if (boardContent) {
            boardContent.style.position = "relative";
            boardContent.style.inset = "auto";
            boardContent.style.width = `${exportWidth}px`;
            boardContent.style.height = `${exportHeight}px`;
            boardContent.style.maxWidth = "none";
            boardContent.style.maxHeight = "none";
            boardContent.style.transform = "none";
            boardContent.style.aspectRatio = "unset";
          }

          // Inject export-only styles
          const style = clonedDoc.createElement("style");
          style.textContent = `
            [data-export-hide="true"] { display: none !important; }
            input[type="color"] { display: none !important; }
            img { 
              width: 100% !important; 
              height: 100% !important; 
              object-fit: cover !important; 
              object-position: center !important;
              display: block !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          // html2canvas can mis-render object-fit on <img> in some cases.
          // Export-only workaround: render images as background-image on their frame container.
          const images = element.querySelectorAll("img");
          images.forEach((img) => {
            const htmlImg = img as HTMLImageElement;
            const parent = htmlImg.parentElement as HTMLElement | null;
            if (!parent) return;

            const exportUrl = htmlImg.dataset.exportUrl || htmlImg.src;
            parent.style.backgroundImage = `url("${exportUrl}")`;
            parent.style.backgroundSize = "cover";
            parent.style.backgroundPosition = "center";
            parent.style.backgroundRepeat = "no-repeat";

            // Keep layout identical but prevent the <img> from being painted
            htmlImg.style.visibility = "hidden";
          });

          // Replace textareas with styled divs so their content renders reliably.
          const textareas = element.querySelectorAll("textarea");
          textareas.forEach((textarea) => {
            const htmlTextarea = textarea as HTMLTextAreaElement;
            const replacement = clonedDoc.createElement("div");
            const computed = clonedDoc.defaultView?.getComputedStyle(htmlTextarea);
            const rect = htmlTextarea.getBoundingClientRect();

            replacement.textContent = htmlTextarea.value;
            replacement.style.whiteSpace = "pre-wrap";
            replacement.style.wordBreak = "break-word";
            replacement.style.overflow = "hidden";
            replacement.style.background = "transparent";
            replacement.style.display = "block";
            replacement.style.width = `${rect.width}px`;
            replacement.style.height = `${rect.height}px`;

            if (computed) {
              replacement.style.fontFamily = computed.fontFamily;
              replacement.style.fontSize = computed.fontSize;
              replacement.style.fontWeight = computed.fontWeight;
              replacement.style.lineHeight = computed.lineHeight;
              replacement.style.color = computed.color;
              replacement.style.padding = computed.padding;
              replacement.style.margin = computed.margin;
              replacement.style.boxSizing = computed.boxSizing;
              replacement.style.letterSpacing = computed.letterSpacing;
              replacement.style.textTransform = computed.textTransform;
              replacement.style.textAlign = computed.textAlign;
            }

            htmlTextarea.replaceWith(replacement);
          });

          // Ensure color swatch backgrounds are properly rendered
          const colorSwatches = element.querySelectorAll('[data-color-swatch="true"]');
          colorSwatches.forEach((swatch) => {
            const el = swatch as HTMLElement;
            const bgColor = el.getAttribute("data-color");
            if (bgColor) {
              el.style.backgroundColor = bgColor;
              el.style.display = "block";
            }
          });
        },
      });

      // Use blob for maximum quality PNG export (no compression artifacts)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error("Failed to generate image");
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = "moodboard.png";
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        "image/png",
        1.0 // Maximum quality
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to download moodboard");
    }
    setIsExporting(false);
  }, [currentLayout]);

  const handleNextStep = useCallback(() => {
    const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].key);
    }
  }, [currentStep]);

  const handlePrevStep = useCallback(() => {
    const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].key);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: Step) => {
      const targetIndex = STEPS.findIndex((s) => s.key === step);
      const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

      if (targetIndex <= currentIndex || (step === "photos" && selectedLayout)) {
        setCurrentStep(step);
      }
    },
    [currentStep, selectedLayout]
  );

  const showLoading = !isInitialized || isLoading;
  const stepNumber = STEPS.findIndex((s) => s.key === currentStep) + 1;

  const photosContent = (
    <div className="p-4">
      {selectedFrame && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary mb-2">
            Tap a photo below to fill the selected frame
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedFrame(null)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Search input */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search millions of images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-20"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 h-7 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
            disabled={isSearching}
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
          </Button>
        </div>
      </form>

      {/* Image results */}
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4 px-1">
        {activeSearchTerm ? `Search Results` : `Interior Design Collection`}{" "}
        {allSearchResults.length > 0 ? `(${allSearchResults.length}+)` : ""}
      </p>

      {/* Loading skeleton */}
      {isSearching && allSearchResults.length === 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : allSearchResults.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {allSearchResults.map((image) => {
              const isUsed = Object.values(frameContent).some(
                (c) => c?.imageUrl === image.url
              );
              const exportUrl = image.fullUrl || image.url;
              return (
                <div
                  key={image.id}
                  draggable={!isMobile}
                  onDragStart={(e) =>
                    handleDragStartFromPicker(e, { url: image.url, alt: image.alt, exportUrl })
                  }
                  onDragEnd={handleDragEnd}
                  onClick={() =>
                    selectedFrame
                      ? handleReplacePhoto(selectedFrame, { url: image.url, alt: image.alt, exportUrl })
                      : handleAddPhoto({ url: image.url, alt: image.alt, exportUrl })
                  }
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all group",
                    isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
                    isUsed
                      ? "border-green-500 opacity-60"
                      : !nextEmptyFrame && !selectedFrame
                      ? "opacity-40 cursor-not-allowed border-transparent"
                      : "border-transparent hover:border-primary"
                  )}
                >
                  <img
                    src={image.thumbnailUrl}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 pointer-events-none"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {selectedFrame ? "Replace" : "Drag or Click"}
                    </span>
                  </div>
                  {isUsed && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load more */}
          <div className="py-6 flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isSearching}
              className="h-12 px-8"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          {activeSearchTerm ? `No results found for "${activeSearchTerm}"` : "Loading images..."}
        </p>
      )}
    </div>
  );

  const notesContent = (
    <div className="p-6 space-y-5">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Edit directly on the board</p>
        <p className="text-sm text-muted-foreground">
          Click on the Notes or Colour Palette sections on your moodboard to edit them
          directly.
        </p>
      </div>

      {/* Quick text templates */}
      <div>
        <p className="text-sm font-medium mb-3">Quick add templates</p>
        <div className="space-y-2">
          {[
            { label: "Style: Modern Minimal", text: "Style: Modern Minimal" },
            { label: "Style: Warm & Organic", text: "Style: Warm & Organic" },
            { label: "Style: Bold & Contemporary", text: "Style: Bold & Contemporary" },
            { label: "Mood: Calm & Serene", text: "Mood: Calm & Serene" },
            { label: "Mood: Cozy & Inviting", text: "Mood: Cozy & Inviting" },
            { label: "Materials: Natural textures", text: "Materials: Natural textures, timber, stone" },
            { label: "Materials: Mixed metals", text: "Materials: Mixed metals, brass, matte black" },
            { label: "Lighting: Soft & ambient", text: "Lighting: Soft ambient with layered fixtures" },
          ].map((template) => (
            <button
              key={template.label}
              onClick={() => setNoteText((prev) => prev ? `${prev}\n${template.text}` : template.text)}
              className="w-full text-left px-3 py-2.5 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/40 transition-all text-sm group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                + {template.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color-based suggestions */}
      <div>
        <p className="text-sm font-medium mb-3">Based on your palette</p>
        <div className="space-y-2">
          {(() => {
            const nonWhiteColors = colors.filter(c => c.toLowerCase() !== '#ffffff');
            const hasNeutrals = nonWhiteColors.some(c => {
              const hex = c.replace('#', '');
              const r = parseInt(hex.slice(0, 2), 16);
              const g = parseInt(hex.slice(2, 4), 16);
              const b = parseInt(hex.slice(4, 6), 16);
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const saturation = max === 0 ? 0 : (max - min) / max;
              return saturation < 0.2;
            });
            const hasWarmTones = nonWhiteColors.some(c => {
              const hex = c.replace('#', '');
              const r = parseInt(hex.slice(0, 2), 16);
              const g = parseInt(hex.slice(2, 4), 16);
              const b = parseInt(hex.slice(4, 6), 16);
              return r > b && r > 100;
            });
            const hasCoolTones = nonWhiteColors.some(c => {
              const hex = c.replace('#', '');
              const r = parseInt(hex.slice(0, 2), 16);
              const b = parseInt(hex.slice(4, 6), 16);
              return b > r && b > 100;
            });

            const suggestions = [];
            if (hasNeutrals) suggestions.push({ label: "Neutral palette", text: "Palette: Neutral tones with earthy accents" });
            if (hasWarmTones) suggestions.push({ label: "Warm undertones", text: "Undertones: Warm, inviting atmosphere" });
            if (hasCoolTones) suggestions.push({ label: "Cool undertones", text: "Undertones: Cool, calming aesthetic" });
            if (nonWhiteColors.length >= 3) suggestions.push({ label: "Cohesive scheme", text: "Color scheme: Cohesive & balanced" });
            
            if (suggestions.length === 0) {
              return (
                <p className="text-xs text-muted-foreground italic px-1">
                  Add images to generate palette-based suggestions
                </p>
              );
            }

            return suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => setNoteText((prev) => prev ? `${prev}\n${suggestion.text}` : suggestion.text)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all text-sm group"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {nonWhiteColors.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-background"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    + {suggestion.label}
                  </span>
                </div>
              </button>
            ));
          })()}
        </div>
      </div>
    </div>
  );

  const renderFrame = (frame: (typeof LAYOUTS)[0]["grid"][0]) => {
    const content = frameContent[frame.id];
    const isSelected = selectedFrame === frame.id;

    if (frame.type === "colors") {
      return (
        <div
          key={frame.id}
          className="bg-muted/50 rounded-lg border border-border p-3 flex flex-col"
          style={{
            gridColumn: `${frame.col} / span ${frame.colSpan}`,
            gridRow: `${frame.row} / span ${frame.rowSpan}`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Colour Palette
              </span>
              {isExtracting && (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              )}
            </div>
            <button
              onClick={handleResetPalette}
              className="p-1 rounded hover:bg-muted transition-colors"
              data-export-hide="true"
            >
              <RotateCcw className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {colors.map((color, index) => (
              <div key={index} className="flex-1 flex items-center gap-1 min-h-[24px]">
                {/* Color swatch with hex code overlay */}
                <div 
                  className="relative flex-1 h-full rounded overflow-hidden"
                  data-color-swatch="true"
                  data-color={color}
                  style={{ backgroundColor: color }}
                >
                  {/* Hex code label */}
                  <div className="absolute inset-0 flex items-center justify-start px-2">
                    <span 
                      className="text-[10px] font-mono font-medium"
                      style={{ 
                        color: getContrastColor(color),
                        textShadow: getContrastColor(color) === '#ffffff' 
                          ? '0 1px 2px rgba(0,0,0,0.5)' 
                          : '0 1px 2px rgba(255,255,255,0.3)'
                      }}
                    >
                      {color.toUpperCase()}
                    </span>
                  </div>
                  {/* Hidden color input for picker functionality */}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => handleToggleLock(index)}
                  className={cn(
                    "p-1 rounded transition-colors shrink-0",
                    lockedSwatches[index] 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-muted-foreground"
                  )}
                  data-export-hide="true"
                >
                  {lockedSwatches[index] ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Unlock className="h-3 w-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (frame.type === "notes") {
      return (
        <div
          key={frame.id}
          className="bg-muted/50 rounded-lg border border-border p-4 flex flex-col"
          style={{
            gridColumn: `${frame.col} / span ${frame.colSpan}`,
            gridRow: `${frame.row} / span ${frame.rowSpan}`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Notes
            </span>
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="flex-1 bg-transparent border-0 resize-none text-sm focus:outline-none focus:ring-0 p-0"
            placeholder="Add your notes here..."
          />
        </div>
      );
    }

    // Image frame
    const isDragOver = dragOverFrame === frame.id;
    const isDragging = draggedFromFrame === frame.id;
    
    return (
      <div
        key={frame.id}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-all overflow-hidden group",
          content?.imageUrl
            ? "border-transparent"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
          isSelected && "ring-2 ring-primary ring-offset-2",
          isDragOver && "border-primary bg-primary/10 scale-[1.02]",
          isDragging && "opacity-50 scale-95"
        )}
        style={{
          gridColumn: `${frame.col} / span ${frame.colSpan}`,
          gridRow: `${frame.row} / span ${frame.rowSpan}`,
        }}
        draggable={!!content?.imageUrl && currentStep === "photos" && !isMobile}
        onDragStart={(e) => content?.imageUrl && handleDragStartFromFrame(e, frame.id)}
        onDragOver={(e) => currentStep === "photos" && handleDragOver(e, frame.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => currentStep === "photos" && handleDrop(e, frame.id)}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (currentStep === "photos") {
            setSelectedFrame(isSelected ? null : frame.id);
          }
        }}
      >
        {content?.imageUrl ? (
          <>
            <img
              src={content.imageUrl}
              alt={content.imageAlt || "Moodboard image"}
              width={1200}
              height={900}
              data-export-url={content.exportUrl || content.imageUrl}
              className={cn(
                "w-full h-full object-cover",
                currentStep === "photos" && (isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing")
              )}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {currentStep === "photos" && (
              <div 
                className={cn(
                  "absolute inset-0 transition-all flex items-center justify-center",
                  isMobile
                    ? isSelected
                      ? "opacity-100 bg-black/40"
                      : "opacity-0"
                    : "opacity-0 group-hover:opacity-100 bg-black/40"
                )}
                data-export-hide="true"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(frame.id);
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center text-muted-foreground transition-colors",
            isDragOver && "text-primary"
          )}>
            <ImageIcon className={cn("h-8 w-8 mb-2", isDragOver ? "opacity-100" : "opacity-40")} />
            <span className="text-xs opacity-60">
              {isDragOver ? "Drop here" : currentStep === "photos" ? "Tap to select" : "Empty"}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col lg:h-screen lg:overflow-hidden",
        isMobile && "h-[100dvh] overflow-hidden"
      )}
    >
      <SEO
        title="Moodboard Creator | Plan Your Renovation Aesthetic"
        description="Collect inspiration, curate colour palettes, and export a renovation moodboard to share with our Gold Coast design team."
        url="/renovation-design-tools/moodboard"
      />
      <Header />

      <div className="pt-[74px] md:pt-[100px] flex-1 flex flex-col min-h-0 lg:min-h-0">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-border bg-background flex items-center gap-3 md:gap-4 shrink-0">
          <Link
            to="/renovation-design-tools"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to design tools</span>
          </Link>

          <h1 className="text-base font-medium shrink-0">Create Your Moodboard</h1>

          {/* Steps inline (desktop) */}
          <div className="hidden lg:flex flex-1 min-w-0 items-center justify-start xl:justify-center gap-1 sm:gap-3 overflow-x-auto scrollbar-hide px-2">
            {STEPS.map((step, index) => {
              const isCompleted = index + 1 < stepNumber;
              const isCurrent = step.key === currentStep;
              const canNavigate = isCompleted || (step.key === "photos" && selectedLayout);

              return (
                <button
                  key={step.key}
                  onClick={() => goToStep(step.key)}
                  disabled={!canNavigate && !isCurrent}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 transition-all",
                    canNavigate || isCurrent ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden md:block text-xs font-medium",
                      isCurrent
                        ? "text-foreground"
                        : isCompleted
                        ? "text-green-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {isMobile && (
              <div className="flex items-center gap-1">
                {showPrevStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevStep}
                    className="h-7 px-2 text-xs font-medium"
                  >
                    Prev
                  </Button>
                )}
                {showNextStep && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleNextStep}
                    disabled={!canAdvanceStep}
                    className="h-7 px-2 text-xs font-medium"
                  >
                    Next
                  </Button>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : isInitialized ? (
                <>
                  <Cloud className="h-4 w-4 text-green-600" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {!isMobile && (
          <>
            {/* Steps row (mobile) */}
            <div className="lg:hidden px-4 py-2 border-b border-border bg-background flex gap-2 overflow-x-auto">
              {STEPS.map((step, index) => {
                const isCompleted = index + 1 < stepNumber;
                const isCurrent = step.key === currentStep;
                const canNavigate = isCompleted || (step.key === "photos" && selectedLayout);

                return (
                  <button
                    key={step.key}
                    onClick={() => goToStep(step.key)}
                    disabled={!canNavigate && !isCurrent}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
                      isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : isCompleted
                        ? "border-green-500/50 text-green-600"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold",
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                    </span>
                    {step.label}
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <Progress value={(stepNumber / 4) * 100} className="h-1 shrink-0" />
          </>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 lg:min-h-0">
          {/* Side panel */}
          <div
            className={cn(
              "order-2 lg:order-1 w-full lg:w-96 bg-card flex flex-col lg:min-h-0 lg:overflow-hidden",
              isMobile
                ? "flex-1 min-h-0 border-t border-border rounded-t-3xl shadow-[0_-12px_30px_rgba(0,0,0,0.08)] -mt-2 relative z-10"
                : "border-b lg:border-b-0 lg:border-r border-border"
            )}
          >
            {isMobile && (
              <div className="px-4 pt-4 pb-3 border-b border-border/60">
                <div className="grid grid-cols-4 gap-2">
                  {STEP_TABS.map((tab) => {
                    const tabIndex = STEPS.findIndex((s) => s.key === tab.key);
                    const isCompleted = tabIndex + 1 < stepNumber;
                    const isActive = tab.key === currentStep;
                    const canNavigate = isCompleted || (tab.key === "photos" && selectedLayout);
                    return (
                      <button
                        key={tab.key}
                        onClick={() => goToStep(tab.key)}
                        disabled={!canNavigate && !isActive}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-medium border transition-all",
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : canNavigate
                            ? "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            : "border-border/60 text-muted-foreground/60 cursor-not-allowed"
                        )}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step header (desktop) */}
            {!isMobile && (
              <div className="shrink-0 p-4 sm:p-6 border-b border-border">
                <h2 className="text-lg sm:text-xl font-semibold mb-1">
                  {currentStep === "layout" && "Step 1: Pick a layout"}
                  {currentStep === "photos" && "Step 2: Add photos"}
                  {currentStep === "notes" && "Step 3: Add notes"}
                  {currentStep === "download" && "Step 4: Download"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {currentStep === "layout" && "Choose a template for your moodboard."}
                  {currentStep === "photos" &&
                    `Click photos to fill frames (${filledFrames.length}/${imageFrames.length} filled).`}
                  {currentStep === "notes" && "Edit the notes and colours on your board."}
                  {currentStep === "download" && "Your moodboard is ready to download."}
                </p>
              </div>
            )}

            {/* Scrollable content area */}
            <div
              ref={isMobile ? scrollContainerRef : undefined}
              className={cn(
                "flex-1 flex flex-col min-h-0 lg:min-h-0 lg:overflow-hidden",
                isMobile && "overflow-y-auto"
              )}
            >
              {isMobile && (
                <div className="px-4 pt-4 pb-3 border-b border-border/40">
                  <h2 className="text-lg font-semibold mb-1">
                    {currentStep === "layout" && "Step 1: Pick a layout"}
                    {currentStep === "photos" && "Step 2: Add photos"}
                    {currentStep === "notes" && "Step 3: Add notes"}
                    {currentStep === "download" && "Step 4: Download"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {currentStep === "layout" && "Choose a template for your moodboard."}
                    {currentStep === "photos" &&
                      `Click photos to fill frames (${filledFrames.length}/${imageFrames.length} filled).`}
                    {currentStep === "notes" && "Edit the notes and colours on your board."}
                    {currentStep === "download" && "Your moodboard is ready to download."}
                  </p>
                </div>
              )}
              {/* Layout step */}
              {currentStep === "layout" && (
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 lg:overflow-auto">
                  {LAYOUTS.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => handleSelectLayout(layout.id)}
                      className={cn(
                        "w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all hover:border-primary/60 hover:shadow-sm",
                        selectedLayout === layout.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-base sm:text-lg font-semibold">{layout.label}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            {layout.description}
                          </p>
                        </div>
                        {selectedLayout === layout.id && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Photos step */}
              {currentStep === "photos" && (
                isMobile ? (
                  photosContent
                ) : (
                  <ScrollArea className="lg:flex-1 lg:min-h-0" ref={scrollContainerRef}>
                    {photosContent}
                  </ScrollArea>
                )
              )}

              {/* Notes step */}
              {currentStep === "notes" && (
                isMobile ? (
                  notesContent
                ) : (
                  <ScrollArea className="lg:flex-1 lg:min-h-0">
                    {notesContent}
                  </ScrollArea>
                )
              )}

              {/* Download step */}
              {currentStep === "download" && (
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your moodboard is ready!</h3>
                    <p className="text-muted-foreground">
                      Download it to share with your designer or keep for inspiration.
                    </p>
                  </div>
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="w-full h-14 text-base font-medium"
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Exporting...
                      </>
                    ) : (
                      "Download image"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            {!isMobile && (
              <div className="p-5 border-t border-border shrink-0 space-y-3 bg-card">
                {currentStep !== "download" && (
                  <Button
                    onClick={handleNextStep}
                    size="lg"
                    className="w-full h-12 text-base font-medium"
                    disabled={currentStep === "layout" && !selectedLayout}
                  >
                    {currentStep === "layout" && "Continue to photos"}
                    {currentStep === "photos" && "Continue to notes"}
                    {currentStep === "notes" && "Continue to download"}
                  </Button>
                )}
                {currentStep !== "layout" && (
                  <Button variant="ghost" onClick={handlePrevStep} size="lg" className="w-full h-10">
                    Go back
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Board area */}
          <div
            className={cn(
              "order-1 lg:order-2 relative lg:flex-1 lg:overflow-hidden",
              isMobile
                ? "shrink-0 flex flex-col items-center justify-center gap-3 bg-muted/30 px-3 pt-4 pb-3 border-b border-border"
                : "flex items-center justify-center p-2 sm:p-6 border-b lg:border-b-0 lg:border-t-0 border-border overflow-auto"
            )}
            style={{
              backgroundColor: isMobile ? "hsl(var(--muted) / 0.2)" : "hsl(var(--muted) / 0.3)",
            }}
          >
            {/* Zoom controls (desktop only) */}
            {!isMobile && currentLayout && !showLoading && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={desktopZoom <= 0.4}
                  className="h-8 w-8 p-0"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <button
                  onClick={handleZoomReset}
                  className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[3rem] text-center"
                  title="Reset zoom"
                >
                  {Math.round(desktopZoom * 100)}%
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={desktopZoom >= 2}
                  className="h-8 w-8 p-0"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-border mx-0.5" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomReset}
                  className="h-8 w-8 p-0"
                  title="Fit to view"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            )}
            {/* Loading overlay */}
            {showLoading && (
              <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center max-w-xs bg-card p-8 rounded-2xl shadow-lg">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">{loadingMessage}</p>
                  <Progress value={loadingProgress} className="h-1.5" />
                </div>
              </div>
            )}

            {/* Moodboard */}
            {currentLayout ? (
              <div ref={boardViewportRef} className="w-full flex justify-center">
                <div
                  ref={boardRef}
                  className="relative"
                  style={
                    isMobile
                      ? {
                          width: `${BOARD_BASE_WIDTH * boardScale}px`,
                          height: `${boardBaseHeight * boardScale}px`,
                        }
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      "bg-white rounded-2xl shadow-2xl overflow-hidden transition-opacity duration-300 ring-1 ring-black/5",
                      boardPaddingClass
                    )}
                    data-board-content="true"
                    style={{
                      opacity: showLoading ? 0 : 1,
                      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.2)",
                      ...(isMobile
                        ? {
                            position: "absolute",
                            inset: 0,
                            width: `${BOARD_BASE_WIDTH}px`,
                            height: `${boardBaseHeight}px`,
                            transform: `scale(${boardScale})`,
                            transformOrigin: "top left",
                          }
                        : {
                            aspectRatio: `${currentLayout.cols} / ${currentLayout.rows}`,
                            width: "auto",
                            maxWidth: "calc(100% - 48px)",
                            height: "calc(100% - 48px)",
                            maxHeight: "calc(100% - 48px)",
                            transform: desktopZoom !== 1 ? `scale(${desktopZoom})` : undefined,
                            transformOrigin: "center center",
                          }),
                    }}
                  >
                    <div
                      className={cn("w-full h-full", gridGapClass)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${currentLayout.cols}, 1fr)`,
                        gridTemplateRows: `repeat(${currentLayout.rows}, 1fr)`,
                      }}
                    >
                      {currentLayout.grid.map((frame) => renderFrame(frame))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl shadow-2xl flex items-center justify-center transition-opacity duration-300 ring-1 ring-black/5"
                style={{
                  opacity: showLoading ? 0 : 1,
                  boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.2)",
                  aspectRatio: "3/2",
                  width: isMobile ? "100%" : "auto",
                  maxWidth: isMobile ? "100%" : "calc(100% - 48px)",
                  height: isMobile ? undefined : "calc(100% - 48px)",
                  maxHeight: isMobile ? undefined : "calc(100% - 48px)",
                }}
              >
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Choose a layout to get started</p>
                  <p className="text-sm mt-1">Pick a template from the sidebar</p>
                </div>
              </div>
            )}

            {isMobile && currentLayout && (
              <div className="w-full max-w-3xl mx-auto flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>{currentLayout.label} layout</span>
                <span>
                  {filledFrames.length}/{imageFrames.length} photos
                </span>
              </div>
            )}

            {/* Helpful hint */}
            {!isMobile && !showLoading && currentStep === "photos" && filledFrames.length === 0 && currentLayout && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-card px-5 py-3 rounded-full shadow-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  Click photos in the sidebar to fill the frames
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodboardCreator;
