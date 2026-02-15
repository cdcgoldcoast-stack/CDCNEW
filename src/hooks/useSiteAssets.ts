import { useImageOverrides } from "./useImageOverrides";
import { siteAssets } from "@/data/siteAssets";

/**
 * Hook that returns all site assets with any database overrides applied.
 * Use this in components to get resolved image URLs that respect admin replacements.
 * 
 * While override data loads, this returns bundled assets so above-the-fold imagery
 * can paint immediately. Overrides are applied once available.
 */
export function useSiteAssets() {
  const { data: overrides, isLoading, isError } = useImageOverrides();

  // Ready means we've finished loading (success or error)
  const ready = !isLoading;

  // Build a map of asset ID -> resolved URL.
  const resolvedAssets: Record<string, string> = {};

  for (const asset of siteAssets) {
    // Default to bundled images so first render is never blocked on DB/network.
    resolvedAssets[asset.id] = asset.importedUrl;

    // If error or still loading, keep bundled fallback.
    if (isError) {
      continue;
    }

    const override = overrides?.find((o) => o.original_path === asset.path);
    if (!override) {
      continue;
    }

    // Cache-bust when file name stays the same.
    resolvedAssets[asset.id] = override.updated_at
      ? `${override.override_url}${override.override_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
          override.updated_at
        )}`
      : override.override_url;
  }

  return {
    assets: resolvedAssets,
    isLoading,
    ready,
  };
}

/**
 * Get a single resolved asset by ID.
 * Returns null while loading, then the override URL if one exists, otherwise the original.
 */
export function useResolvedAsset(
  assetId: string,
): string | null {
  const { assets } = useSiteAssets();

  return assets[assetId] || null;
}
