import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { generateSlug, slugMatches } from "@/lib/slug";
import { SITE_NAME } from "@/config/seo";

type DbProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  category: "kitchen" | "bathroom" | "whole-home";
  location: string;
  overview: string;
  challenge: string;
  solution: string;
  gallery: string[];
  featuredImages: string[];
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  tags?: string[];
}

const REMOVED_PROJECT_SLUGS = new Set([
  "coastal-modern",
  "heritage-revival",
  "retreat-house",
  "sunshine-retreat",
  "urban-oasis",
]);

const buildProjectTags = (projectName: string, category: Project["category"], location: string) => [
  "Gold Coast renovation project",
  `${location || "Gold Coast"} renovation`,
  `${category} renovation Gold Coast`,
  projectName,
];

const mapProjectImages = async (projectId: string) => {
  const { data: images, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("display_order");

  if (error) {
    console.error("Error fetching project images:", error);
    return {
      gallery: [] as string[],
      featuredImages: [] as string[],
      featuredImage: "",
    };
  }

  const gallery = (images || [])
    .map((img) => img.image_url?.trim())
    .filter((url): url is string => Boolean(url));

  const featuredImages = (images || [])
    .filter((img) => img.is_featured)
    .map((img) => img.image_url?.trim())
    .filter((url): url is string => Boolean(url))
    .slice(0, 5);

  const featuredImage = featuredImages[0] || gallery[0] || "";

  return {
    gallery,
    featuredImages,
    featuredImage,
  };
};

const mapDbProjectToProject = async (project: DbProjectRow): Promise<Project> => {
  const { gallery, featuredImages, featuredImage } = await mapProjectImages(project.id);
  const category = project.category as Project["category"];
  const location = project.location || "Gold Coast";

  return {
    id: project.id,
    slug: generateSlug(project.name),
    name: project.name,
    description: project.description || "",
    image: featuredImage,
    category,
    location: project.location || "",
    overview: project.overview || "",
    challenge: project.challenge || "",
    solution: project.solution || "",
    gallery,
    featuredImages,
    publishedAt: project.created_at || undefined,
    modifiedAt: project.updated_at || project.created_at || undefined,
    authorName: SITE_NAME,
    tags: buildProjectTags(project.name, category, location),
  };
};

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const { data: dbProjects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    if (!dbProjects || dbProjects.length === 0) {
      return [];
    }

    const projectsWithImages = await Promise.all(dbProjects.map((project) => mapDbProjectToProject(project)));

    return projectsWithImages.filter((project) => !REMOVED_PROJECT_SLUGS.has(project.slug));
  } catch (err) {
    console.error("Error in fetchProjects:", err);
    return [];
  }
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  try {
    const allProjects = await fetchProjects();
    return allProjects.find((project) => project.slug === slug || slugMatches(slug, project.name));
  } catch (err) {
    console.error("Error in fetchProjectBySlug:", err);
    return undefined;
  }
};

export const fetchProjectById = async (id: string): Promise<Project | undefined> => {
  try {
    const { data: dbProject, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !dbProject) {
      return undefined;
    }

    const mappedProject = await mapDbProjectToProject(dbProject);
    if (REMOVED_PROJECT_SLUGS.has(mappedProject.slug)) {
      return undefined;
    }
    return mappedProject;
  } catch (err) {
    console.error("Error in fetchProjectById:", err);
    return undefined;
  }
};

// Legacy exports kept to avoid runtime breakage in any stale imports.
export const projects: Project[] = [];

export const getProjectById = (_id: string): Project | undefined => {
  return undefined;
};

export const getProjectsByCategory = (_category: Project["category"]): Project[] => {
  return [];
};
