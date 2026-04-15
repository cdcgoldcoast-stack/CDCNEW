import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type GalleryItemRow = Database["public"]["Tables"]["gallery_items"]["Row"];

export const fetchGalleryItems = async (): Promise<GalleryItemRow[]> => {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
  return (data ?? []) as GalleryItemRow[];
};
