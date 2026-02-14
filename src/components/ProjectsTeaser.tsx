import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { fetchProjects, Project } from "@/data/projects";
import ResponsiveImage from "@/components/ResponsiveImage";
const ProjectCard = ({
  project
}: {
  project: Project;
}) => <Link to={`/projects/${project.slug}`} className="group flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] cursor-pointer">
    <div className="relative aspect-[2/3] overflow-hidden">
      <ResponsiveImage
        src={project.image}
        alt=""
        width={800}
        height={1200}
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 240px"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-media-overlay/70 pointer-events-none" />

      {/* Magazine-style text layout */}
      <div className="absolute inset-0 flex flex-col items-center text-center p-3 md:p-4 pointer-events-none">
        <div className="pt-2">
          <h3 className="font-serif italic text-base sm:text-lg md:text-xl lg:text-2xl leading-none text-media-foreground">
            {project.name}
          </h3>
        </div>

        <div className="mt-auto pb-2">
          <p className="text-media-foreground/80 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.12em]">
            {project.location}
          </p>
        </div>
      </div>
    </div>
  </Link>;
const ProjectsTeaser = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);
  const animate = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const speed = 0.5;
    scrollPosRef.current += speed;
    const halfWidth = scrollContainer.scrollWidth / 2;
    if (scrollPosRef.current >= halfWidth) {
      scrollPosRef.current = 0;
    }
    scrollContainer.scrollLeft = scrollPosRef.current;
    animationRef.current = requestAnimationFrame(animate);
  }, []);
  useEffect(() => {
    if (!isPaused && projects.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, animate, projects]);
  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsPaused(true);
    }
  };

  // Duplicate projects for infinite scroll effect
  const duplicatedProjects = [...projects, ...projects];
  return <section className="py-12 md:py-28 border-t border-foreground/10 bg-background relative z-10" id="projects">
      <div className="container-wide mb-8 md:mb-12 px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
          <h4 className="text-label text-foreground/60 mb-4 md:mb-6 text-xs md:text-sm">Selected Work</h4>
          <h2 className="text-foreground font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-3 md:mb-4">
            Our Construction Projects And Client Stories
          </h2>
          <p className="text-foreground/70 text-base md:text-xl leading-relaxed">
            Stories of life improving at home.
          </p>
        </div>
      </div>

      {/* Infinite sliding carousel - Full width */}
      <div className="relative">
        {/* Pause/Play button */}
        <button onClick={togglePause} className="absolute left-3 md:left-4 bottom-3 md:bottom-4 z-10 bg-background/80 backdrop-blur-sm border border-foreground/20 rounded-full p-3 md:p-4 hover:bg-background transition-colors" aria-label={isPaused ? "Play carousel" : "Pause carousel"}>
          {isPaused ? <Play className="w-5 h-5 md:w-8 md:h-8 text-foreground" /> : <Pause className="w-5 h-5 md:w-8 md:h-8 text-foreground" />}
        </button>

        <div ref={scrollRef} className="flex gap-3 md:gap-4 overflow-x-hidden scrollbar-hide cursor-grab" style={{
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
      }}>
          {duplicatedProjects.map((project, index) => <ProjectCard key={`${project.id}-${index}`} project={project} />)}
        </div>
      </div>

      {/* Links and CTA */}
      <div className="container-wide mt-8 md:mt-12 relative z-10 px-5 md:px-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
          <Link to="/projects" className="text-label text-foreground hover:opacity-60 transition-opacity border-b border-foreground pb-1 pointer-events-auto text-xs md:text-sm">
            View Complete Project Portfolio
          </Link>
          <Link to="/gallery" className="text-label text-foreground hover:opacity-60 transition-opacity border-b border-foreground pb-1 pointer-events-auto text-xs md:text-sm">
            Browse Project Gallery
          </Link>
          <Link 
            to="/get-quote" 
            className="text-label bg-primary text-primary-foreground px-5 md:px-6 py-2.5 md:py-3 hover:bg-primary/90 transition-colors pointer-events-auto text-xs md:text-sm"
          >
            Let's Chat About Your Home
          </Link>
        </div>
      </div>
    </section>;
};
export default ProjectsTeaser;
