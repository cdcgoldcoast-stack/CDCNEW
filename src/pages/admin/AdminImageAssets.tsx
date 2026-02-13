import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Replace,
  Loader2,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  FolderOpen,
} from "lucide-react";
import SEO from "@/components/SEO";
import { siteAssets, categoryLabels, SiteAsset } from "@/data/siteAssets";

// Display name without extension
const displayName = (fileName: string): string => {
  return fileName.replace(/\.[^/.]+$/, "");
};

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageOverride {
  id: string;
  original_path: string;
  override_url: string;
}

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

const BUCKET_NAME = "gallery-images";

const AdminImageAssets = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["hero", "logo", "service"])
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SiteAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast.error("You don't have admin permissions.");
      navigate("/");
    }
  }, [isAdmin, loading, user, navigate]);

  // Fetch current overrides
  const { data: overrides, isLoading: loadingOverrides } = useQuery({
    queryKey: ["image-overrides"],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("image_overrides")
        .select("*")
        .order("original_path");

      if (error) throw error;
      return data as ImageOverride[];
    },
  });

  // Fetch available site images from storage
  const { data: siteImages, isLoading: loadingSiteImages } = useQuery({
    queryKey: ["site-images"],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", {
          limit: 500,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      return (data || []).filter(
        (file) => file.name && !file.name.endsWith("/") && file.metadata
      ) as unknown as StorageFile[];
    },
  });

  // Create/update override
  const upsertMutation = useMutation({
    mutationFn: async ({
      originalPath,
      overrideUrl,
    }: {
      originalPath: string;
      overrideUrl: string;
    }) => {
      const { error } = await supabase.from("image_overrides").upsert(
        {
          original_path: originalPath,
          override_url: overrideUrl,
        },
        { onConflict: "original_path" }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image-overrides"] });
      toast.success("Image replaced successfully");
      setPickerOpen(false);
      setSelectedAsset(null);
    },
    onError: (error) => {
      toast.error("Failed to replace image: " + error.message);
    },
  });


  const getOverrideForAsset = (asset: SiteAsset): ImageOverride | undefined => {
    return overrides?.find((o) => o.original_path === asset.path);
  };

  const getCurrentImageUrl = (asset: SiteAsset): string => {
    const override = getOverrideForAsset(asset);
    return override?.override_url || asset.importedUrl;
  };

  const getPublicUrl = (fileName: string): string => {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleReplaceClick = (asset: SiteAsset) => {
    setSelectedAsset(asset);
    setSearchQuery("");
    setPickerOpen(true);
  };

  const handleSelectImage = (fileName: string) => {
    if (!selectedAsset) return;

    const url = getPublicUrl(fileName);
    upsertMutation.mutate({
      originalPath: selectedAsset.path,
      overrideUrl: url,
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Group assets by category
  const assetsByCategory = siteAssets.reduce(
    (acc, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = [];
      }
      acc[asset.category].push(asset);
      return acc;
    },
    {} as Record<string, SiteAsset[]>
  );

  const categoryOrder: SiteAsset["category"][] = [
    "hero",
    "logo",
    "service",
    "lifestyle",
    "lifestage",
    "editorial",
  ];

  // Filter site images based on search
  const filteredSiteImages = siteImages?.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin - Image Assets" noIndex={true} />
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-serif text-foreground">Image Assets</h1>
            <p className="text-muted-foreground mt-1">
              Replace site images with uploads from Site Images. Changes apply immediately.
            </p>
          </div>

          {loadingOverrides ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {categoryOrder.map((category) => {
                const assets = assetsByCategory[category];
                if (!assets) return null;

                const isExpanded = expandedCategories.has(category);
                const overrideCount = assets.filter((a) =>
                  getOverrideForAsset(a)
                ).length;

                return (
                  <Collapsible
                    key={category}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-medium">
                            {categoryLabels[category]}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({assets.length} images)
                          </span>
                        </div>
                        {overrideCount > 0 && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {overrideCount} replaced
                          </span>
                        )}
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 px-2">
                        {assets.map((asset) => {
                          const override = getOverrideForAsset(asset);
                          const currentUrl = getCurrentImageUrl(asset);

                          return (
                            <div
                              key={asset.id}
                              className={cn(
                                "group relative rounded-lg overflow-hidden border transition-colors",
                                override
                                  ? "border-primary/50 bg-primary/5"
                                  : "border-border bg-card"
                              )}
                            >
                              {/* Image preview */}
                              <div className="aspect-[4/3] relative">
                                <img
                                  src={currentUrl}
                                  alt={asset.label}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />

                                {/* Override indicator */}
                                {override && (
                                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                    <Check className="w-3 h-3" />
                                  </div>
                                )}

                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => handleReplaceClick(asset)}
                                  >
                                    <Replace className="w-4 h-4" />
                                    Replace
                                  </Button>
                                </div>
                              </div>

                              {/* Label */}
                              <div className="p-2 border-t border-border">
                                <p className="text-xs font-medium truncate">
                                  {asset.label}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {asset.path}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          )}

          {/* Summary */}
          {overrides && overrides.length > 0 && (
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              {overrides.length} image{overrides.length !== 1 ? "s" : ""}{" "}
              currently replaced
            </div>
          )}
        </div>

        {/* Image Picker Dialog */}
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>
                  Select replacement for:{" "}
                  <span className="text-primary">{selectedAsset?.label}</span>
                </span>
              </DialogTitle>
            </DialogHeader>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto mt-4">
              {loadingSiteImages ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : !filteredSiteImages || filteredSiteImages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>
                    {searchQuery
                      ? "No images match your search."
                      : "No images available. Upload images in Site Images first."}
                  </p>
                  {!searchQuery && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setPickerOpen(false);
                        window.location.href = "/admin/site-images";
                      }}
                    >
                      Go to Site Images
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredSiteImages.map((file) => {
                    const url = getPublicUrl(file.name);

                    return (
                      <button
                        key={file.id}
                        onClick={() => handleSelectImage(file.name)}
                        disabled={upsertMutation.isPending}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <img
                          src={url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-[10px] text-white truncate">
                            {displayName(file.name)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {filteredSiteImages && filteredSiteImages.length > 0 && (
              <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                {filteredSiteImages.length} image
                {filteredSiteImages.length !== 1 ? "s" : ""} available
              </p>
            )}
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
};

export default AdminImageAssets;
