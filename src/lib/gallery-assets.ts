// Shared gallery asset resolution utilities
// Used by both Gallery.tsx and admin/AdminGallery.tsx

import editorial1 from "@/assets/editorial-1.webp";
import editorial2 from "@/assets/editorial-2.webp";
import editorial3 from "@/assets/editorial-3.webp";
import editorial4 from "@/assets/editorial-4.webp";
import editorial5 from "@/assets/editorial-5.webp";
import editorial6 from "@/assets/editorial-6.webp";
import editorial7 from "@/assets/editorial-7.webp";
import editorial8 from "@/assets/editorial-8.webp";
import editorial9 from "@/assets/editorial-9.webp";
import editorial10 from "@/assets/editorial-10.webp";

type ImageSource = string | { readonly src: string };

// Mapping from legacy DB paths to actual imports
export const assetMap: Record<string, ImageSource> = {
  "/src/assets/editorial-1.jpg": editorial1,
  "/src/assets/editorial-1.webp": editorial1,
  "/src/assets/editorial-2.jpg": editorial2,
  "/src/assets/editorial-2.webp": editorial2,
  "/src/assets/editorial-3.jpg": editorial3,
  "/src/assets/editorial-3.webp": editorial3,
  "/src/assets/editorial-4.jpg": editorial4,
  "/src/assets/editorial-4.webp": editorial4,
  "/src/assets/editorial-5.jpg": editorial5,
  "/src/assets/editorial-5.webp": editorial5,
  "/src/assets/editorial-6.jpg": editorial6,
  "/src/assets/editorial-6.webp": editorial6,
  "/src/assets/editorial-7.jpg": editorial7,
  "/src/assets/editorial-7.webp": editorial7,
  "/src/assets/editorial-8.jpg": editorial8,
  "/src/assets/editorial-8.webp": editorial8,
  "/src/assets/editorial-9.jpg": editorial9,
  "/src/assets/editorial-9.webp": editorial9,
  "/src/assets/editorial-10.jpg": editorial10,
  "/src/assets/editorial-10.webp": editorial10,
};

// Resolve image URL without substituting fallback imagery.
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const mapped = assetMap[url];
  if (mapped) return typeof mapped === "string" ? mapped : mapped.src;
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:image/")) return url;
  return null;
}
