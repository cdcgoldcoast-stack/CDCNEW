import { supabase } from "@/integrations/supabase/client";
import { generateSlug, slugMatches } from "@/lib/slug";
import { SITE_NAME } from "@/config/seo";

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
  featuredImages: string[]; // Up to 5 featured images for detail page layout
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  tags?: string[];
}

const buildProjectTags = (
  projectName: string,
  category: Project["category"],
  location: string,
) => [
  "Gold Coast renovation project",
  `${location || "Gold Coast"} renovation`,
  `${category} renovation Gold Coast`,
  projectName,
];

const REMOVED_PROJECT_SLUGS = new Set([
  "coastal-modern",
  "heritage-revival",
  "retreat-house",
  "sunshine-retreat",
  "urban-oasis",
]);

// Static fallback projects (used if database has no projects)
export const staticProjects: Project[] = [
  {
    id: "coastal-modern",
    slug: "coastal-modern",
    name: "Coastal Modern",
    description: "Complete kitchen and living transformation",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=900&fit=crop",
    category: "kitchen",
    location: "Burleigh Heads",
    overview: "A complete transformation of an outdated 1990s kitchen into a bright, functional space that embraces the coastal lifestyle. The homeowners wanted a kitchen that would serve as the heart of their home for family gatherings and entertaining.",
    challenge: "The original layout was closed off from the living areas, making the space feel dark and disconnected. Limited bench space and outdated appliances made cooking a chore rather than a pleasure.",
    solution: "We removed a non-load-bearing wall to create an open-plan layout, installed floor-to-ceiling windows facing the garden, and designed a large island bench with integrated seating. Natural materials like timber and stone complement the coastal setting.",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&h=800&fit=crop",
    ],
    featuredImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
    ],
  },
  {
    id: "heritage-revival",
    slug: "heritage-revival",
    name: "Heritage Revival",
    description: "Preserving character while adding comfort",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=900&fit=crop",
    category: "whole-home",
    location: "Southport",
    overview: "A sensitive renovation of a 1920s Queenslander that honours its heritage character while introducing modern comforts. Every detail was carefully considered to blend old and new seamlessly.",
    challenge: "Balancing the preservation of original features like VJ walls, fretwork, and casement windows with the need for modern amenities, improved insulation, and an updated floor plan.",
    solution: "We restored original timber floors and joinery, replicated heritage mouldings where needed, and carefully integrated modern kitchen and bathroom facilities. New additions were designed in a sympathetic style.",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop",
    ],
    featuredImages: [],
  },
  {
    id: "family-hub",
    slug: "family-hub",
    name: "Family Hub",
    description: "Open plan living for growing families",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=900&fit=crop",
    category: "whole-home",
    location: "Robina",
    overview: "A family of five needed more space and better flow. We transformed their compartmentalised 1980s home into an open, connected living space that works for every stage of family life.",
    challenge: "Small, disconnected rooms made it difficult for the family to spend time together. The kitchen was too small for meal prep with kids around, and there was no clear homework or study zone.",
    solution: "We opened up the ground floor to create one large living, dining, and kitchen zone with distinct functional areas. A butler's pantry hides mess, while a built-in study nook provides homework space.",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop",
    ],
    featuredImages: [],
  },
  {
    id: "retreat-house",
    slug: "retreat-house",
    name: "Retreat House",
    description: "Tranquil spaces for everyday living",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=900&fit=crop",
    category: "bathroom",
    location: "Palm Beach",
    overview: "An ensuite transformation focused on creating a spa-like retreat for busy professionals. The goal was to bring a sense of calm and luxury to the start and end of each day.",
    challenge: "The existing bathroom was cramped, poorly lit, and showed signs of water damage. Ventilation was inadequate, leading to mould issues.",
    solution: "We reconfigured the layout to include a freestanding bath, double vanity, and walk-in shower with rainfall head. Natural stone, warm timber accents, and a skylight create a serene atmosphere.",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&h=800&fit=crop",
    ],
    featuredImages: [],
  },
  {
    id: "urban-oasis",
    slug: "urban-oasis",
    name: "Urban Oasis",
    description: "Maximising light in compact spaces",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=900&fit=crop",
    category: "kitchen",
    location: "Broadbeach",
    overview: "A compact apartment kitchen that proves small spaces can have big impact. Smart design maximises storage and functionality without compromising on style.",
    challenge: "Limited square footage meant every centimetre counted. The original galley kitchen felt cramped and lacked natural light.",
    solution: "We installed reflective surfaces and light colours to bounce light around the space. Custom cabinetry maximises vertical storage, while a clever breakfast bar adds dining functionality without taking floor space.",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1200&h=800&fit=crop",
    ],
    featuredImages: [],
  },
  {
    id: "sunshine-retreat",
    slug: "sunshine-retreat",
    name: "Sunshine Retreat",
    description: "Bright and airy coastal renovation",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=900&fit=crop",
    category: "whole-home",
    location: "Mermaid Beach",
    overview: "A tired beach house transformed into a light-filled family home. The renovation embraced the coastal location with an indoor-outdoor flow perfect for the Queensland lifestyle.",
    challenge: "Dark interiors, poor ventilation, and a disconnection from the outdoor spaces meant the home didn't suit the beachside setting or the owners' love of entertaining.",
    solution: "We opened up the back of the house with large bi-fold doors, added a covered alfresco area, and used a light, neutral palette throughout. Cross-ventilation now keeps the home cool naturally.",
    gallery: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=1200&h=800&fit=crop",
    ],
    featuredImages: [],
  },
];

