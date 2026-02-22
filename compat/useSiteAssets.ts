"use client";

import { useEffect, useMemo, useState } from "react";

interface UseSiteAssetsOptions {
  staticFirst?: boolean;
  deferRemoteOverrides?: boolean;
}

interface SiteAsset {
  id: string;
  path: string;
  importedUrl: string;
}

interface ImageOverride {
  original_path: string;
  override_url: string;
  updated_at?: string;
}

const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_riMzmbUjAEXtvSij0Ho2Ew_eGK9ChO8";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://iqugsxeejieneyksfbza.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

const hasSupabaseCredentials =
  SUPABASE_PUBLISHABLE_KEY.length > 0 &&
  SUPABASE_PUBLISHABLE_KEY !== "public-anon-key-placeholder";
const DEFER_EVENTS: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "scroll"];
const DEFER_OVERRIDE_FALLBACK_MS = 9000;

const defaultOverrideByPath: Record<string, string> = {
  "editorial-1.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations-Gold-Coast.webp",
  "editorial-10.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations.webp",
  "editorial-2.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  "editorial-3.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovation-Bathroom.webp",
  "editorial-4.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations-Gold-Coast.webp",
  "editorial-5.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Renovations.webp",
  "editorial-6.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  "editorial-7.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
  "editorial-8.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/kitchen-upgrade-varsity-lakes-gold-coast-concept-design-construct.webp",
  "editorial-9.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Bathroom-Renovations.webp",
  "hero-bg.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Kitchen.webp",
  "lifestyle-bathroom.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Gold-Coast-Bathroom-Renovations.webp",
  "lifestyle-calm.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Full_House_Renovation_Gold_Coast_fireplace.webp",
  "lifestyle-morning.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-Kitchen-Gold-Coast-Renovations.webp",
  "lifestyle-movement.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
  "lifestyle-storage.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Elanora-House-Renovations.webp",
  "service-bathroom.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-upgrade-maudsland-concept-design-construct.webp",
  "service-bg-bathroom.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/bathroom-renovation-pacific-pines-concept-design-construct.webp",
  "service-bg-extensions.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/hallway-renovation-southport-gold-coast-concept-design-construct.webp",
  "service-bg-kitchen.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Gold-Coast-Kitchen-Renovations.webp",
  "service-bg-living.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-House-Renovations.webp",
  "service-bg-whole-home.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Living-renovation-Helensvale.webp",
  "service-extensions.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-full-house-renovations.webp",
  "service-kitchen.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Kitchen.webp",
  "service-living.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/laundry-renovation-bundall-concept-design-construct.webp",
  "service-whole-home.jpg":
    "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Helensvale-Renovations-Gold-Coast.webp",
};

const siteAssets: SiteAsset[] = [
  {
    id: "hero-bg",
    path: "hero-bg.jpg",
    importedUrl:
      defaultOverrideByPath["hero-bg.jpg"] ?? "/hero-bg.webp",
  },
  { id: "logo", path: "logo.webp", importedUrl: "/assets/logo.webp" },
  { id: "editorial-1", path: "editorial-1.jpg", importedUrl: "/assets/editorial-1.webp" },
  { id: "editorial-2", path: "editorial-2.jpg", importedUrl: "/assets/editorial-2.webp" },
  { id: "editorial-3", path: "editorial-3.jpg", importedUrl: "/assets/editorial-3.webp" },
  { id: "editorial-4", path: "editorial-4.jpg", importedUrl: "/assets/editorial-4.webp" },
  { id: "editorial-5", path: "editorial-5.jpg", importedUrl: "/assets/editorial-5.webp" },
  { id: "editorial-6", path: "editorial-6.jpg", importedUrl: "/assets/editorial-6.webp" },
  { id: "editorial-7", path: "editorial-7.jpg", importedUrl: "/assets/editorial-7.webp" },
  { id: "editorial-8", path: "editorial-8.jpg", importedUrl: "/assets/editorial-8.webp" },
  { id: "editorial-9", path: "editorial-9.jpg", importedUrl: "/assets/editorial-9.webp" },
  { id: "editorial-10", path: "editorial-10.jpg", importedUrl: "/assets/editorial-10.webp" },
  { id: "lifestage-forever", path: "lifestage-forever.jpg", importedUrl: "/assets/lifestage-forever.webp" },
  { id: "lifestage-future", path: "lifestage-future.jpg", importedUrl: "/assets/lifestage-future.webp" },
  { id: "lifestage-growing", path: "lifestage-growing.jpg", importedUrl: "/assets/lifestage-growing.webp" },
  { id: "lifestage-wellness", path: "lifestage-wellness.jpg", importedUrl: "/assets/lifestage-wellness.webp" },
  { id: "lifestyle-bathroom", path: "lifestyle-bathroom.jpg", importedUrl: "/assets/lifestyle-bathroom.webp" },
  { id: "lifestyle-calm", path: "lifestyle-calm.jpg", importedUrl: "/assets/lifestyle-calm.webp" },
  { id: "lifestyle-morning", path: "lifestyle-morning.jpg", importedUrl: "/assets/lifestyle-morning.webp" },
  { id: "lifestyle-movement", path: "lifestyle-movement.jpg", importedUrl: "/assets/lifestyle-movement.webp" },
  { id: "lifestyle-storage", path: "lifestyle-storage.jpg", importedUrl: "/assets/lifestyle-storage.webp" },
  { id: "service-bathroom", path: "service-bathroom.jpg", importedUrl: "/assets/service-bathroom.webp" },
  { id: "service-bg-bathroom", path: "service-bg-bathroom.jpg", importedUrl: "/assets/service-bg-bathroom.webp" },
  { id: "service-bg-extensions", path: "service-bg-extensions.jpg", importedUrl: "/assets/service-bg-extensions.webp" },
  { id: "service-bg-kitchen", path: "service-bg-kitchen.jpg", importedUrl: "/assets/service-bg-kitchen.webp" },
  { id: "service-bg-living", path: "service-bg-living.jpg", importedUrl: "/assets/service-bg-living.webp" },
  { id: "service-bg-whole-home", path: "service-bg-whole-home.jpg", importedUrl: "/assets/service-bg-whole-home.webp" },
  { id: "service-extensions", path: "service-extensions.jpg", importedUrl: "/assets/service-extensions.webp" },
  { id: "service-kitchen", path: "service-kitchen.jpg", importedUrl: "/assets/service-kitchen.webp" },
  { id: "service-living", path: "service-living.jpg", importedUrl: "/assets/service-living.webp" },
  { id: "service-whole-home", path: "service-whole-home.jpg", importedUrl: "/assets/service-whole-home.webp" },
];

