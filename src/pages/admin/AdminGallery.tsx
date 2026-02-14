import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, Upload, Image, Loader2, Type, Plus, Library, Check, Search } from "lucide-react";
import SEO from "@/components/SEO";
import { resolveImageUrl } from "@/lib/gallery-assets";

const BUCKET_NAME = "gallery-images";

interface GalleryItem {
  id: string;
  type: "image" | "text";
  image_url: string | null;
  alt_text: string | null;
  size: "large" | "small";
  ratio: "tall" | "wide" | "square";
  content: string | null;
  left_position: number;
  top_position: number;
  z_index: number;
  parallax_speed: number;
  width_percent: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Generate spread-out layout properties for a new gallery image
// Uses a 3-column staggered layout with proper vertical spacing
const generateRandomLayout = (existingItems: GalleryItem[], type: "image" | "text" = "image", batchIndex: number = 0) => {
  const sizes: Array<"large" | "small"> = ["large", "large", "large", "small"];
  const ratios: Array<"tall" | "wide" | "square"> = ["tall", "wide", "square", "tall", "square"];
  
  // Get max top position from existing items
  const imageItems = existingItems.filter(item => item.type === "image");
  const maxTop = imageItems.length > 0 
    ? Math.max(...imageItems.map(item => item.top_position)) 
    : 0;
  
  // Calculate which "row" this item belongs to (3 items per row)
  const totalImageCount = imageItems.length + batchIndex;
  const rowIndex = Math.floor(totalImageCount / 3);
  const colIndex = totalImageCount % 3;
  
  // Column positions: left (0-20%), center (35-55%), right (65-85%)
  const columnPositions = [
    3 + Math.floor(Math.random() * 18),   // Left column
    35 + Math.floor(Math.random() * 18),  // Center column
    65 + Math.floor(Math.random() * 15),  // Right column
  ];
  
  if (type === "text") {
    return {
      type: "text" as const,
      left_position: 10 + Math.floor(Math.random() * 55),
      top_position: maxTop + 800 + Math.floor(Math.random() * 200),
      z_index: 18 + Math.floor(Math.random() * 5),
      parallax_speed: 0,
      width_percent: 25 + Math.floor(Math.random() * 20),
      display_order: existingItems.length + 1,
      is_active: true,
    };
  }
  
  // Base top position: each row is ~600px apart, with some randomness
  const baseTop = maxTop > 0 
    ? maxTop + 500 + Math.floor(Math.random() * 200) 
    : 200 + rowIndex * 600 + Math.floor(Math.random() * 150);
  
  return {
    type: "image" as const,
    size: sizes[Math.floor(Math.random() * sizes.length)],
    ratio: ratios[Math.floor(Math.random() * ratios.length)],
    left_position: columnPositions[colIndex],
    top_position: baseTop,
    z_index: 5 + Math.floor(Math.random() * 10),
    parallax_speed: Math.random() > 0.3 ? Math.round(Math.random() * 4 * 10) / 10 : 0,
    display_order: existingItems.length + 1 + batchIndex,
    is_active: true,
  };
};

const AdminGallery = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newTextContent, setNewTextContent] = useState("");
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

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

  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ["admin-gallery-items"],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  // Fetch all images from storage bucket
  const { data: storageImages, isLoading: loadingStorageImages } = useQuery({
    queryKey: ["storage-images-gallery"],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", {
        limit: 500,
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) throw error;
      return data.filter((file) => file.name && !file.name.endsWith("/"));
    },
  });

  const getStoragePublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const item = galleryItems?.find(i => i.id === id);
      
      if (item?.image_url?.includes('gallery-images')) {
        const path = item.image_url.split('gallery-images/')[1];
        if (path) {
          await supabase.storage.from('gallery-images').remove([path]);
        }
      }
      
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-items"] });
      toast.success("Item deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });

  const addTextMutation = useMutation({
    mutationFn: async (content: string) => {
      const layout = generateRandomLayout(galleryItems || [], "text");
      const { error } = await supabase
        .from("gallery_items")
        .insert([{
          ...layout,
          content,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-items"] });
      setNewTextContent("");
      toast.success("Text block added");
    },
    onError: (error) => {
      toast.error("Failed to add text: " + error.message);
    },
  });

  const addFromLibraryMutation = useMutation({
    mutationFn: async (imageUrls: string[]) => {
      const currentItems = galleryItems || [];
      const insertData = imageUrls.map((url, index) => {
        const layout = generateRandomLayout(currentItems, "image", index);
        return {
          ...layout,
          image_url: url,
          alt_text: "Gallery image",
        };
      });

      const { error } = await supabase.from("gallery_items").insert(insertData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-items"] });
      setSelectedImages(new Set());
      setShowLibraryDialog(false);
      toast.success("Images added to gallery");
    },
    onError: (error) => {
      toast.error("Failed to add images: " + error.message);
    },
  });

  const toggleImageSelection = (fileName: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  const addSelectedImages = () => {
    const urls = Array.from(selectedImages).map((fileName) => getStoragePublicUrl(fileName));
    if (urls.length > 0) {
      addFromLibraryMutation.mutate(urls);
    }
  };

  const uploadImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => f.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error("No image files selected");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    const currentItems = galleryItems || [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName);
        
        const layout = generateRandomLayout([...currentItems, ...Array(successCount).fill({})].map((_, idx) => ({
          ...currentItems[idx] || {},
          top_position: (currentItems[idx]?.top_position || 0) + (idx >= currentItems.length ? 800 * (idx - currentItems.length + 1) : 0)
        })) as GalleryItem[]);
        
        const { error: dbError } = await supabase
          .from("gallery_items")
          .insert([{
            ...layout,
            image_url: publicUrl,
            alt_text: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            display_order: currentItems.length + successCount + 1,
          }]);
        
        if (dbError) throw dbError;
        
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    setIsUploading(false);
    queryClient.invalidateQueries({ queryKey: ["admin-gallery-items"] });
    queryClient.invalidateQueries({ queryKey: ["storage-images-gallery"] });
    
    if (successCount > 0) {
      toast.success(`${successCount} image${successCount > 1 ? 's' : ''} added to gallery`);
    }
    if (successCount < imageFiles.length) {
      toast.error(`${imageFiles.length - successCount} image(s) failed to upload`);
    }
  }, [galleryItems, queryClient]);

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

  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTextContent.trim()) {
      addTextMutation.mutate(newTextContent.trim());
    }
  };

  const imageItems = galleryItems?.filter(item => item.type === "image") || [];
  const textItems = galleryItems?.filter(item => item.type === "text") || [];

  const filteredStorageImages = storageImages?.filter((file) =>
    file.name.toLowerCase().includes(librarySearch.toLowerCase())
  ) || [];

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin - Gallery" noIndex={true} />
      <AdminLayout>
        <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Upload images - positions are randomized automatically
          </p>
        </div>

        {/* Upload Zone + Library Button */}
        <div className="flex gap-4">
          <div
            className={cn(
              "flex-1 border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              isUploading && "opacity-50 pointer-events-none"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('gallery-upload')?.click()}
          >
            <input
              id="gallery-upload"
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
                <p className="text-lg font-medium">Uploading images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Drop images here or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload multiple images at once
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Library Button */}
          <Button
            variant="outline"
            size="lg"
            className="h-auto flex-col gap-2 px-8"
            onClick={() => setShowLibraryDialog(true)}
          >
            <Library className="w-8 h-8" />
            <span>From Library</span>
          </Button>
        </div>

        {/* Text Block Section */}
        <div className="border rounded-xl p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-medium">Text Blocks ({textItems.length})</h2>
          </div>
          
          <form onSubmit={handleAddText} className="flex gap-3 mb-4">
            <Input
              value={newTextContent}
              onChange={(e) => setNewTextContent(e.target.value)}
              placeholder="Enter text for gallery overlay..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!newTextContent.trim() || addTextMutation.isPending}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </form>

          {textItems.length > 0 && (
            <div className="space-y-2">
              {textItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group"
                >
                  <p className="text-sm line-clamp-2 flex-1 pr-4">{item.content}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : imageItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No images yet. Upload some to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {imageItems.map((item) => (
              <div
                key={item.id}
                className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={resolveImageUrl(item.image_url)}
                  alt={item.alt_text || "Gallery image"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                    {item.size}
                  </span>
                  <span className="text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                    {item.ratio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {imageItems.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            {imageItems.length} image{imageItems.length !== 1 ? 's' : ''} in gallery
          </p>
        )}
      </div>

      {/* Library Dialog */}
      <Dialog open={showLibraryDialog} onOpenChange={setShowLibraryDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Select from Library</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[50vh]">
            {loadingStorageImages ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStorageImages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No images found</p>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 pr-4">
                {filteredStorageImages.map((file) => {
                  const isSelected = selectedImages.has(file.name);
                  return (
                    <div
                      key={file.name}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                        isSelected ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-primary/50"
                      )}
                      onClick={() => toggleImageSelection(file.name)}
                    >
                      <img
                        src={getStoragePublicUrl(file.name)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {selectedImages.size > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedImages.size} image{selectedImages.size !== 1 ? 's' : ''} selected
              </p>
              <Button onClick={addSelectedImages} disabled={addFromLibraryMutation.isPending}>
                {addFromLibraryMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Selected
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
    </>
  );
};

export default AdminGallery;
