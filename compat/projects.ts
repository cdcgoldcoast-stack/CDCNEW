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

type DbProject = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  location: string | null;
  overview: string | null;
  challenge: string | null;
  solution: string | null;
};

type DbProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  is_featured: boolean | null;
  display_order: number | null;
};

const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_riMzmbUjAEXtvSij0Ho2Ew_eGK9ChO8";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://iqugsxeejieneyksfbza.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

const hasSupabaseCredentials =
  SUPABASE_PUBLISHABLE_KEY.length > 0 && SUPABASE_PUBLISHABLE_KEY !== "public-anon-key-placeholder";

const toSlug = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const slugMatches = (slug: string, name: string): boolean => toSlug(name) === slug;

const REMOVED_PROJECT_SLUGS = new Set([
  "coastal-modern",
  "heritage-revival",
  "retreat-house",
  "sunshine-retreat",
  "urban-oasis",
]);
const PUBLIC_PROJECTS_REVALIDATE_SECONDS = 900;

type SupabaseFetchMode = "public-isr" | "client-live";

type SupabaseFetchOptions = {
  mode?: SupabaseFetchMode;
  revalidateSeconds?: number;
};

const supabaseHeaders = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
};

const supabaseFetch = async <T>(path: string, options: SupabaseFetchOptions = {}): Promise<T> => {
  const isServer = typeof window === "undefined";
  const mode: SupabaseFetchMode = options.mode ?? (isServer ? "public-isr" : "client-live");
  const revalidateSeconds = options.revalidateSeconds ?? PUBLIC_PROJECTS_REVALIDATE_SECONDS;
  const requestOptions: RequestInit & { next?: { revalidate: number } } = {
    headers: supabaseHeaders,
  };

  if (mode === "client-live") {
    requestOptions.cache = "no-store";
  } else {
    if (isServer) {
      requestOptions.next = { revalidate: revalidateSeconds };
    }
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, requestOptions);

  if (!response.ok) {
    throw new Error(`Supabase request failed (${response.status}) for ${path}`);
  }

  return (await response.json()) as T;
};

const mapProjectCategory = (category: string | null): Project["category"] => {
  if (category === "kitchen" || category === "bathroom" || category === "whole-home") {
    return category;
  }

  return "whole-home";
};

