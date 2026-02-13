 // Shared gallery asset resolution utilities
 // Used by both Gallery.tsx and admin/AdminGallery.tsx
 
 import editorial1 from "@/assets/editorial-1.jpg";
 import editorial2 from "@/assets/editorial-2.jpg";
 import editorial3 from "@/assets/editorial-3.jpg";
 import editorial4 from "@/assets/editorial-4.jpg";
 import editorial5 from "@/assets/editorial-5.jpg";
 import editorial6 from "@/assets/editorial-6.jpg";
 import editorial7 from "@/assets/editorial-7.jpg";
 import editorial8 from "@/assets/editorial-8.jpg";
 import editorial9 from "@/assets/editorial-9.jpg";
 import editorial10 from "@/assets/editorial-10.jpg";
 
 // Mapping from DB paths to actual imports
 export const assetMap: Record<string, string> = {
   "/src/assets/editorial-1.jpg": editorial1,
   "/src/assets/editorial-2.jpg": editorial2,
   "/src/assets/editorial-3.jpg": editorial3,
   "/src/assets/editorial-4.jpg": editorial4,
   "/src/assets/editorial-5.jpg": editorial5,
   "/src/assets/editorial-6.jpg": editorial6,
   "/src/assets/editorial-7.jpg": editorial7,
   "/src/assets/editorial-8.jpg": editorial8,
   "/src/assets/editorial-9.jpg": editorial9,
   "/src/assets/editorial-10.jpg": editorial10,
 };
 
 // Default fallback image
 export const defaultImage = editorial1;
 
 // Helper to resolve image URL from DB or fallback
 export function resolveImageUrl(url: string | null): string {
   if (!url) return defaultImage;
   if (assetMap[url]) return assetMap[url];
   if (url.startsWith("http")) return url;
   return defaultImage;
 }
 
 // Fallback gallery items for public gallery
 export const fallbackGalleryItems = [
   { id: "1", src: editorial1, alt: "Modern bathroom renovation" },
   { id: "2", src: editorial2, alt: "Elegant kitchen design" },
   { id: "3", src: editorial3, alt: "Living space transformation" },
   { id: "4", src: editorial4, alt: "Contemporary finishes" },
   { id: "5", src: editorial5, alt: "Luxury bathroom" },
   { id: "6", src: editorial6, alt: "Kitchen details" },
   { id: "7", src: editorial7, alt: "Open plan living" },
   { id: "8", src: editorial8, alt: "Bathroom tiles" },
   { id: "9", src: editorial9, alt: "Kitchen island" },
   { id: "10", src: editorial10, alt: "Living room" },
 ];