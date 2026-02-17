import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
import { fetchProjects, Project } from "@/data/projects";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { generateProjectSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import SuggestedProjects from "@/components/SuggestedProjects";
import BottomInvitation from "@/components/BottomInvitation";
import { slugMatches } from "@/lib/slug";
import NotFound from "@/views/NotFound";
import ResponsiveImage from "@/components/ResponsiveImage";

export interface ProjectDetailProps {
  initialProject?: Project;
  initialProjects?: Project[];
}

const PROJECT_FEEDBACK_BY_SLUG: Record<string, string> = {
  "everyday-ease":
    "The renovation removed the daily friction in our routine. Everything has a place now, and the finish feels calm and considered.",
  "family-hub":
    "The way the spaces connect now has changed how we live as a family. It feels open, practical, and much easier to use every day.",
  "light-and-flow-house":
    "Light moves through the home beautifully now. The layout feels effortless, and each room flows naturally into the next.",
  "seamless-bathroom":
    "The bathroom feels cohesive from every angle. It is cleaner, easier to maintain, and far more comfortable to use morning and night.",
  "stone-and-light":
    "The material choices gave us exactly the tone we wanted. It feels refined and warm without losing practicality.",
  "terrazzo-retreat":
    "The terrazzo details gave the space real character while still feeling timeless. It now feels like a retreat, not just a utility room.",
  "the-calm-edit":
    "The new design quietened the whole space. It feels orderly and restful, and the result is even better than we expected.",
  "the-elanora-residence":
    "The project balanced functionality and finish quality perfectly. Every decision feels purposeful, and the home works better in every way.",
  "warm-minimal-bathroom":
    "We wanted a warm, minimal look that still felt practical for daily life. The final result is simple, elegant, and very easy to live with.",
};

const getProjectFeedbackQuote = (project: Project) => {
  const slugQuote = PROJECT_FEEDBACK_BY_SLUG[project.slug];
  if (slugQuote) return slugQuote;

  const categoryLabel = project.category.replace("-", " ");
  return `The ${categoryLabel} renovation has made day-to-day living noticeably easier. The planning was clear, and the finish quality exceeded expectations.`;
};

const ProjectDetail = ({ initialProject, initialProjects }: ProjectDetailProps = {}) => {
  const { slug } = useParams<{ slug?: string }>();
  const [project, setProject] = useState<Project | null | undefined>(initialProject ?? undefined);
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects ?? []);
  const [loading, setLoading] = useState(!initialProject);

  useEffect(() => {
    if (initialProject) return;

    const loadData = async () => {
      if (!slug) {
        setProject(null);
        setLoading(false);
        return;
      }

      const projectsData = await fetchProjects();
      const projectData =
        projectsData.find((candidate) => candidate.slug === slug || slugMatches(slug, candidate.name)) ?? null;

      setProject(projectData);
      setAllProjects(projectsData);
      setLoading(false);
    };

    loadData();
  }, [slug, initialProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 md:pt-20 animate-pulse">
          <section className="h-[42vh] md:h-[52vh] bg-muted/40" />
          <section className="py-12 md:py-16 lg:py-20">
            <div className="container-wide">
              <div className="h-4 w-40 bg-muted rounded mb-8" />
              <div className="h-12 md:h-16 w-2/3 bg-muted rounded mb-6" />
              <div className="h-5 w-1/2 bg-muted rounded" />
            </div>
          </section>
          <section className="pb-16 md:pb-24">
            <div className="container-wide grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-4">
                <div className="h-9 w-48 bg-muted rounded" />
                <div className="h-5 w-full bg-muted rounded" />
                <div className="h-5 w-11/12 bg-muted rounded" />
                <div className="h-5 w-10/12 bg-muted rounded" />
              </div>
              <div className="aspect-[4/3] bg-muted rounded" />
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!project) {
    return <NotFound />;
  }

  // Get next/prev projects
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  // Generate structured data for SEO
  const projectSchema = generateProjectSchema({
    name: project.name,
    description: project.description || project.overview || "",
    location: project.location,
    image: project.image,
    category: project.category,
    path: `/renovation-projects/${project.slug}`,
    publishedAt: project.publishedAt,
    modifiedAt: project.modifiedAt,
    authorName: project.authorName,
    tags: project.tags,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gold Coast Renovation Projects", url: "/renovation-projects" },
    { name: project.name, url: `/renovation-projects/${project.slug}` },
  ]);
  const categoryLabel = project.category.replace("-", " ");
  const outcomePoints = [
    `Improved ${categoryLabel} usability for daily routines`,
    `Renovation delivered for ${project.location} conditions and lifestyle`,
    "Sequenced works coordinated with clear planning milestones",
  ];
  const projectFeedbackQuote = getProjectFeedbackQuote(project);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${project.name} | ${project.category.replace("-", " ")} Renovations in ${project.location}`}
        description={project.description || `${project.name} - A ${project.category.replace("-", " ")} renovations case study in ${project.location}, Gold Coast by Concept Design Construct.`}
        url={`/renovation-projects/${project.slug}`}
        image={project.image}
        jsonLd={[projectSchema, breadcrumbSchema]}
      />
      <Header />

      {/* Hero Image Slider */}
      <section className="pt-16 md:pt-20">
        <ImageSlider images={project.gallery} projectName={project.name} />
      </section>

      {/* Project Header */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container-wide">
          <Link 
            to="/renovation-projects" 
            className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gold Coast Renovation Projects
          </Link>

          {/* Title Section */}
          <div className="max-w-4xl">
            <span className="text-label text-primary uppercase tracking-wider mb-4 block text-sm">
              {project.category.replace("-", " ")}
            </span>
            <h1 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground leading-tight mb-4 md:mb-6">
              {project.name}
            </h1>
            <p className="text-primary text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Project Snapshot */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-6 border border-foreground/15 p-6 md:p-8 bg-cream">
            <div>
              <p className="text-label text-foreground/50 mb-2">Category</p>
              <p className="font-serif text-xl text-primary">{categoryLabel}</p>
            </div>
            <div>
              <p className="text-label text-foreground/50 mb-2">Location</p>
              <p className="font-serif text-xl text-primary">{project.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="pb-16 md:pb-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-6">
                Overview
              </h2>
              <p className="text-primary/80 leading-relaxed text-lg">
                {project.overview}
              </p>
            </div>
            <div>
              {project.featuredImages[0] && (
                <ResponsiveImage
                  src={project.featuredImages[0]}
                  alt={`${project.name} detail`}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  quality={62}
                  responsiveWidths={[480, 640, 800, 960, 1200]}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="pb-16 md:pb-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="lg:order-2">
              <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-6">
                The Challenge
              </h2>
              <p className="text-primary/80 leading-relaxed text-lg">
                {project.challenge}
              </p>
            </div>
            <div className="lg:order-1">
              {project.featuredImages[1] && (
                <ResponsiveImage
                  src={project.featuredImages[1]}
                  alt={`${project.name} challenge`}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  quality={62}
                  responsiveWidths={[480, 640, 800, 960, 1200]}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="pb-16 md:pb-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-6">
              The Solution
            </h2>
            <p className="text-primary/80 leading-relaxed text-lg">
              {project.solution}
            </p>
          </div>

          {/* Featured Images Grid (3rd, 4th, 5th images) */}
          {project.featuredImages.length > 2 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.featuredImages.slice(2, 5).map((img, index) => (
                <ResponsiveImage
                  key={index}
                  src={img}
                  alt={`${project.name} detail ${index + 3}`}
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  quality={62}
                  responsiveWidths={[360, 480, 640, 800, 960]}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Outcomes + Testimonial */}
      <section className="pb-16 md:pb-24">
        <div className="container-wide grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-6">Project Outcomes</h2>
            <ul className="space-y-3 text-primary/80 list-disc pl-5">
              {outcomePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <aside className="border border-primary/20 bg-cream p-6 md:p-8">
            <p className="text-label text-primary mb-4">Client Feedback</p>
            <blockquote className="font-serif italic text-xl md:text-2xl text-primary leading-relaxed mb-6">
              “{projectFeedbackQuote}”
            </blockquote>
            <p className="text-xs uppercase tracking-wider text-primary/70 mb-6">Renovation Client · {project.location}</p>
            <Link
              to="/book-renovation-consultation"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Start Your Renovation Consultation
            </Link>
          </aside>
        </div>
      </section>

      {/* Project Metadata - Bottom */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide">
          <div className="border-t border-foreground/10 pt-6 md:pt-8 text-center">
            <span className="text-label text-foreground/40 uppercase tracking-wider text-xs block mb-2">
              Location
            </span>
            <p className="text-foreground font-serif text-sm md:text-lg">{project.location}</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-foreground/10 py-12">
        <div className="container-wide">
          <div className="flex justify-between items-center">
            {prevProject ? (
              <Link 
                to={`/renovation-projects/${prevProject.slug}`}
                className="group flex items-center gap-2 md:gap-4 text-foreground/60 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="text-label text-[10px] md:text-xs uppercase tracking-wider block mb-1">Previous</span>
                  <span className="font-serif italic text-sm md:text-lg text-primary">{prevProject.name}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link 
                to={`/renovation-projects/${nextProject.slug}`}
                className="group flex items-center gap-2 md:gap-4 text-right text-foreground/60 hover:text-foreground transition-colors"
              >
                <div>
                  <span className="text-label text-[10px] md:text-xs uppercase tracking-wider block mb-1">Next</span>
                  <span className="font-serif italic text-sm md:text-lg text-primary">{nextProject.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Suggested Projects */}
      <SuggestedProjects currentProjectId={project.id} />

      <div className="container-wide">
        <BottomInvitation
          title="Like our work?"
          description="If you're planning your own renovation, we'd love to hear about your project."
          className="mt-0 md:mt-6"
        />
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
