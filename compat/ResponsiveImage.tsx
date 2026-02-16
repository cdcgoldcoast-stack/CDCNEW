import type { CSSProperties, ImgHTMLAttributes } from "react";
import type { StaticImageData } from "next/image";
import {
  DEFAULT_RESPONSIVE_WIDTHS,
  buildSupabaseImageUrl,
  buildSupabaseSrcSet,
  isSupabaseStorageUrl,
  type ModernImageFormat,
} from "@/lib/image-delivery";
import { cn } from "@/lib/utils";

type NormalizedSrc = string | StaticImageData | null | undefined;

type NativeImgProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "loading" | "decoding"
>;

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
}

const MODERN_FORMATS: ModernImageFormat[] = ["avif", "webp"];

const resolveSrc = (src: NormalizedSrc): string | null => {
  if (!src) return null;
  if (typeof src === "string") return src;
  if (typeof src === "object" && typeof src.src === "string") return src.src;
  return null;
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
  quality = 72,
  responsiveWidths = DEFAULT_RESPONSIVE_WIDTHS,
  style,
  fetchPriority,
  ...rest
}: ResponsiveImageProps) {
  const normalizedSrc = resolveSrc(src);
  if (!normalizedSrc) return null;

  const isSupabaseImage = isSupabaseStorageUrl(normalizedSrc);
  const computedLoading = loading ?? (priority ? "eager" : "lazy");
  const computedFetchPriority = fetchPriority ?? (priority ? "high" : "auto");

  const modernSrcSets = isSupabaseImage
    ? MODERN_FORMATS.map((format) => ({
        format,
        srcSet: buildSupabaseSrcSet(normalizedSrc, responsiveWidths, { format, quality }),
      })).filter((entry) => Boolean(entry.srcSet))
    : [];

  const fallbackSrcSet = isSupabaseImage
    ? buildSupabaseSrcSet(normalizedSrc, responsiveWidths, { quality })
    : undefined;

  const fallbackWidth = Math.max(width, responsiveWidths[0] ?? width);
  const fallbackSrc = isSupabaseImage
    ? buildSupabaseImageUrl(normalizedSrc, { width: fallbackWidth, quality })
    : normalizedSrc;

  return (
    <picture>
      {modernSrcSets.map((entry) => (
        <source
          key={entry.format}
          type={`image/${entry.format}`}
          srcSet={entry.srcSet}
          sizes={sizes}
        />
      ))}
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
        style={style}
        {...rest}
      />
    </picture>
  );
}
