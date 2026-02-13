import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildCorsHeaders,
  enforceRateLimit,
  isAllowedImageHost,
  jsonResponse,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

interface SearchRequest {
  provider: "pexels" | "openverse" | "pixabay" | "all";
  query: string;
  page?: number;
}

interface ImageResult {
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

function filterToAllowedHosts(results: ImageResult[]): ImageResult[] {
  return results.filter((result) => {
    try {
      const candidates = [result.url, result.fullUrl, result.thumbnailUrl].filter(Boolean) as string[];
      return candidates.every((candidate) => {
        const parsed = new URL(candidate);
        return isAllowedImageHost(parsed.hostname);
      });
    } catch {
      return false;
    }
  });
}

async function searchPexels(query: string, page: number = 1): Promise<ImageResult[]> {
  const apiKey = Deno.env.get("PEXELS_API_KEY");
  if (!apiKey) {
    console.log("PEXELS_API_KEY not configured, skipping Pexels");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&page=${page}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    return data.photos.map((photo: any) => ({
      id: `pexels-${photo.id}`,
      url: photo.src.large2x,
      fullUrl: photo.src.original,
      thumbnailUrl: photo.src.medium,
      width: photo.width,
      height: photo.height,
      alt: photo.alt || query,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      source: "Pexels",
      sourceUrl: photo.url,
    }));
  } catch (error) {
    console.error("Pexels search error:", error);
    return [];
  }
}

async function searchOpenverse(query: string, page: number = 1): Promise<ImageResult[]> {
  try {
    const response = await fetch(
      `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page=${page}&page_size=15`,
      {
        headers: {
          "User-Agent": "FlowHomeStudio/1.0 (Moodboard Creator)",
        },
      }
    );

    if (!response.ok) {
      console.error(`Openverse API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    return data.results.map((image: any) => ({
      id: `openverse-${image.id}`,
      url: image.url,
      fullUrl: image.url,
      thumbnailUrl: image.thumbnail || image.url,
      width: image.width || 800,
      height: image.height || 600,
      alt: image.title || query,
      photographer: image.creator,
      photographerUrl: image.creator_url,
      source: image.source || "Openverse",
      sourceUrl: image.foreign_landing_url || image.url,
      license: image.license,
      licenseUrl: image.license_url,
    }));
  } catch (error) {
    console.error("Openverse search error:", error);
    return [];
  }
}

async function searchPixabay(query: string, page: number = 1): Promise<ImageResult[]> {
  const apiKey = Deno.env.get("PIXABAY_API_KEY");
  if (!apiKey) {
    console.log("PIXABAY_API_KEY not configured, skipping Pixabay");
    return [];
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&page=${page}&per_page=15&image_type=photo`,
      {
        headers: {
          "User-Agent": "FlowHomeStudio/1.0 (Moodboard Creator)",
        },
      }
    );

    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    return data.hits.map((image: any) => ({
      id: `pixabay-${image.id}`,
      url: image.largeImageURL,
      fullUrl: image.fullHDURL || image.imageURL || image.largeImageURL,
      thumbnailUrl: image.webformatURL,
      width: image.imageWidth,
      height: image.imageHeight,
      alt: image.tags || query,
      photographer: image.user,
      photographerUrl: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
      source: "Pixabay",
      sourceUrl: image.pageURL,
      license: "Pixabay License",
      licenseUrl: "https://pixabay.com/service/license/",
    }));
  } catch (error) {
    console.error("Pixabay search error:", error);
    return [];
  }
}

// Interleave results from multiple sources for a mixed experience
function interleaveResults(arrays: ImageResult[][]): ImageResult[] {
  const result: ImageResult[] = [];
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  
  for (let i = 0; i < maxLength; i++) {
    for (const arr of arrays) {
      if (i < arr.length) {
        result.push(arr[i]);
      }
    }
  }
  
  return result;
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const disallowedOriginResponse = rejectDisallowedOrigin(req);
  if (disallowedOriginResponse) return disallowedOriginResponse;

  try {
    const rateLimit = await enforceRateLimit({
      req,
      endpoint: "search-images",
      limit: 40,
      windowSeconds: 60,
    });

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        429,
        {
          error: "Rate limit exceeded. Please try again later.",
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { "Retry-After": "60" },
      );
    }

    const { provider, query, page = 1 }: SearchRequest = await req.json();

    if (!provider || !query || typeof query !== "string") {
      return jsonResponse(req, 400, { error: "Missing required fields: provider, query" });
    }

    if (!["pexels", "openverse", "pixabay", "all"].includes(provider)) {
      return jsonResponse(req, 400, { error: "Invalid provider. Use 'pexels', 'openverse', 'pixabay', or 'all'" });
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2 || trimmedQuery.length > 120) {
      return jsonResponse(req, 400, { error: "Query must be between 2 and 120 characters" });
    }

    if (!Number.isInteger(page) || page < 1 || page > 30) {
      return jsonResponse(req, 400, { error: "Page must be an integer between 1 and 30" });
    }

    console.log(`Searching ${provider} for: "${trimmedQuery}" (page ${page})`);

    // Check cache first
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const cacheKey = `${trimmedQuery.toLowerCase()}-${page}`;
    
    const { data: cachedResult } = await supabase
      .from("image_search_cache")
      .select("results, expires_at")
      .eq("provider", provider)
      .eq("query", cacheKey)
      .single();

    if (cachedResult && new Date(cachedResult.expires_at) > new Date()) {
      const cachedResults = cachedResult.results as ImageResult[];
      const needsUpgrade = cachedResults.some((result) => !result.fullUrl);
      if (needsUpgrade) {
        console.log(`Cache missing fullUrl for ${provider}: ${query}. Fetching fresh.`);
      } else {
        console.log(`Cache hit for ${provider}: ${query}`);
        const safeCachedResults = filterToAllowedHosts(cachedResults);
        return jsonResponse(req, 200, { results: safeCachedResults, cached: true });
      }
    }

    // Fetch fresh results
    let results: ImageResult[] = [];
    
    if (provider === "all") {
      // Fetch from all providers in parallel
      const [pexelsResults, openverseResults, pixabayResults] = await Promise.all([
        searchPexels(trimmedQuery, page),
        searchOpenverse(trimmedQuery, page),
        searchPixabay(trimmedQuery, page),
      ]);
      
      console.log(`Results: Pexels=${pexelsResults.length}, Openverse=${openverseResults.length}, Pixabay=${pixabayResults.length}`);
      
      // Interleave results for variety
      results = interleaveResults([pexelsResults, pixabayResults, openverseResults]);
    } else if (provider === "pexels") {
      results = await searchPexels(trimmedQuery, page);
    } else if (provider === "openverse") {
      results = await searchOpenverse(trimmedQuery, page);
    } else if (provider === "pixabay") {
      results = await searchPixabay(trimmedQuery, page);
    }

    results = filterToAllowedHosts(results);

    // Cache the results
    await supabase
      .from("image_search_cache")
      .upsert({
        provider,
        query: cacheKey,
        results,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "provider,query" });

    console.log(`Fetched ${results.length} total results from ${provider} for: ${query}`);
    
    return jsonResponse(req, 200, { results, cached: false });

  } catch (error: unknown) {
    console.error("Search error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse(req, 500, { error: errorMessage });
  }
});