const filteredStaticProjects = staticProjects.filter(
  (project) => !REMOVED_PROJECT_SLUGS.has(project.slug),
);

// Fetch all projects (from database with static fallback)
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const { data: dbProjects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return filteredStaticProjects;
    }

    if (!dbProjects || dbProjects.length === 0) {
      return filteredStaticProjects;
    }

    // Fetch images for each project
    const projectsWithImages = await Promise.all(
      dbProjects.map(async (project) => {
        const { data: images } = await supabase
          .from("project_images")
          .select("*")
          .eq("project_id", project.id)
          .order("display_order");

        const gallery = (images || []).map((img) => img.image_url);
        const featuredImages = (images || [])
          .filter((img) => img.is_featured)
          .slice(0, 5)
          .map((img) => img.image_url);
        const featuredImage = featuredImages[0] || gallery[0] || "";

        return {
          id: project.id,
          slug: generateSlug(project.name),
          name: project.name,
          description: project.description || "",
          image: featuredImage,
          category: project.category as "kitchen" | "bathroom" | "whole-home",
          location: project.location || "",
          overview: project.overview || "",
          challenge: project.challenge || "",
          solution: project.solution || "",
          gallery: gallery.length > 0 ? gallery : [featuredImage].filter(Boolean),
          featuredImages,
          publishedAt: project.created_at || undefined,
          modifiedAt: project.updated_at || project.created_at || undefined,
          authorName: SITE_NAME,
          tags: buildProjectTags(
            project.name,
            project.category as Project["category"],
            project.location || "Gold Coast",
          ),
        };
      })
    );

    return projectsWithImages.filter((project) => !REMOVED_PROJECT_SLUGS.has(project.slug));
  } catch (err) {
    console.error("Error in fetchProjects:", err);
    return filteredStaticProjects;
  }
};

// Fetch single project by slug (primary method for public pages)
export const fetchProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  try {
    // Fetch all projects and find matching slug
    const allProjects = await fetchProjects();
    return allProjects.find((p) => p.slug === slug || slugMatches(slug, p.name));
  } catch (err) {
    console.error("Error in fetchProjectBySlug:", err);
    // Fallback to static projects
    return filteredStaticProjects.find((p) => p.slug === slug || slugMatches(slug, p.name));
  }
};

// Fetch single project by ID (for admin and internal use)
export const fetchProjectById = async (id: string): Promise<Project | undefined> => {
  try {
    // First try database
    const { data: dbProject, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !dbProject) {
      // Fallback to static projects
      return filteredStaticProjects.find((p) => p.id === id);
    }

    // Fetch images
    const { data: images } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", dbProject.id)
      .order("display_order");

    const gallery = (images || []).map((img) => img.image_url);
    const featuredImages = (images || [])
      .filter((img) => img.is_featured)
      .slice(0, 5)
      .map((img) => img.image_url);
    const featuredImage = featuredImages[0] || gallery[0] || "";

    return {
      id: dbProject.id,
      slug: generateSlug(dbProject.name),
      name: dbProject.name,
      description: dbProject.description || "",
      image: featuredImage,
      category: dbProject.category as "kitchen" | "bathroom" | "whole-home",
      location: dbProject.location || "",
      overview: dbProject.overview || "",
      challenge: dbProject.challenge || "",
      solution: dbProject.solution || "",
      gallery: gallery.length > 0 ? gallery : [featuredImage].filter(Boolean),
      featuredImages,
      publishedAt: dbProject.created_at || undefined,
      modifiedAt: dbProject.updated_at || dbProject.created_at || undefined,
      authorName: SITE_NAME,
      tags: buildProjectTags(
        dbProject.name,
        dbProject.category as Project["category"],
        dbProject.location || "Gold Coast",
      ),
    };
  } catch (err) {
    console.error("Error in fetchProjectById:", err);
    return filteredStaticProjects.find((p) => p.id === id);
  }
};

// Legacy exports for backwards compatibility
export const projects = filteredStaticProjects;

export const getProjectById = (id: string): Project | undefined => {
  return filteredStaticProjects.find((project) => project.id === id);
};

export const getProjectsByCategory = (category: Project["category"]): Project[] => {
  return filteredStaticProjects.filter((project) => project.category === category);
};
