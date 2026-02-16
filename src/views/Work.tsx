import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { fetchProjects, Project } from "@/data/projects";
import SEO from "@/components/SEO";
import { generateItemListSchema } from "@/lib/structured-data";
import BottomInvitation from "@/components/BottomInvitation";
import Footer from "@/components/Footer";
import ResponsiveImage from "@/components/ResponsiveImage";

const Work = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    };
    loadProjects();
  }, []);

  // Generate ItemList schema for SEO
  const itemListSchema = generateItemListSchema(
    projects.map((project, index) => ({
      name: project.name,
      url: `/renovation-projects/${project.slug}`,
      image: project.image,
      position: index + 1,
    }))
  );

  // Split projects into 3 columns
  const columns = [
    projects.filter((_, i) => i % 3 === 0),
    projects.filter((_, i) => i % 3 === 1),
    projects.filter((_, i) => i % 3 === 2),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Projects | Gold Coast Renovation Projects & Portfolio"
        description="Browse our Gold Coast renovation portfolio. See completed kitchen, bathroom, and whole-home transformations across Burleigh, Broadbeach, Robina, and more."
        url="/renovation-projects"
        jsonLd={itemListSchema}
      />
      <Header />

      <main className="pt-20 md:pt-28 px-4 md:px-6 lg:px-8 pb-16">
        {/* Title */}
        <div className="text-center mb-8 md:mb-16 max-w-2xl mx-auto px-2">
          <h1 className="font-serif italic text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-primary mb-4 md:mb-6">
            Gold Coast Renovation Projects
          </h1>
          <p className="text-foreground/70 text-base md:text-xl leading-relaxed mb-2 md:mb-3">
            Renovations that transform how families live.
          </p>
          <p className="text-foreground/50 text-xs md:text-base">
            Each project tells a story of improved daily living across the Gold Coast.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-5 lg:gap-6 max-w-[1600px] mx-auto animate-pulse">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="relative overflow-hidden aspect-[1/1.2] sm:aspect-[1/1.5] bg-muted">
                <div className="absolute inset-x-4 top-4 h-5 bg-background/40 rounded" />
                <div className="absolute inset-x-10 bottom-6 h-3 bg-background/30 rounded" />
              </div>
            ))}
          </div>
        ) : (
          /* Responsive layout - single column on mobile, 3 columns on desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-5 lg:gap-6 max-w-[1600px] mx-auto">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                to={`/renovation-projects/${project.slug}`}
                className="group relative overflow-hidden aspect-[1/1.2] sm:aspect-[1/1.5]"
              >
                <ResponsiveImage
                  src={project.image}
                  alt={`${project.name} - ${project.category} renovation in ${project.location}, Gold Coast`}
                  width={800}
                  height={1200}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  quality={60}
                  responsiveWidths={[320, 480, 640, 800, 960]}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-2 sm:p-4 md:p-5">
                  {/* Top: Title */}
                  <div className="text-center">
                    <h2 className="font-serif italic text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white drop-shadow-md leading-tight">
                      {project.name}
                    </h2>
                  </div>

                  {/* Bottom: Location */}
                  <div className="text-center">
                    <span className="text-white/90 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] drop-shadow-sm">
                      {project.location}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <BottomInvitation
          title="Plan Your Next Renovation"
          description="Whether you're planning a bathroom update, a kitchen makeover, or a full property renovation - we'd love to hear about it."
        />
      </main>
      <Footer />
    </div>
  );
};

export default Work;
