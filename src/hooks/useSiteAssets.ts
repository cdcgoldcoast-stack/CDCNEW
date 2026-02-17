import { useImageOverrides } from "./useImageOverrides";
import { siteAssets, resolveImageSrc } from "@/data/siteAssets";

interface UseSiteAssetsOptions {
  staticFirst?: boolean;
}

/**
 * Hook that returns all site assets with any database overrides applied.
 * Use this in components to get resolved image URLs that respect admin replacements.
 *
 * By default, while override data is loading this returns empty strings for
 * override-managed assets to avoid image replacement flashes.
 */
export function useSiteAssets(options: UseSiteAssetsOptions = {}) {
  const { data: overrides, isLoading, isError } = useImageOverrides();
  const { staticFirst = false } = options;

  // Ready means we've finished loading (success or error)
  const ready = !isLoading;

  // Build a map of asset ID -> resolved URL.
  const resolvedAssets: Record<string, string> = {};

  for (const asset of siteAssets) {
    if (isLoading && !isError) {
      // Allow static-first mode for critical assets (e.g. homepage hero LCP).
      resolvedAssets[asset.id] = staticFirst ? resolveImageSrc(asset.importedUrl) : "";
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
      : resolveImageSrc(asset.importedUrl);
  }

  return {
    assets: resolvedAssets,
    isLoading,
    ready,
  };
}

/**
 * Get a single resolved asset by ID.
 * Returns null while loading by default, unless staticFirst is enabled.
 */
export function useResolvedAsset(
  assetId: string,
  options: UseSiteAssetsOptions = {},
): string | null {
  const { assets } = useSiteAssets(options);

  return assets[assetId] || null;
}
