import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const renovationAfterImage =
  "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/RenovationAI.webp";
const renovationBeforeImage =
  "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Renovaton-before.webp";

const AIDesignIntro = () => {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Add your room photo",
      description: "Upload a clear, front-on shot of your space.",
    },
    {
      title: "Select your finishes",
      description: "Pick standard options or describe your style.",
    },
    {
      title: "Get your enhanced design",
      description: "See a refreshed look while keeping the same layout.",
    },
  ];

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <SEO
        title="AI Design Generator"
        description="Add images, select finishes, and get your enhanced design with our AI renovation generator."
        url="/design-tools/ai-generator/intro"
      />
      <Header />

      <main className="pt-24 md:pt-28 pb-16 md:pb-20 lg:pb-0 lg:h-[calc(100vh-112px)]">
        <div className="container-wide h-full flex flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <p className="text-xs tracking-[0.3em] uppercase text-primary-foreground/70">AI Design Tool</p>
              <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-primary-foreground">
                AI Renovation Generator
              </h1>
              <p className="text-primary-foreground/80 text-base md:text-lg">
                Get creative with your renovation ideas and see your space improve before you commit. Our AI helps you
                visualise the upgrade so you can make confident, clear decisions while keeping the same layout.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/60 mb-2">
                    Step {index + 1}
                  </p>
                  <p className="text-sm font-medium text-primary-foreground">{step.title}</p>
                  <p className="text-xs text-primary-foreground/70 mt-2">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => {
                  sessionStorage.setItem("aiGeneratorIntroSeen", "true");
                  navigate("/design-tools/ai-generator");
                }}
              >
                Continue to the generator
              </Button>
              <p className="text-xs text-primary-foreground/70">
                Best results come from bright, clutter-free photos.
              </p>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 grid grid-cols-2 gap-4 content-center">
            <div className="rounded-2xl overflow-hidden border border-primary-foreground/20 relative bg-primary-foreground/5">
              <div className="absolute top-3 left-3 right-3 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                <div className="bg-primary-foreground/90 border border-primary-foreground/20 rounded-full px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/80 w-fit">
                  Your image
                </div>
                <div className="bg-primary-foreground text-primary rounded-full px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] w-fit self-start sm:self-auto">
                  Before
                </div>
              </div>
              <img src={renovationBeforeImage} alt="Renovation before" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-primary-foreground/20 relative bg-primary-foreground/5">
              <div className="absolute top-3 left-3 right-3 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                <div className="bg-primary-foreground/90 border border-primary-foreground/20 rounded-full px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary/80 w-fit max-w-full">
                  CDC AI Renovator
                </div>
                <div className="bg-primary-foreground text-primary rounded-full px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] w-fit self-start sm:self-auto">
                  After
                </div>
              </div>
              <img src={renovationAfterImage} alt="Renovation after" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIDesignIntro;
