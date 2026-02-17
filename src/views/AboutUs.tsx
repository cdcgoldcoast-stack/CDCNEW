import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useResolvedAsset } from "@/hooks/useSiteAssets";
import SEO from "@/components/SEO";
import { generateAboutPageSchema } from "@/lib/structured-data";
import ProjectsTeaser from "@/components/ProjectsTeaser";
import BottomInvitation from "@/components/BottomInvitation";
import ResponsiveImage from "@/components/ResponsiveImage";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const heroImage = "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/licensed-builders-on-site-gold-coast.webp";
  const teamImage = useResolvedAsset("editorial-7");

  const whatWeDo = [
    "Full property renovations",
    "Extensions",
    "Bathroom renovations",
    "Kitchen renovations",
    "Laundry renovations"
  ];
  
  const aboutSchema = generateAboutPageSchema();
  
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Our Gold Coast Renovation Team | Since 2000"
        description="Meet Concept Design Construct, QBCC licensed specialists delivering Gold Coast renovations across kitchen, bathroom, extension, and full-home projects since 2000."
        url="/about-us"
        jsonLd={aboutSchema}
      />
      <Header />

      {/* 1. HERO - About Us */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">About Us</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-8">
                A Strong Team That Takes Pride In Their Work
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                We started Concept Design Construct with the vision of building a strong team where everyone works well together and takes pride in their work.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Based on the Gold Coast, we specialise in full property renovations and extensions including bathroom renovations, as well as kitchen and laundry renovations. We work with trusted trades and a clear process to deliver high-quality results and a smooth experience from start to finish.
              </p>
            </div>
            <div className="aspect-[4/5] overflow-hidden">
              <ResponsiveImage
                src={heroImage}
                alt="Concept Design Construct renovation team working on a Gold Coast home"
                width={1200}
                height={1500}
                sizes="(min-width: 1024px) 40vw, 100vw"
                loading="eager"
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO */}
      <section className="py-16 md:py-20 bg-foreground relative z-10">
        <div className="container-wide">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-16">
            {whatWeDo.map((item, index) => (
              <li key={index} className="text-background/90 font-serif italic text-lg md:text-xl list-none">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. HOW WE WORK */}
      <section className="py-20 md:py-28 bg-background relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-label text-foreground/60 mb-4">How We Work</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-6">
              Trusted Trades And A Clear Process
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              We've built a network of trades we trust. People who do good work, show up when they say they will, and care about the end result as much as we do.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <span className="text-primary text-4xl font-serif italic block mb-4">01</span>
              <h3 className="font-serif text-h3 text-foreground mb-3">Clear Communication</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                You'll always know what's happening with your project. No guessing, no chasing.
              </p>
            </div>
            <div className="text-center">
              <span className="text-primary text-4xl font-serif italic block mb-4">02</span>
              <h3 className="font-serif text-h3 text-foreground mb-3">Realistic Timelines</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                We give you honest timeframes upfront and keep you updated along the way.
              </p>
            </div>
            <div className="text-center">
              <span className="text-primary text-4xl font-serif italic block mb-4">03</span>
              <h3 className="font-serif text-h3 text-foreground mb-3">Quality Results</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                We don't cut corners. Every job is done <strong>properly, the first time</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE TEAM - Full width image with dark overlay (no red) */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <ResponsiveImage
            src={teamImage}
            alt="Concept Design Construct renovation team on a Gold Coast project site"
            width={1200}
            height={900}
            sizes="100vw"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container-wide relative z-10">
          <div className="max-w-2xl">
            <p className="text-label text-background/70 mb-4">The Team</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-background leading-tight mb-6">
              People Who Care About What They Do
            </h2>
            <p className="text-background/80 text-lg leading-relaxed mb-6">
              Our team is built around people who work well together and genuinely care about doing a good job. Everyone takes ownership of their work.
            </p>
            <p className="text-background/70 leading-relaxed">
              Low staff turnover means the same people work on your project from start to finish. You'll get to know us, and we'll get to know what matters to you.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHY IT MATTERS */}
      <section className="py-20 md:py-28 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <p className="text-label text-foreground/60 mb-4 text-center">Why It Matters</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-8 text-center">
              A Smooth Experience From Start To Finish
            </h2>
            <div className="space-y-6 text-foreground/70 leading-relaxed">
              <p>
                We've seen what happens when renovations go wrong. Miscommunication, delays, and stress that takes the excitement out of improving your home.
              </p>
              <p>
                That's not how we work. We're upfront about costs, clear about timelines, and easy to get hold of when you have questions.
              </p>
              <p className="text-foreground font-medium">
                The goal is simple: deliver high-quality results and make the whole process feel straightforward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROJECTS TEASER - Same as homepage */}
      <ProjectsTeaser />

      <div className="relative z-10">
        <BottomInvitation
          title="Talk Through Your Renovation"
          description="Whether you're planning a bathroom update, a kitchen makeover, or full-home renovations, we'd love to hear about it."
          className="mt-0 mb-0"
        />
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
