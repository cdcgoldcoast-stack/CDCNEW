import type { CSSProperties, ImgHTMLAttributes } from "react";
import {
  DEFAULT_RESPONSIVE_WIDTHS,
  buildSupabaseImageUrl,
  buildSupabaseSrcSet,
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
  fit?: "cover" | "contain";
  position?: CSSProperties["objectPosition"];
}

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
  quality: _quality = 72,
  responsiveWidths: _responsiveWidths = DEFAULT_RESPONSIVE_WIDTHS,
  style,
  fit,
  position,
  fetchPriority,
  ...rest
}: ResponsiveImageProps) => {
  if (!src) return null;
  const maxResponsiveWidth =
    _responsiveWidths.length > 0 ? Math.max(..._responsiveWidths) : width;
  const selectedSourceWidth = Math.max(width, maxResponsiveWidth);

  const computedLoading = loading ?? (priority ? "eager" : "lazy");
  const computedFetchPriority =
    fetchPriority ?? (priority ? "high" : computedLoading === "lazy" ? "low" : "auto");
  const fallbackSrcSet = buildSupabaseSrcSet(src, _responsiveWidths, { quality: _quality });
  const fallbackSrc = buildSupabaseImageUrl(src, {
    width: selectedSourceWidth,
    quality: _quality,
  });
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
};

export default ResponsiveImage;
