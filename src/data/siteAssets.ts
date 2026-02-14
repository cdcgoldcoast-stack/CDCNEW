// Central registry of all site image assets
// This allows the admin to see and replace any image used on the site

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
import heroBg from "@/assets/hero-bg.webp";
import lifestageForever from "@/assets/lifestage-forever.jpg";
import lifestageFuture from "@/assets/lifestage-future.jpg";
import lifestageGrowing from "@/assets/lifestage-growing.jpg";
import lifestageWellness from "@/assets/lifestage-wellness.jpg";
import lifestyleBathroom from "@/assets/lifestyle-bathroom.jpg";
import lifestyleCalm from "@/assets/lifestyle-calm.jpg";
import lifestyleMorning from "@/assets/lifestyle-morning.jpg";
import lifestyleMovement from "@/assets/lifestyle-movement.jpg";
import lifestyleStorage from "@/assets/lifestyle-storage.jpg";
import logo from "@/assets/logo.webp";
import serviceBathroom from "@/assets/service-bathroom.jpg";
import serviceBgBathroom from "@/assets/service-bg-bathroom.jpg";
import serviceBgExtensions from "@/assets/service-bg-extensions.jpg";
import serviceBgKitchen from "@/assets/service-bg-kitchen.jpg";
import serviceBgLiving from "@/assets/service-bg-living.jpg";
import serviceBgWholeHome from "@/assets/service-bg-whole-home.jpg";
import serviceExtensions from "@/assets/service-extensions.jpg";
import serviceKitchen from "@/assets/service-kitchen.jpg";
import serviceLiving from "@/assets/service-living.jpg";
import serviceWholeHome from "@/assets/service-whole-home.jpg";

export interface SiteAsset {
  id: string;
  path: string;
  importedUrl: string;
  label: string;
  category: "editorial" | "hero" | "lifestage" | "lifestyle" | "logo" | "service";
}

export const siteAssets: SiteAsset[] = [
  // Hero
  { id: "hero-bg", path: "hero-bg.jpg", importedUrl: heroBg, label: "Hero Background", category: "hero" },
  
  // Logo
  { id: "logo", path: "logo.webp", importedUrl: logo, label: "Site Logo", category: "logo" },
  
  // Editorial images (Gallery)
  { id: "editorial-1", path: "editorial-1.jpg", importedUrl: editorial1, label: "Editorial 1", category: "editorial" },
  { id: "editorial-2", path: "editorial-2.jpg", importedUrl: editorial2, label: "Editorial 2", category: "editorial" },
  { id: "editorial-3", path: "editorial-3.jpg", importedUrl: editorial3, label: "Editorial 3", category: "editorial" },
  { id: "editorial-4", path: "editorial-4.jpg", importedUrl: editorial4, label: "Editorial 4", category: "editorial" },
  { id: "editorial-5", path: "editorial-5.jpg", importedUrl: editorial5, label: "Editorial 5", category: "editorial" },
  { id: "editorial-6", path: "editorial-6.jpg", importedUrl: editorial6, label: "Editorial 6", category: "editorial" },
  { id: "editorial-7", path: "editorial-7.jpg", importedUrl: editorial7, label: "Editorial 7", category: "editorial" },
  { id: "editorial-8", path: "editorial-8.jpg", importedUrl: editorial8, label: "Editorial 8", category: "editorial" },
  { id: "editorial-9", path: "editorial-9.jpg", importedUrl: editorial9, label: "Editorial 9", category: "editorial" },
  { id: "editorial-10", path: "editorial-10.jpg", importedUrl: editorial10, label: "Editorial 10", category: "editorial" },
  
  // Lifestage images
  { id: "lifestage-forever", path: "lifestage-forever.jpg", importedUrl: lifestageForever, label: "Forever Home", category: "lifestage" },
  { id: "lifestage-future", path: "lifestage-future.jpg", importedUrl: lifestageFuture, label: "Future Ready", category: "lifestage" },
  { id: "lifestage-growing", path: "lifestage-growing.jpg", importedUrl: lifestageGrowing, label: "Growing Family", category: "lifestage" },
  { id: "lifestage-wellness", path: "lifestage-wellness.jpg", importedUrl: lifestageWellness, label: "Wellness Focus", category: "lifestage" },
  
  // Lifestyle images
  { id: "lifestyle-bathroom", path: "lifestyle-bathroom.jpg", importedUrl: lifestyleBathroom, label: "Bathroom Lifestyle", category: "lifestyle" },
  { id: "lifestyle-calm", path: "lifestyle-calm.jpg", importedUrl: lifestyleCalm, label: "Calm Atmosphere", category: "lifestyle" },
  { id: "lifestyle-morning", path: "lifestyle-morning.jpg", importedUrl: lifestyleMorning, label: "Morning Routine", category: "lifestyle" },
  { id: "lifestyle-movement", path: "lifestyle-movement.jpg", importedUrl: lifestyleMovement, label: "Movement Space", category: "lifestyle" },
  { id: "lifestyle-storage", path: "lifestyle-storage.jpg", importedUrl: lifestyleStorage, label: "Storage Solutions", category: "lifestyle" },
  
  // Service images
  { id: "service-bathroom", path: "service-bathroom.jpg", importedUrl: serviceBathroom, label: "Bathroom Service", category: "service" },
  { id: "service-bg-bathroom", path: "service-bg-bathroom.jpg", importedUrl: serviceBgBathroom, label: "Bathroom Background", category: "service" },
  { id: "service-bg-extensions", path: "service-bg-extensions.jpg", importedUrl: serviceBgExtensions, label: "Extensions Background", category: "service" },
  { id: "service-bg-kitchen", path: "service-bg-kitchen.jpg", importedUrl: serviceBgKitchen, label: "Kitchen Background", category: "service" },
  { id: "service-bg-living", path: "service-bg-living.jpg", importedUrl: serviceBgLiving, label: "Living Background", category: "service" },
  { id: "service-bg-whole-home", path: "service-bg-whole-home.jpg", importedUrl: serviceBgWholeHome, label: "Whole Home Background", category: "service" },
  { id: "service-extensions", path: "service-extensions.jpg", importedUrl: serviceExtensions, label: "Extensions Service", category: "service" },
  { id: "service-kitchen", path: "service-kitchen.jpg", importedUrl: serviceKitchen, label: "Kitchen Service", category: "service" },
  { id: "service-living", path: "service-living.jpg", importedUrl: serviceLiving, label: "Living Service", category: "service" },
  { id: "service-whole-home", path: "service-whole-home.jpg", importedUrl: serviceWholeHome, label: "Whole Home Service", category: "service" },
];

// Category labels for display
export const categoryLabels: Record<SiteAsset["category"], string> = {
  hero: "Hero",
  logo: "Logo",
  editorial: "Editorial / Gallery",
  lifestage: "Life Stages",
  lifestyle: "Lifestyle",
  service: "Services",
};