const fetchImageOverrides = async (): Promise<ImageOverride[]> => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/image_overrides?select=original_path,override_url,updated_at&order=original_path.asc`,
    {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch image overrides (${response.status})`);
  }

  return (await response.json()) as ImageOverride[];
};

export function useSiteAssets(options: UseSiteAssetsOptions = {}) {
  const { staticFirst = false, deferRemoteOverrides = false } = options;
  const [overrides, setOverrides] = useState<ImageOverride[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(hasSupabaseCredentials);
  const [isError, setIsError] = useState(false);
  const [isFetchEnabled, setIsFetchEnabled] = useState(!deferRemoteOverrides);

  useEffect(() => {
    if (!deferRemoteOverrides || typeof window === "undefined") {
      setIsFetchEnabled(true);
      return;
    }

    let enabled = false;
    let fallbackTimer: number | null = null;

    const enableFetch = () => {
      if (enabled) return;
      enabled = true;
      setIsFetchEnabled(true);
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of DEFER_EVENTS) {
        window.removeEventListener(eventName, enableFetch);
      }
    };

    setIsFetchEnabled(false);
    for (const eventName of DEFER_EVENTS) {
      window.addEventListener(eventName, enableFetch, { passive: true, once: true });
    }
    fallbackTimer = window.setTimeout(enableFetch, DEFER_OVERRIDE_FALLBACK_MS);

    return () => {
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of DEFER_EVENTS) {
        window.removeEventListener(eventName, enableFetch);
      }
    };
  }, [deferRemoteOverrides]);

  useEffect(() => {
    let cancelled = false;

    if (!hasSupabaseCredentials) {
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    if (!isFetchEnabled) {
      setIsLoading(true);
      return () => {
        cancelled = true;
      };
    }

    const loadOverrides = async () => {
      try {
        const data = await fetchImageOverrides();
        if (!cancelled) {
          setOverrides(data);
          setIsError(false);
        }
      } catch {
        if (!cancelled) {
          setIsError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadOverrides();

    return () => {
      cancelled = true;
    };
  }, [isFetchEnabled]);

  const overrideByPath = useMemo(() => {
    const map = new Map<string, ImageOverride>();
    (overrides || []).forEach((override) => {
      map.set(override.original_path, override);
    });
    return map;
  }, [overrides]);

  const assets = useMemo(() => {
    const resolved: Record<string, string> = {};

    for (const asset of siteAssets) {
      const knownOverride = defaultOverrideByPath[asset.path];

      if (isLoading && !isError) {
        resolved[asset.id] = staticFirst ? knownOverride || asset.importedUrl : "";
        continue;
      }

      const override = overrideByPath.get(asset.path);
      if (override) {
        resolved[asset.id] = override.updated_at
          ? `${override.override_url}${override.override_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
              override.updated_at,
            )}`
          : override.override_url;
        continue;
      }

      resolved[asset.id] = knownOverride || asset.importedUrl;
    }

    return resolved;
  }, [isError, isLoading, overrideByPath, staticFirst]);

  return {
    assets,
    isLoading,
    ready: !isLoading,
  };
}

export function useResolvedAsset(
  assetId: string,
  options: UseSiteAssetsOptions = {},
): string | null {
  const { assets } = useSiteAssets(options);
  return assets[assetId] || null;
}
