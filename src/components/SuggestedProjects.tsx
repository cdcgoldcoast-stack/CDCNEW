import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Project, fetchProjects } from "@/data/projects";
import ResponsiveImage from "@/components/ResponsiveImage";

interface SuggestedProjectsProps {
  currentProjectId: string;
}

const SuggestedProjects = ({ currentProjectId }: SuggestedProjectsProps) => {
  const [suggestedProjects, setSuggestedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const VIEWED_PROJECTS_KEY = "cdc_viewed_projects";

    const readViewedProjects = (): Set<string> => {
      try {
        const raw = localStorage.getItem(VIEWED_PROJECTS_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((item): item is string => typeof item === "string"));
      } catch {
        return new Set();
      }
    };

    const writeViewedProjects = (ids: Set<string>) => {
      try {
        localStorage.setItem(VIEWED_PROJECTS_KEY, JSON.stringify(Array.from(ids)));
      } catch {
        // Ignore localStorage write failures
      }
    };

    const loadSuggestedProjects = async () => {
      try {
        const viewedProjectIds = readViewedProjects();
        viewedProjectIds.add(currentProjectId);
        writeViewedProjects(viewedProjectIds);

        // Fetch all projects
        const allProjects = await fetchProjects();

        // Filter out current project and already viewed projects
        const availableProjects = allProjects.filter(
          (p) => p.id !== currentProjectId && !viewedProjectIds.has(p.id)
        );

        // If not enough unviewed projects, include viewed ones (except current)
        let poolToPickFrom = availableProjects;
        if (availableProjects.length < 4) {
          const viewedButNotCurrent = allProjects.filter(
            (p) => p.id !== currentProjectId && viewedProjectIds.has(p.id)
          );
          poolToPickFrom = [...availableProjects, ...viewedButNotCurrent];
        }

        // Shuffle and pick 4
        const shuffled = poolToPickFrom.sort(() => Math.random() - 0.5);
        setSuggestedProjects(shuffled.slice(0, 4));
      } catch (err) {
        console.error("Error loading suggested projects:", err);
        // Fallback: just show random projects
        const allProjects = await fetchProjects();
        const filtered = allProjects.filter((p) => p.id !== currentProjectId);
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setSuggestedProjects(shuffled.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    loadSuggestedProjects();
  }, [currentProjectId]);

  if (loading || suggestedProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 border-t border-foreground/10">
      <div className="container-wide">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-primary mb-3">
            More Projects
          </h2>
          <p className="text-foreground/60 text-base md:text-lg">
            Explore more of our work
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {suggestedProjects.map((project) => (
            <Link
              key={project.id}
              to={`/renovation-projects/${project.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <ResponsiveImage
                  src={project.image}
                  alt={`${project.name} renovation project`}
                  width={800}
                  height={1067}
                  sizes="(min-width: 1024px) 24vw, 48vw"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-wider text-primary block mb-2">
                {project.category.replace("-", " ")}
              </span>
              <h3 className="font-serif italic text-base md:text-lg lg:text-xl text-primary group-hover:text-primary/80 transition-colors">
                {project.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedProjects;