export const staticProjects: Project[] = [
  {
    id: "coastal-modern",
    slug: "coastal-modern",
    name: "Coastal Modern",
    description: "Complete kitchen and living transformation",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=900&fit=crop",
    category: "kitchen",
    location: "Burleigh Heads",
    overview:
      "A complete transformation of an outdated 1990s kitchen into a bright, functional space that embraces the coastal lifestyle.",
    challenge:
      "The original layout was closed off from the living areas, making the space feel dark and disconnected.",
    solution:
      "We opened the plan and designed a large island bench with integrated seating and improved light.",
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
    overview:
      "A sensitive renovation of a Queenslander that honours heritage character while introducing modern comfort.",
    challenge:
      "Balancing preservation of original details with functional updates.",
    solution:
      "We restored key details and integrated modern services and planning.",
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
    overview: "A family-focused transformation that improves flow and everyday usability.",
    challenge: "Small disconnected rooms made daily routines harder.",
    solution: "We created open connected zones with defined functional areas.",
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
    overview: "An ensuite transformation focused on calm, comfort, and practical use.",
    challenge: "A cramped layout with dated finishes and poor ventilation.",
    solution: "A reconfigured plan with better light, storage, and fixtures.",
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
    overview: "A compact apartment kitchen remodel designed for efficient daily use.",
    challenge: "Limited footprint and tight circulation.",
    solution: "Custom joinery and light-focused material choices improved function.",
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
    overview: "A beachside home refresh designed for indoor-outdoor living.",
    challenge: "Dark interiors and poor connection to outdoor spaces.",
    solution: "We opened the rear plan and used a light, cohesive material palette.",
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

const mapDbProjects = (dbProjects: DbProject[], dbImages: DbProjectImage[]): Project[] => {
  const imagesByProject = dbImages.reduce<Record<string, DbProjectImage[]>>((acc, image) => {
    if (!acc[image.project_id]) {
      acc[image.project_id] = [];
    }
    acc[image.project_id].push(image);
    return acc;
  }, {});

  return dbProjects
    .map((project) => {
    const images = (imagesByProject[project.id] || []).sort(
      (a, b) => (a.display_order || 0) - (b.display_order || 0),
    );

    const gallery = images.map((image) => image.image_url);
    const featuredImages = images
      .filter((image) => image.is_featured)
      .slice(0, 5)
      .map((image) => image.image_url);

    const featuredImage = featuredImages[0] || gallery[0] || "";

    return {
      id: project.id,
      slug: toSlug(project.name),
      name: project.name,
      description: project.description || "",
      image: featuredImage,
      category: mapProjectCategory(project.category),
      location: project.location || "",
      overview: project.overview || "",
      challenge: project.challenge || "",
      solution: project.solution || "",
      gallery: gallery.length > 0 ? gallery : [featuredImage].filter(Boolean),
      featuredImages,
    };
    })
    .filter((project) => !REMOVED_PROJECT_SLUGS.has(project.slug));
};

export const fetchProjects = async (): Promise<Project[]> => {
  if (!hasSupabaseCredentials) {
    return filteredStaticProjects;
  }

  try {
    const fetchMode: SupabaseFetchMode =
      typeof window === "undefined" ? "public-isr" : "client-live";
    const dbProjects = await supabaseFetch<DbProject[]>("projects?select=*&order=created_at.desc", {
      mode: fetchMode,
      revalidateSeconds: PUBLIC_PROJECTS_REVALIDATE_SECONDS,
    });

    if (!dbProjects || dbProjects.length === 0) {
      return filteredStaticProjects;
    }

    const projectIds = dbProjects.map((project) => project.id).filter(Boolean);
    let dbImages: DbProjectImage[] = [];

    if (projectIds.length > 0) {
      const inClause = projectIds.join(",");
      dbImages = await supabaseFetch<DbProjectImage[]>(
        `project_images?select=*&project_id=in.(${inClause})&order=display_order.asc`,
        {
          mode: fetchMode,
          revalidateSeconds: PUBLIC_PROJECTS_REVALIDATE_SECONDS,
        },
      );
    }

    return mapDbProjects(dbProjects, dbImages);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return filteredStaticProjects;
  }
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  const projects = await fetchProjects();
  return projects.find((project) => project.slug === slug || slugMatches(slug, project.name));
};

export const fetchProjectById = async (id: string): Promise<Project | undefined> => {
  const projects = await fetchProjects();
  return projects.find((project) => project.id === id);
};

export const projects = filteredStaticProjects;

export const getProjectById = (id: string): Project | undefined => {
  return filteredStaticProjects.find((project) => project.id === id);
};

export const getProjectsByCategory = (category: Project["category"]): Project[] => {
  return filteredStaticProjects.filter((project) => project.category === category);
};

/**
 * Fetch the hero image URL server-side, checking for admin overrides.
 * Returns the override URL if one exists, otherwise the static fallback.
 */
export const fetchHeroImageUrl = async (fallback = "/hero-bg.webp"): Promise<string> => {
  if (!hasSupabaseCredentials) return fallback;

  try {
    type ImageOverride = { override_url: string; updated_at?: string };
    const rows = await supabaseFetch<ImageOverride[]>(
      `image_overrides?select=override_url,updated_at&original_path=eq.hero-bg.jpg&limit=1`,
      { mode: "client-live" },
    );

    if (rows.length > 0 && rows[0].override_url) {
      const { override_url, updated_at } = rows[0];
      return updated_at
        ? `${override_url}${override_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(updated_at)}`
        : override_url;
    }

    return fallback;
  } catch {
    return fallback;
  }
};
