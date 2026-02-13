import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ImageOverride {
  id: string;
  original_path: string;
  override_url: string;
  updated_at?: string;
}

// Fetch all image overrides
export function useImageOverrides() {
  return useQuery({
    queryKey: ["image-overrides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("image_overrides")
        .select("*")
        .order("original_path");

      if (error) throw error;
      return data as ImageOverride[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// Get override URL for a specific asset path, returns original if no override
export function useResolvedImage(
  originalPath: string,
  importedAsset: string
): string {
  const { data: overrides } = useImageOverrides();

  if (!overrides) return importedAsset;

  const override = overrides.find((o) => o.original_path === originalPath);
  if (!override) return importedAsset;

  // Cache-bust when admins replace an image but the URL stays the same.
  // (Supplied by DB trigger defaults; may be undefined in older rows.)
  return override.updated_at
    ? `${override.override_url}${override.override_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
        override.updated_at
      )}`
    : override.override_url;
}

// Non-hook version for static resolution (use with caution, needs overrides passed in)
export function resolveImage(
  originalPath: string,
  importedAsset: string,
  overrides: ImageOverride[] | undefined
): string {
  if (!overrides) return importedAsset;
  const override = overrides.find((o) => o.original_path === originalPath);
  if (!override) return importedAsset;
  return override.updated_at
    ? `${override.override_url}${override.override_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
        override.updated_at
      )}`
    : override.override_url;
}
