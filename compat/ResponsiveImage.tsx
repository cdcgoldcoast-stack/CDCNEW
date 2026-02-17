import type { CSSProperties, ImgHTMLAttributes } from "react";
import type { StaticImageData } from "next/image";
import {
  DEFAULT_RESPONSIVE_WIDTHS,
} from "@/lib/image-delivery";
import { cn } from "@/lib/utils";

type NormalizedSrc = string | StaticImageData | null | undefined;

type NativeImgProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "loading" | "decoding"
>;

const SUPABASE_RENDER_SEGMENT = "/storage/v1/render/image/public/";
const SUPABASE_OBJECT_SEGMENT = "/storage/v1/object/public/";
const TRANSFORM_QUERY_KEYS = new Set(["width", "height", "quality", "format", "resize"]);

interface ResponsiveImageProps extends NativeImgProps {
  src: NormalizedSrc;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
  priority?: boolean;
  quality?: number;
  responsiveWidths?: readonly number[];
  style?: CSSProperties;
  fit?: "cover" | "contain";
  position?: CSSProperties["objectPosition"];
}

const resolveSrc = (src: NormalizedSrc): string | null => {
  if (!src) return null;
  if (typeof src === "string") return src;
  if (typeof src === "object" && typeof src.src === "string") return src.src;
  return null;
};

const normalizeSupabaseImageUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(".supabase.co")) return url;

    if (parsed.pathname.includes(SUPABASE_RENDER_SEGMENT)) {
      parsed.pathname = parsed.pathname.replace(SUPABASE_RENDER_SEGMENT, SUPABASE_OBJECT_SEGMENT);
    }

    for (const key of TRANSFORM_QUERY_KEYS) {
      parsed.searchParams.delete(key);
    }

    const query = parsed.searchParams.toString();
    return `${parsed.origin}${parsed.pathname}${query ? `?${query}` : ""}${parsed.hash}`;
  } catch {
    return url;
  }
};

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = "100vw",
  loading,
  decoding = "async",
  priority = false,
  quality: _quality = 72,
  responsiveWidths: _responsiveWidths = DEFAULT_RESPONSIVE_WIDTHS,
  style,
  fit,
  position,
  fetchPriority,
  ...rest
}: ResponsiveImageProps) {
  const normalizedSrc = resolveSrc(src);
  if (!normalizedSrc) return null;

  const computedLoading = loading ?? (priority ? "eager" : "lazy");
  const computedFetchPriority =
    fetchPriority ?? (priority ? "high" : computedLoading === "lazy" ? "low" : "auto");
  const fallbackSrcSet = undefined;
  const fallbackSrc = normalizeSupabaseImageUrl(normalizedSrc);
  const computedStyle: CSSProperties = {
    ...style,
    ...(fit ? { objectFit: fit } : {}),
    ...(position ? { objectPosition: position } : {}),
  };

  return (
    <picture>
      <img
        src={fallbackSrc}
        srcSet={fallbackSrcSet}
        sizes={fallbackSrcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={computedLoading}
        decoding={decoding}
        fetchPriority={computedFetchPriority}
        className={cn(className)}
        style={computedStyle}
        {...rest}
      />
    </picture>
  );
}
