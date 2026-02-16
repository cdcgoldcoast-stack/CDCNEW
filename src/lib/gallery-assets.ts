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
 
 // Mapping from DB paths to actual imports
 export const assetMap: Record<string, string> = {
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
  { id: "1", src: editorial1, alt: "Gold Coast bathroom renovation with warm timber and stone finishes" },
  { id: "2", src: editorial2, alt: "Gold Coast kitchen renovation with integrated storage and soft lighting" },
  { id: "3", src: editorial3, alt: "Open-plan living renovation designed for better everyday flow" },
  { id: "4", src: editorial4, alt: "Contemporary Gold Coast renovation styling with layered textures" },
  { id: "5", src: editorial5, alt: "Luxury bathroom renovation featuring premium fixtures and natural tones" },
  { id: "6", src: editorial6, alt: "Kitchen renovation detail showing joinery, splashback, and benchtop finishes" },
  { id: "7", src: editorial7, alt: "Whole-home renovation concept with connected living and dining zones" },
  { id: "8", src: editorial8, alt: "Gold Coast bathroom tile palette for a calm modern design direction" },
  { id: "9", src: editorial9, alt: "Kitchen island renovation inspiration with practical family seating" },
  { id: "10", src: editorial10, alt: "Renovated living room with balanced light, layout, and storage" },
];
