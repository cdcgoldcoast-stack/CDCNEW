import type { CSSProperties, ImgHTMLAttributes } from "react";
import type { StaticImageData } from "next/image";
import {
  DEFAULT_RESPONSIVE_WIDTHS,
  buildSupabaseImageUrl,
  buildSupabaseSrcSet,
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
  useSupabaseTransform?: boolean;
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
  useSupabaseTransform = false,
  style,
  fit,
  position,
  fetchPriority,
  ...rest
}: ResponsiveImageProps) {
  const normalizedSrc = resolveSrc(src);
  if (!normalizedSrc) return null;
  const maxResponsiveWidth =
    _responsiveWidths.length > 0 ? Math.max(..._responsiveWidths) : width;
  const selectedSourceWidth = Math.max(width, maxResponsiveWidth);

  const computedLoading = loading ?? (priority ? "eager" : "lazy");
  const computedFetchPriority =
    fetchPriority ?? (priority ? "high" : computedLoading === "lazy" ? "low" : "auto");
  const fallbackSrcSet = useSupabaseTransform
    ? buildSupabaseSrcSet(normalizedSrc, _responsiveWidths, { quality: _quality })
    : undefined;
  const fallbackSrc = useSupabaseTransform
    ? buildSupabaseImageUrl(normalizedSrc, {
        width: selectedSourceWidth,
        quality: _quality,
      })
    : normalizedSrc;
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
