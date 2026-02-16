import { useImageOverrides } from "./useImageOverrides";
import { siteAssets } from "@/data/siteAssets";

/**
 * Hook that returns all site assets with any database overrides applied.
 * Use this in components to get resolved image URLs that respect admin replacements.
 *
 * While override data is loading, this returns empty strings for override-managed
 * assets to avoid rendering a fallback image that is immediately replaced.
 */
export function useSiteAssets() {
  const { data: overrides, isLoading, isError } = useImageOverrides();

  // Ready means we've finished loading (success or error)
  const ready = !isLoading;

  // Build a map of asset ID -> resolved URL.
  const resolvedAssets: Record<string, string> = {};

  for (const asset of siteAssets) {
    if (isLoading && !isError) {
      // Avoid image-flash: do not paint bundled fallback while override state is unknown.
      resolvedAssets[asset.id] = "";
      continue;
    }

    const override = overrides?.find((o) => o.original_path === asset.path);
    resolvedAssets[asset.id] = override
      ? (
          override.updated_at
            ? `${override.override_url}${override.override_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
                override.updated_at
              )}`
            : override.override_url
        )
      : asset.importedUrl;
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
