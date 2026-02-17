import type { CSSProperties, ImgHTMLAttributes } from "react";
import {
  DEFAULT_RESPONSIVE_WIDTHS,
  buildSupabaseImageUrl,
  buildSupabaseSrcSet,
  isSupabaseStorageUrl,
  type ModernImageFormat,
} from "@/lib/image-delivery";
import { cn } from "@/lib/utils";

type NativeImgProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "loading" | "decoding"
>;

interface ResponsiveImageProps extends NativeImgProps {
  src: string | null | undefined;
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

const ResponsiveImage = ({
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
}: ResponsiveImageProps) => {
  if (!src) return null;

  const isSupabaseImage = isSupabaseStorageUrl(src);
  const computedLoading = loading ?? (priority ? "eager" : "lazy");
  const computedFetchPriority =
    fetchPriority ?? (priority ? "high" : computedLoading === "lazy" ? "low" : "auto");

  const modernSrcSets = isSupabaseImage
    ? MODERN_FORMATS.map((format) => ({
        format,
        srcSet: buildSupabaseSrcSet(src, responsiveWidths, { format, quality }),
      })).filter((entry) => Boolean(entry.srcSet))
    : [];

  const fallbackSrcSet = isSupabaseImage
    ? buildSupabaseSrcSet(src, responsiveWidths, { quality })
    : undefined;

  const fallbackWidth = responsiveWidths[0] ?? width;
  const fallbackSrc = isSupabaseImage
    ? buildSupabaseImageUrl(src, { width: fallbackWidth, quality })
    : src;

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
};

export default ResponsiveImage;
