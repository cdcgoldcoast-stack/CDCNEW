import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ImageResult {
  id: string;
  url: string;
  fullUrl?: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer?: string;
  photographerUrl?: string;
  source: string;
  sourceUrl: string;
  license?: string;
  licenseUrl?: string;
}

interface CacheEntry {
  results: ImageResult[];
  timestamp: number;
}

// In-memory cache for the current session
const searchCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Fallback images when API is unavailable - using Pexels CDN URLs
const FALLBACK_IMAGES: ImageResult[] = [
  {
    id: "fallback-1",
    url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Modern living room with neutral tones",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-2",
    url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Minimalist kitchen design",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-3",
    url: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Cozy bedroom interior",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-4",
    url: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Modern bathroom design",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-5",
    url: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Scandinavian style living room",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-6",
    url: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Open plan kitchen and dining",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-7",
    url: "https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Contemporary home office",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-8",
    url: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Luxury master bedroom",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-9",
    url: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Industrial style loft",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-10",
    url: "https://images.pexels.com/photos/2029665/pexels-photo-2029665.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/2029665/pexels-photo-2029665.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/2029665/pexels-photo-2029665.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Coastal style living space",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-11",
    url: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Modern dining room",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
  {
    id: "fallback-12",
    url: "https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullUrl: "https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumbnailUrl: "https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 800,
    height: 600,
    alt: "Warm timber kitchen",
    source: "Pexels",
    sourceUrl: "https://pexels.com",
  },
];

export function useImageSearch() {
  const [results, setResults] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (
    provider: "pexels" | "openverse" | "pixabay" | "all",
    query: string,
    page: number = 1
  ) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const cacheKey = `${provider}-${query.toLowerCase().trim()}-${page}`;
    
    // Check in-memory cache first
    const cached = searchCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setResults(cached.results);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("search-images", {
        body: { provider, query, page },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const newResults = data.results as ImageResult[];
      
      // Update cache
      searchCache[cacheKey] = {
        results: newResults,
        timestamp: Date.now(),
      };

      setResults(newResults);
    } catch (err: any) {
      if (err.name === "AbortError") return;

      console.error("Search error:", err);

      // Use fallback images when API fails
      if (page === 1) {
        console.log("Using fallback images due to API error");
        setResults(FALLBACK_IMAGES);
        searchCache[cacheKey] = {
          results: FALLBACK_IMAGES,
          timestamp: Date.now(),
        };
        // Don't show error toast since we have fallbacks
        return;
      }

      setError(err.message || "Failed to search images");

      if (err.message?.includes("Rate limit")) {
        toast.error("Too many requests. Please wait a moment.");
      } else if (err.message?.includes("not configured")) {
        setError("Stock photos not available. Try Open Licensed search instead.");
      } else {
        toast.error("Failed to load more images");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
}
