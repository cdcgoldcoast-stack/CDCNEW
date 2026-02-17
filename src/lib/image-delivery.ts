const SUPABASE_OBJECT_SEGMENT = "/storage/v1/object/public/";
const SUPABASE_RENDER_SEGMENT = "/storage/v1/render/image/public/";

export const DEFAULT_RESPONSIVE_WIDTHS = [320, 480, 640, 768, 960, 1200] as const;

export type ModernImageFormat = "avif" | "webp";

type TransformOptions = {
  width?: number;
  quality?: number;
  format?: ModernImageFormat;
};

const clampQuality = (quality?: number): number | undefined => {
  if (typeof quality !== "number" || Number.isNaN(quality)) return undefined;
  return Math.max(1, Math.min(100, Math.round(quality)));
};

const normalizeWidths = (widths: readonly number[]): number[] => {
  const normalized = widths
    .map((width) => Math.round(width))
    .filter((width) => width > 0);

  return Array.from(new Set(normalized)).sort((a, b) => a - b);
};

const splitHash = (url: string): { urlWithoutHash: string; hash: string } => {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return { urlWithoutHash: url, hash: "" };
  return {
    urlWithoutHash: url.slice(0, hashIndex),
    hash: url.slice(hashIndex),
  };
};

const isSupabaseCoHost = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
};

export const isSupabaseStorageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.includes(SUPABASE_OBJECT_SEGMENT) || url.includes(SUPABASE_RENDER_SEGMENT);
};

export const buildSupabaseImageUrl = (
  originalUrl: string,
  options: TransformOptions = {}
): string => {
  if (!isSupabaseStorageUrl(originalUrl)) return originalUrl;

  const { urlWithoutHash, hash } = splitHash(originalUrl);
  const [basePath, queryString = ""] = urlWithoutHash.split("?");
  const params = new URLSearchParams(queryString);

  // Use Supabase Image Transforms: rewrite /object/public/ → /render/image/public/
  // Only for *.supabase.co hosts (the transform endpoint only works there)
  let transformedPath = basePath;
  if (isSupabaseCoHost(originalUrl) && basePath.includes(SUPABASE_OBJECT_SEGMENT)) {
    transformedPath = basePath.replace(SUPABASE_OBJECT_SEGMENT, SUPABASE_RENDER_SEGMENT);
  }

  if (options.width) {
    params.set("width", String(Math.max(1, Math.round(options.width))));
  }

  const normalizedQuality = clampQuality(options.quality);
  if (normalizedQuality) {
    params.set("quality", String(normalizedQuality));
  }

  if (options.format) {
    params.set("format", options.format);
  }

  const nextQuery = params.toString();
  return `${transformedPath}${nextQuery ? `?${nextQuery}` : ""}${hash}`;
};

export const buildSupabaseSrcSet = (
  originalUrl: string,
  widths: readonly number[] = DEFAULT_RESPONSIVE_WIDTHS,
  options: Omit<TransformOptions, "width"> = {}
): string | undefined => {
  if (!isSupabaseStorageUrl(originalUrl)) return undefined;

  const normalizedWidths = normalizeWidths(widths);
  if (normalizedWidths.length === 0) return undefined;

  return normalizedWidths
    .map((width) => `${buildSupabaseImageUrl(originalUrl, { ...options, width })} ${width}w`)
    .join(", ");
};
