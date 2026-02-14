import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Sparkles,
  Image,
  X,
  Star,
  Pencil,
  Eye,
  Save,
  Send,
  ChevronLeft,
  ChevronRight,
  Library,
  Search,
  Loader2,
} from "lucide-react";
import ContentRefinementButtons from "@/components/admin/ContentRefinementButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import { siteAssets, categoryLabels, type SiteAsset } from "@/data/siteAssets";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import { generateSlug } from "@/lib/slug";

const BUCKET_NAME = "gallery-images";

interface ProjectImage {
  id?: string;
  file?: File;
  preview: string;
  image_url?: string;
  is_featured: boolean;
  display_order: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  year: number;
  duration: string;
  overview: string;
  challenge: string;
  solution: string;
  is_published: boolean;
  images: ProjectImage[];
}

const AdminProjects = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { assets: resolvedAssets, ready: assetsReady } = useSiteAssets();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState<string | null>(null);
  const [previousContent, setPreviousContent] = useState<{
    overview: string | null;
    challenge: string | null;
    solution: string | null;
  }>({ overview: null, challenge: null, solution: null });
  const [saving, setSaving] = useState(false);
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<SiteAsset["category"] | "all">("all");
  const [libraryTab, setLibraryTab] = useState<"uploaded" | "site-assets">("uploaded");
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedStorageImages, setSelectedStorageImages] = useState<Set<string>>(new Set());
  const [selectedSiteAssets, setSelectedSiteAssets] = useState<Set<string>>(new Set());
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryValue, setCustomCategoryValue] = useState("");
  // Fetch images from storage bucket
  const { data: storageImages, isLoading: loadingStorageImages } = useQuery({
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
      );
    },
  });

  const getStoragePublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    roughDescription: "",
    description: "",
    category: "kitchen" as string,
    location: "",
    year: new Date().getFullYear(),
    duration: "",
    overview: "",
    challenge: "",
    solution: "",
  });
  const [images, setImages] = useState<ProjectImage[]>([]);

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

  useEffect(() => {
    if (isAdmin && user) {
      fetchProjects();
    }
  }, [isAdmin, user]);

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      const projectsWithImages = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: imagesData } = await supabase
            .from("project_images")
            .select("*")
            .eq("project_id", project.id)
            .order("display_order");

          return {
            ...project,
            images: (imagesData || []).map((img) => ({
              id: img.id,
              preview: img.image_url,
              image_url: img.image_url,
              is_featured: img.is_featured,
              display_order: img.display_order,
            })),
          };
        })
      );

      setProjects(projectsWithImages);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!formData.roughDescription.trim()) {
      toast.error("Please enter a rough description first");
      return;
    }

    setGenerating(true);
    try {
      const response = await supabase.functions.invoke(
        "generate-project-content",
        {
          body: {
            description: formData.roughDescription,
            projectName: formData.name,
          },
        }
      );

      if (response.error) throw response.error;

      const content = response.data;
      setFormData((prev) => ({
        ...prev,
        overview: content.overview || "",
        challenge: content.challenge || "",
        solution: content.solution || "",
      }));

      toast.success("AI has generated the overview, challenge, and solution sections.");
    } catch (error: unknown) {
      console.error("Error generating content:", error);
      const message = error instanceof Error ? error.message : "Failed to generate content";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleRefineContent = async (
    field: "overview" | "challenge" | "solution",
    action: string,
    customPrompt?: string
  ) => {
    const currentContent = formData[field];
    if (!currentContent.trim()) {
      toast.error(`Please generate or write ${field} content first.`);
      return;
    }

    setPreviousContent((prev) => ({
      ...prev,
      [field]: currentContent,
    }));

    setRefining(field);
    try {
      const response = await supabase.functions.invoke("refine-content", {
        body: {
          content: currentContent,
          action,
          customPrompt,
          fieldName: field,
        },
      });

      if (response.error) throw response.error;

      const refinedContent = response.data?.content;
      if (refinedContent) {
        setFormData((prev) => ({
          ...prev,
          [field]: refinedContent,
        }));

        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} has been updated.`);
      }
    } catch (error: unknown) {
      console.error("Error refining content:", error);
      setPreviousContent((prev) => ({
        ...prev,
        [field]: null,
      }));
      const message = error instanceof Error ? error.message : "Failed to refine content";
      toast.error(message);
    } finally {
      setRefining(null);
    }
  };

  const handleUndoRefine = (field: "overview" | "challenge" | "solution") => {
    const previous = previousContent[field];
    if (previous) {
      setFormData((prev) => ({
        ...prev,
        [field]: previous,
      }));
      setPreviousContent((prev) => ({
        ...prev,
        [field]: null,
      }));
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} restored to previous version.`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ProjectImage[] = Array.from(files).map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      is_featured: false,
      display_order: images.length + index,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const toggleStorageImageSelection = (fileName: string) => {
    setSelectedStorageImages((prev) => {
      const next = new Set(prev);
      if (next.has(fileName)) {
        next.delete(fileName);
      } else {
        next.add(fileName);
      }
      return next;
    });
  };

  const toggleSiteAssetSelection = (assetId: string) => {
    setSelectedSiteAssets((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  };

  const addSelectedImages = () => {
    const newImages: ProjectImage[] = [];
    let currentOrder = images.length;

    // Add selected storage images
    selectedStorageImages.forEach((fileName) => {
      const imageUrl = getStoragePublicUrl(fileName);
      newImages.push({
        preview: imageUrl,
        image_url: imageUrl,
        is_featured: false,
        display_order: currentOrder++,
      });
    });

    // Add selected site assets
    selectedSiteAssets.forEach((assetId) => {
      const asset = siteAssets.find((a) => a.id === assetId);
      if (asset) {
        const imageUrl = resolvedAssets[asset.id] || asset.importedUrl;
        newImages.push({
          preview: imageUrl,
          image_url: imageUrl,
          is_featured: false,
          display_order: currentOrder++,
        });
      }
    });

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`Added ${newImages.length} image${newImages.length > 1 ? "s" : ""}`);
    }

    // Reset selections and close dialog
    setSelectedStorageImages(new Set());
    setSelectedSiteAssets(new Set());
    setShowLibraryDialog(false);
  };

  const clearLibrarySelections = () => {
    setSelectedStorageImages(new Set());
    setSelectedSiteAssets(new Set());
  };

  const toggleFeatured = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_featured: i === index ? !img.is_featured : img.is_featured,
      }))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;

    setImages((prev) => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages.map((img, i) => ({ ...img, display_order: i }));
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      roughDescription: "",
      description: "",
      category: "kitchen",
      location: "",
      year: new Date().getFullYear(),
      duration: "",
      overview: "",
      challenge: "",
      solution: "",
    });
    setImages([]);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      roughDescription: "",
      description: project.description || "",
      category: project.category,
      location: project.location || "",
      year: project.year || new Date().getFullYear(),
      duration: project.duration || "",
      overview: project.overview || "",
      challenge: project.challenge || "",
      solution: project.solution || "",
    });
    setImages(
      project.images.map((img, index) => ({
        ...img,
        preview: img.image_url || img.preview,
        display_order: index,
      }))
    );
    setShowForm(true);
  };

  const handleSubmit = async (
    e: React.FormEvent,
    shouldPublish: boolean = false
  ) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name required");
      return;
    }

    if (shouldPublish && images.length === 0) {
      toast.error("At least one image required to publish");
      return;
    }

    setSaving(true);
    try {
      let projectId: string;

      if (editingProject) {
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            location: formData.location,
            year: formData.year,
            duration: formData.duration,
            overview: formData.overview,
            challenge: formData.challenge,
            solution: formData.solution,
            is_published: shouldPublish ? true : editingProject.is_published,
          })
          .eq("id", editingProject.id);

        if (updateError) throw updateError;
        projectId = editingProject.id;

        const existingImageIds = images
          .filter((img) => img.id)
          .map((img) => img.id);
        const { error: deleteError } = await supabase
          .from("project_images")
          .delete()
          .eq("project_id", projectId)
          .not("id", "in", `(${existingImageIds.join(",") || "''"})`);

        if (deleteError) console.error("Error deleting old images:", deleteError);
      } else {
        const { data: project, error: projectError } = await supabase
          .from("projects")
          .insert({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            location: formData.location,
            year: formData.year,
            duration: formData.duration,
            overview: formData.overview,
            challenge: formData.challenge,
            solution: formData.solution,
            is_published: shouldPublish,
          })
          .select()
          .single();

        if (projectError) throw projectError;
        projectId = project.id;
      }

      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        if (img.file) {
          const fileExt = img.file.name.split(".").pop();
          const fileName = `${projectId}/${Date.now()}-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, img.file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            continue;
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("project-images").getPublicUrl(fileName);

          await supabase.from("project_images").insert({
            project_id: projectId,
            image_url: publicUrl,
            is_featured: img.is_featured,
            display_order: i,
          });
        } else if (img.id) {
          await supabase
            .from("project_images")
            .update({
              is_featured: img.is_featured,
              display_order: i,
            })
            .eq("id", img.id);
        } else if (img.image_url) {
          await supabase.from("project_images").upsert({
            project_id: projectId,
            image_url: img.image_url,
            is_featured: img.is_featured,
            display_order: i,
          });
        }
      }

      const message = shouldPublish
        ? "Project published! Your project is now live."
        : editingProject
        ? "Draft updated! Your project has been saved as a draft."
        : "Draft saved! Your project has been saved as a draft.";
      toast.success(message);

      resetForm();
      fetchProjects();
    } catch (error: unknown) {
      console.error("Error saving project:", error);
      const message = error instanceof Error ? error.message : "Failed to save project";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);
      if (error) throw error;

      toast.success("Project deleted");
      fetchProjects();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete project";
      toast.error(message);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin - Projects" noIndex={true} />
      <AdminLayout>
        <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif italic text-3xl text-primary mb-2">
              Projects
            </h1>
            <p className="text-foreground/60">Manage your renovation projects.</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
          )}
        </div>

        {/* Project Form */}
        {showForm && (
          <div className="bg-card border border-border p-6 rounded-lg mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif italic text-xl text-primary">
                {editingProject ? `Edit: ${editingProject.name}` : "New Project"}
              </h2>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Coastal Modern"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  {showCustomCategory ? (
                    <div className="flex gap-2">
                      <Input
                        value={customCategoryValue}
                        onChange={(e) => setCustomCategoryValue(e.target.value)}
                        placeholder="Enter custom category"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          if (customCategoryValue.trim()) {
                            setFormData((prev) => ({ ...prev, category: customCategoryValue.trim() }));
                            setShowCustomCategory(false);
                            setCustomCategoryValue("");
                          }
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowCustomCategory(false);
                          setCustomCategoryValue("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={["kitchen", "bathroom", "kitchen-bathroom", "whole-home"].includes(formData.category) ? formData.category : "custom"}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setShowCustomCategory(true);
                          setCustomCategoryValue(formData.category);
                        } else {
                          setFormData((prev) => ({ ...prev, category: value }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {formData.category === "kitchen" && "Kitchen"}
                          {formData.category === "bathroom" && "Bathroom"}
                          {formData.category === "kitchen-bathroom" && "Kitchen & Bathroom"}
                          {formData.category === "whole-home" && "Whole Home"}
                          {!["kitchen", "bathroom", "kitchen-bathroom", "whole-home"].includes(formData.category) && formData.category}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="bathroom">Bathroom</SelectItem>
                        <SelectItem value="kitchen-bathroom">Kitchen & Bathroom</SelectItem>
                        <SelectItem value="whole-home">Whole Home</SelectItem>
                        <SelectItem value="custom">+ Add Custom Category</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="e.g., Burleigh Heads"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        year: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 12 weeks"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="One-line description for cards"
                  />
                </div>
              </div>

              {/* AI Content Generation */}
              <div className="border-t border-border pt-6">
                <div className="space-y-2">
                  <Label htmlFor="roughDescription">
                    Rough Description (for AI)
                  </Label>
                  <Textarea
                    id="roughDescription"
                    value={formData.roughDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        roughDescription: e.target.value,
                      }))
                    }
                    placeholder="Write a quick, rough description of the project. The AI will expand this into Overview, Challenge, and Solution sections."
                    rows={4}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGenerateContent}
                  disabled={generating}
                  className="mt-3"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generating ? "Generating..." : "Generate Content with AI"}
                </Button>
              </div>

              {/* Generated Content */}
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    value={formData.overview}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        overview: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                  <ContentRefinementButtons
                    fieldName="Overview"
                    currentContent={formData.overview}
                    previousContent={previousContent.overview}
                    onRefine={(action, customPrompt) =>
                      handleRefineContent("overview", action, customPrompt)
                    }
                    onUndo={() => handleUndoRefine("overview")}
                    isRefining={refining === "overview"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge">The Challenge</Label>
                  <Textarea
                    id="challenge"
                    value={formData.challenge}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        challenge: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                  <ContentRefinementButtons
                    fieldName="Challenge"
                    currentContent={formData.challenge}
                    previousContent={previousContent.challenge}
                    onRefine={(action, customPrompt) =>
                      handleRefineContent("challenge", action, customPrompt)
                    }
                    onUndo={() => handleUndoRefine("challenge")}
                    isRefining={refining === "challenge"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">The Solution</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        solution: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                  <ContentRefinementButtons
                    fieldName="Solution"
                    currentContent={formData.solution}
                    previousContent={previousContent.solution}
                    onRefine={(action, customPrompt) =>
                      handleRefineContent("solution", action, customPrompt)
                    }
                    onUndo={() => handleUndoRefine("solution")}
                    isRefining={refining === "solution"}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-t border-border pt-6 space-y-6">
                <div>
                  <Label>Slider Images *</Label>
                  <p className="text-sm text-foreground/60 mb-4">
                    Upload images for the slider. Click the star to add to
                    featured images. Use arrows to reorder.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Upload ${index + 1}`}
                          className={`w-32 h-24 object-cover border-2 ${
                            img.is_featured ? "border-primary" : "border-border"
                          }`}
                        />
                        <div className="absolute top-1 left-1">
                          <button
                            type="button"
                            onClick={() => toggleFeatured(index)}
                            className={`p-1 rounded ${
                              img.is_featured
                                ? "bg-primary text-primary-foreground"
                                : "bg-background/80 text-foreground/60 hover:bg-background"
                            }`}
                          >
                            <Star
                              className="w-4 h-4"
                              fill={img.is_featured ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => moveImage(index, "left")}
                            disabled={index === 0}
                            className="p-1 bg-background/90 text-foreground/80 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, "right")}
                            disabled={index === images.length - 1}
                            className="p-1 bg-background/90 text-foreground/80 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-background/90 text-foreground/80 text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}

                    <label className="w-32 h-24 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Image className="w-6 h-6 text-foreground/40 mb-1" />
                      <span className="text-xs text-foreground/40">
                        Upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowLibraryDialog(true)}
                      className="w-32 h-24 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Library className="w-6 h-6 text-foreground/40 mb-1" />
                      <span className="text-xs text-foreground/40">
                        Site Images
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label>
                    Featured Images ({images.filter((img) => img.is_featured).length}
                    /5)
                  </Label>
                  <p className="text-sm text-foreground/60 mb-4">
                    These images appear on the project detail page.
                  </p>

                  <div className="flex flex-wrap gap-4 min-h-[6rem]">
                    {images.filter((img) => img.is_featured).length === 0 ? (
                      <div className="w-full py-6 border-2 border-dashed border-border rounded flex items-center justify-center">
                        <p className="text-sm text-foreground/40">
                          Click the star on slider images to add featured images
                          (max 5)
                        </p>
                      </div>
                    ) : (
                      images
                        .map((img, originalIndex) => ({ ...img, originalIndex }))
                        .filter((img) => img.is_featured)
                        .slice(0, 5)
                        .map((img, featuredIndex) => (
                          <div key={img.originalIndex} className="relative group">
                            <img
                              src={img.preview}
                              alt={`Featured ${featuredIndex + 1}`}
                              className="w-32 h-24 object-cover border-2 border-primary"
                            />
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                              {featuredIndex === 0 && "Overview"}
                              {featuredIndex === 1 && "Challenge"}
                              {featuredIndex >= 2 && `Below #${featuredIndex - 1}`}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleFeatured(img.originalIndex)}
                              className="absolute top-1 right-1 p-1 bg-background/90 text-foreground/80 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={saving}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {saving ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {loadingProjects ? (
          <p className="text-foreground/60">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-foreground/60 mb-4">No projects yet.</p>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border rounded-lg overflow-hidden group"
              >
                <div className="aspect-video relative bg-muted">
                  {project.images[0] ? (
                    <img
                      src={project.images[0].preview}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={project.is_published ? "default" : "secondary"}
                    >
                      {project.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-foreground/60 capitalize mb-4">
                    {project.category.replace("-", " ")} •{" "}
                    {project.images.length} images
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Link to={`/projects/${generateSlug(project.name)}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="text-destructive hover:text-destructive ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Site Images Library Dialog */}
        <Dialog 
          open={showLibraryDialog} 
          onOpenChange={(open) => {
            setShowLibraryDialog(open);
            if (!open) clearLibrarySelections();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="font-serif italic text-xl text-primary">
                Select Images
              </DialogTitle>
            </DialogHeader>
            
            <Tabs value={libraryTab} onValueChange={(v) => setLibraryTab(v as "uploaded" | "site-assets")} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="uploaded">Uploaded Images</TabsTrigger>
                <TabsTrigger value="site-assets">Site Assets</TabsTrigger>
              </TabsList>

              {/* Uploaded Images Tab */}
              <TabsContent value="uploaded" className="flex-1 flex flex-col overflow-hidden m-0">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search images..."
                    className="pl-10"
                  />
                </div>

                <div className="overflow-y-auto flex-1">
                  {loadingStorageImages ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {storageImages
                        ?.filter((file) => file.name.toLowerCase().includes(librarySearch.toLowerCase()))
                        .map((file) => {
                          const imageUrl = getStoragePublicUrl(file.name);
                          const isSelected = selectedStorageImages.has(file.name);
                          return (
                            <button
                              key={file.id}
                              type="button"
                              onClick={() => toggleStorageImageSelection(file.name)}
                              className={`group relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                                isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary"
                              }`}
                            >
                              <img
                                src={imageUrl}
                                alt={file.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs truncate">{file.name}</p>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                  {!loadingStorageImages && storageImages?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No uploaded images. Go to Site Images to upload some.
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Site Assets Tab */}
              <TabsContent value="site-assets" className="flex-1 flex flex-col overflow-hidden m-0">
                <div className="flex gap-2 mb-4 flex-wrap">
                  <Button
                    variant={libraryFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLibraryFilter("all")}
                  >
                    All
                  </Button>
                  {(Object.keys(categoryLabels) as SiteAsset["category"][]).map((cat) => (
                    <Button
                      key={cat}
                      variant={libraryFilter === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLibraryFilter(cat)}
                    >
                      {categoryLabels[cat]}
                    </Button>
                  ))}
                </div>

                <div className="overflow-y-auto flex-1">
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {siteAssets
                      .filter((asset) => libraryFilter === "all" || asset.category === libraryFilter)
                      .map((asset) => {
                        const imageUrl = assetsReady ? (resolvedAssets[asset.id] || asset.importedUrl) : asset.importedUrl;
                        const isSelected = selectedSiteAssets.has(asset.id);
                        return (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => toggleSiteAssetSelection(asset.id)}
                            className={`group relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                              isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary"
                            }`}
                          >
                            <img
                              src={imageUrl}
                              alt={asset.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-white text-xs truncate">{asset.label}</p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Add Selected Button */}
            {(selectedStorageImages.size > 0 || selectedSiteAssets.size > 0) && (
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <p className="text-sm text-muted-foreground">
                  {selectedStorageImages.size + selectedSiteAssets.size} image{selectedStorageImages.size + selectedSiteAssets.size > 1 ? "s" : ""} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearLibrarySelections}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={addSelectedImages}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Selected
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
    </>
  );
};

export default AdminProjects;
