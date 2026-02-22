import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { fetchProjects, type Project } from "@/data/projects";

type HomeProjectTeaser = Pick<Project, "id" | "slug" | "name" | "location" | "image">;

const ProjectCard = ({
  project,
  isDuplicate = false,
}: {
  project: HomeProjectTeaser;
  isDuplicate?: boolean;
}) => (
  <Link
    to={`/renovation-projects/${project.slug}`}
    className="group flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] cursor-pointer"
    aria-hidden={isDuplicate || undefined}
    tabIndex={isDuplicate ? -1 : undefined}
  >
    <div className="relative aspect-[2/3] overflow-hidden">
      <ResponsiveImage
        src={project.image}
        alt={isDuplicate ? "" : `${project.name} renovation project in ${project.location}`}
        width={800}
        height={1200}
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 240px"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        quality={58}
        responsiveWidths={[240, 320, 420, 560, 720]}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-media-overlay/70 pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center text-center p-3 md:p-4 pointer-events-none">
        <div className="pt-2">
          <p className="font-serif italic text-base sm:text-lg md:text-xl lg:text-2xl leading-none text-media-foreground">
            {project.name}
          </p>
        </div>

        <div className="mt-auto pb-2">
          <p className="text-media-foreground/80 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.12em]">
            {project.location}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

const ProjectsTeaser = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);
  const loopWidthRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [projects, setProjects] = useState<HomeProjectTeaser[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document === "undefined" ? true : !document.hidden,
  );

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      const projectRows = await fetchProjects();
      if (!isMounted) return;

      const teaserProjects = projectRows
        .filter((project) => Boolean(project.image?.trim()))
        .slice(0, 8)
        .map((project) => ({
          id: project.id,
          slug: project.slug,
          name: project.name,
          location: project.location || "Gold Coast",
          image: project.image,
        }));

      setProjects(teaserProjects);
      setIsLoaded(true);
    };

    void loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateLoopWidth = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    loopWidthRef.current = projects.length > 1 ? scrollContainer.scrollWidth / 2 : scrollContainer.scrollWidth;
    if (scrollPosRef.current >= loopWidthRef.current) {
      scrollPosRef.current = 0;
      scrollContainer.scrollLeft = 0;
    }
  }, [projects.length]);

  useEffect(() => {
    if (!projects.length) return;
    updateLoopWidth();
    window.addEventListener("resize", updateLoopWidth);
    return () => window.removeEventListener("resize", updateLoopWidth);
  }, [projects.length, updateLoopWidth]);

  useEffect(() => {
    if (!scrollRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const animate = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return;

    const speed = 0.5;
    scrollPosRef.current += speed;
    if (scrollPosRef.current >= loopWidth) {
      scrollPosRef.current = 0;
    }

    scrollContainer.scrollLeft = scrollPosRef.current;
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const shouldAnimate = !isPaused && projects.length > 1 && isInViewport && isDocumentVisible;

  useEffect(() => {
    if (!shouldAnimate) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [animate, shouldAnimate]);

  const togglePause = () => {
    setIsPaused((current) => !current);
  };

  const duplicatedProjects = projects.length > 1 ? [...projects, ...projects] : projects;

  if (!isLoaded || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-28 border-t border-foreground/10 bg-background relative z-10" id="projects">
      <div className="container-wide mb-8 md:mb-12 px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
          <p className="text-label text-foreground/60 mb-4 md:mb-6 text-xs md:text-sm">Gold Coast Renovations Selected Work</p>
          <h2 className="text-foreground font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-3 md:mb-4">
            Our Gold Coast Renovation Projects And Client Stories
          </h2>
          <p className="text-foreground/70 text-base md:text-xl leading-relaxed">Stories of life improving at home.</p>
        </div>
      </div>

      <div className="relative">
        {projects.length > 1 ? (
          <button
            onClick={togglePause}
            className="absolute left-3 md:left-4 bottom-3 md:bottom-4 z-10 bg-background/80 backdrop-blur-sm border border-foreground/20 rounded-full p-3 md:p-4 hover:bg-background transition-colors"
            aria-label={isPaused ? "Play carousel" : "Pause carousel"}
          >
            {isPaused ? (
              <Play className="w-5 h-5 md:w-8 md:h-8 text-foreground" />
            ) : (
              <Pause className="w-5 h-5 md:w-8 md:h-8 text-foreground" />
            )}
          </button>
        ) : null}

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-hidden scrollbar-hide cursor-grab"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          {duplicatedProjects.map((project, index) => (
            <ProjectCard key={`${project.id}-${index}`} project={project} isDuplicate={index >= projects.length} />
          ))}
        </div>
      </div>

      <div className="container-wide mt-8 md:mt-12 relative z-10 px-5 md:px-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
          <Link
            to="/renovation-projects"
            className="text-label text-foreground hover:opacity-60 transition-opacity border-b border-foreground pb-1 pointer-events-auto text-xs md:text-sm"
          >
            View Gold Coast Renovation Project Portfolio
          </Link>
          <Link
            to="/renovation-gallery"
            className="text-label text-foreground hover:opacity-60 transition-opacity border-b border-foreground pb-1 pointer-events-auto text-xs md:text-sm"
          >
            Browse Gold Coast Renovations Gallery
          </Link>
          <Link
            to="/book-renovation-consultation"
            className="text-label bg-primary text-primary-foreground px-5 md:px-6 py-2.5 md:py-3 hover:bg-primary/90 transition-colors pointer-events-auto text-xs md:text-sm"
          >
            Let's Chat About Your Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsTeaser;
