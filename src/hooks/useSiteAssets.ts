import { useImageOverrides } from "./useImageOverrides";
import { siteAssets } from "@/data/siteAssets";

/**
 * Hook that returns all site assets with any database overrides applied.
 * Use this in components to get resolved image URLs that respect admin replacements.
 * 
 * IMPORTANT: Returns null for each asset while loading to prevent flash of original images.
 * Components should check `ready` or individual asset values before rendering.
 */
export function useSiteAssets() {
  const { data: overrides, isLoading, isError } = useImageOverrides();

  // Ready means we've finished loading (success or error)
  const ready = !isLoading;

  // Build a map of path -> resolved URL (null while loading)
  const resolvedAssets: Record<string, string | null> = {};

  for (const asset of siteAssets) {
    // While loading, return null to force components to show placeholders
    if (isLoading) {
      resolvedAssets[asset.id] = null;
      continue;
    }

    // If error, return null — don't show bundled fallback images
    if (isError) {
      resolvedAssets[asset.id] = null;
      continue;
    }

    const override = overrides?.find((o) => o.original_path === asset.path);
    if (!override) {
      resolvedAssets[asset.id] = asset.importedUrl;
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
  const { assets, isLoading } = useSiteAssets();

  if (isLoading) {
    return null;
  }

  return assets[assetId] || null;
}
