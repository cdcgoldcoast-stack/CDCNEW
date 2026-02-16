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
    } catch (err: unknown) {
      const errorName =
        typeof err === "object" && err !== null && "name" in err
          ? String((err as { name?: string }).name)
          : "";
      if (errorName === "AbortError") return;

      console.error("Search error:", err);
      const message = err instanceof Error ? err.message : "Failed to search images";

      setError(message);

      if (message.includes("Rate limit")) {
        toast.error("Too many requests. Please wait a moment.");
      } else if (message.includes("not configured")) {
        setError("Stock photos not available. Try Open Licensed search instead.");
        toast.error("Stock photos not available. Try Open Licensed search instead.");
      } else if (page > 1) {
        toast.error("Failed to load more images");
      } else {
        toast.error("Failed to search images");
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
