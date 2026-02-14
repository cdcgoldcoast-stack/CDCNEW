import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, Upload, Loader2, Copy, Check, Search, FolderOpen } from "lucide-react";
import SEO from "@/components/SEO";

// Clean filename: remove trailing timestamps (e.g., -1770235824347) and clean up
const cleanFileName = (name: string): string => {
  // Remove extension first
  const baseName = name.replace(/\.[^/.]+$/, "");
  // Remove trailing timestamp-like numbers (13+ digits, often with leading dash)
  const withoutTimestamp = baseName.replace(/-?\d{10,}$/, "");
  // Clean special chars and multiple dashes
  return withoutTimestamp
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Display name without extension
const displayName = (fileName: string): string => {
  return fileName.replace(/\.[^/.]+$/, "");
};

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

const BUCKET_NAME = "gallery-images";
const WEBP_QUALITY = 0.85;

// Convert image file to WebP using Canvas API
const convertToWebP = (file: File): Promise<{ blob: Blob; originalSize: number }> => {
  return new Promise((resolve, reject) => {
    // If already WebP, return as-is
    if (file.type === "image/webp") {
      resolve({ blob: file, originalSize: file.size });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, originalSize: file.size });
          } else {
            reject(new Error("Failed to convert to WebP"));
          }
        },
        "image/webp",
        WEBP_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

const AdminSiteImages = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  // Fetch all images from storage bucket
  const { data: images, isLoading } = useQuery({
    queryKey: ["site-images"],
    enabled: !!user && isAuthorized,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", {
          limit: 500,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;
      
      // Filter out folders and get only image files
      return (data || []).filter(
        (file) => file.name && !file.name.endsWith("/") && file.metadata
      ) as unknown as StorageFile[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-images"] });
      toast.success("Image deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });

  const uploadImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("No image files selected");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let totalSaved = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgress(`Converting ${i + 1}/${imageFiles.length}: ${file.name}`);

      const baseName = cleanFileName(file.name);
      const fileName = `${baseName}.webp`;

      try {
        // Convert to WebP
        const { blob, originalSize } = await convertToWebP(file);
        totalSaved += originalSize - blob.size;

        setUploadProgress(`Uploading ${i + 1}/${imageFiles.length}: ${fileName}`);

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, blob, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    setIsUploading(false);
    setUploadProgress("");
    queryClient.invalidateQueries({ queryKey: ["site-images"] });

    if (successCount > 0) {
      const savedKB = Math.round(totalSaved / 1024);
      const savedMsg = savedKB > 0 ? ` (saved ${savedKB}KB)` : "";
      toast.success(`${successCount} image${successCount > 1 ? "s" : ""} converted to WebP & uploaded${savedMsg}`);
    }
    if (successCount < imageFiles.length) {
      toast.error(`${imageFiles.length - successCount} image(s) failed to upload`);
    }
  }, [queryClient]);

  // Rename existing files to remove timestamps
  const renameExistingFiles = async () => {
    if (!images || images.length === 0) {
      toast.error("No images to rename");
      return;
    }

    // Find files with timestamps
    const filesToRename = images.filter((file) => {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      // Check if name ends with 10+ digit number (timestamp pattern)
      return /-?\d{10,}$/.test(baseName);
    });

    if (filesToRename.length === 0) {
      toast.info("No files with timestamps found");
      return;
    }

    setIsRenaming(true);
    let successCount = 0;

    for (const file of filesToRename) {
      const ext = file.name.match(/\.[^/.]+$/)?.[0] || ".webp";
      const newName = `${cleanFileName(file.name)}${ext}`;

      if (newName === file.name) continue;

      try {
        // Download file
        const { data: downloadData, error: downloadError } = await supabase.storage
          .from(BUCKET_NAME)
          .download(file.name);

        if (downloadError || !downloadData) {
          console.error(`Failed to download ${file.name}:`, downloadError);
          continue;
        }

        // Upload with new name
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(newName, downloadData, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Failed to upload ${newName}:`, uploadError);
          continue;
        }

        // Delete old file
        await supabase.storage.from(BUCKET_NAME).remove([file.name]);
        successCount++;
      } catch (error) {
        console.error(`Failed to rename ${file.name}:`, error);
      }
    }

    setIsRenaming(false);
    queryClient.invalidateQueries({ queryKey: ["site-images"] });

    if (successCount > 0) {
      toast.success(`Renamed ${successCount} file${successCount > 1 ? "s" : ""}`);
    }
  };

  // Count files with timestamps
  const filesWithTimestamps = images?.filter((file) => {
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return /-?\d{10,}$/.test(baseName);
  }).length || 0;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      uploadImages(e.dataTransfer.files);
    }
  }, [uploadImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadImages(e.target.files);
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileSize = (metadata: Record<string, unknown> | null): number => {
    if (!metadata) return 0;
    const size = metadata.size;
    return typeof size === "number" ? size : 0;
  };

  // Filter images based on search query
  const filteredImages = images?.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin - Site Images" noIndex={true} />
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-serif text-foreground">Site Images</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage images for use across the site. Click any image to copy its URL.
            </p>
            {filesWithTimestamps > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={renameExistingFiles}
                disabled={isRenaming}
              >
                {isRenaming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Renaming...
                  </>
                ) : (
                  `Clean ${filesWithTimestamps} filename${filesWithTimestamps > 1 ? "s" : ""} with timestamps`
                )}
              </Button>
            )}
          </div>

          {/* Upload Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
              isUploading && "opacity-50 pointer-events-none"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("site-image-upload")?.click()}
          >
            <input
              id="site-image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium">Converting to WebP & uploading...</p>
                  {uploadProgress && (
                    <p className="text-sm text-muted-foreground mt-1">{uploadProgress}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    Drop images here or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    All images auto-converted to WebP for optimal performance
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by name..."
              className="pl-10"
            />
          </div>

          {/* Image Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredImages?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>
                {searchQuery
                  ? "No images match your search."
                  : "No images yet. Upload some to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages?.map((file) => {
                const url = getPublicUrl(file.name);
                const isCopied = copiedUrl === url;

                return (
                  <div
                    key={file.id}
                    className="group relative rounded-lg overflow-hidden bg-muted border border-border hover:border-primary/50 transition-colors"
                  >
                    {/* Image */}
                    <div className="aspect-square">
                      <img
                        src={url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => copyToClipboard(url)}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy URL
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => deleteMutation.mutate(file.name)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>

                    {/* File info */}
                    <div className="p-2 border-t border-border bg-card">
                      <p className="text-xs font-medium truncate" title={file.name}>
                        {displayName(file.name)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(getFileSize(file.metadata))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredImages && filteredImages.length > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""} in storage
            </p>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminSiteImages;
