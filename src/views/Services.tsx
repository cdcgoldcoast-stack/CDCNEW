import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import WhatWeRenovateSplit from "@/components/WhatWeRenovateSplit";
import ResponsiveImage from "@/components/ResponsiveImage";

const serviceScopes = [
  {
    title: "Kitchen Renovation Service Scope",
    summary: "Layout improvements, cabinetry planning, appliance integration, and lighting upgrades.",
    link: "/renovation-projects/coastal-modern",
    linkLabel: "View kitchen project example",
  },
  {
    title: "Bathroom Renovation Service Scope",
    summary: "Waterproofing-led upgrades, fixture selection, storage planning, and practical detailing.",
    link: "/renovation-projects/seamless-bathroom",
    linkLabel: "View bathroom project example",
  },
  {
    title: "Whole-Home Renovation Service Scope",
    summary: "Flow, zoning, and staged works planning for better daily living outcomes.",
    link: "/renovation-projects/light-and-flow-house",
    linkLabel: "View whole-home project example",
  },
];

const processSteps = [
  "Consultation and renovation brief alignment",
  "Scope definition, sequencing, and realistic timeline mapping",
  "Selections, documentation, and approvals pathway guidance",
  "Construction delivery with milestone communication",
  "Practical completion, defects close-out, and handover",
];

const serviceFaqs = [
  {
    question: "How do we choose between a staged renovation and full renovation?",
    answer:
      "We map lifestyle constraints, budget boundaries, and sequencing risk first. That determines whether staged delivery or a single full renovation is the better fit.",
  },
  {
    question: "Do you provide clear timelines before construction starts?",
    answer:
      "Yes. We provide a practical timeline once scope and selections are defined so decisions are made with realistic expectations.",
  },
  {
    question: "Can you coordinate kitchen, bathroom, and living-area upgrades together?",
    answer:
      "Yes. Multi-space scopes are coordinated to reduce rework and keep handover quality consistent across the whole renovation.",
  },
];

const Services = () => {
  const { assets } = useSiteAssets();
  const heroImage = assets["service-bg-whole-home"] || assets["service-whole-home"];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gold Coast Renovations | Services for Kitchen, Bathroom & Full Home"
        description="Explore Gold Coast renovations for kitchens, bathrooms, whole-home upgrades, and extensions with design-led planning and QBCC licensed delivery."
        url="/services"
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-label text-primary mb-6">Services</p>
              <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
                Gold Coast Renovation Services Built Around How You Live
              </h1>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                From kitchens and bathrooms to whole home renovations and extensions, we design and build
                spaces that improve <strong>flow, comfort, and everyday routines</strong>.
              </p>
              <Link
                to="/get-quote"
                className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
              >
                Get a Consultation
              </Link>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              {heroImage && (
                <ResponsiveImage
                  src={heroImage}
                  alt="Gold Coast whole-home renovation living space by Concept Design Construct"
                  width={1200}
                  height={1500}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  loading="eager"
                  priority
                  quality={62}
                  responsiveWidths={[360, 480, 640, 768, 960, 1200]}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services layout */}
      <h2 className="sr-only">Renovation service categories</h2>
      <WhatWeRenovateSplit />

      <section className="bg-background relative z-10 py-16 md:py-20">
        <div className="container-wide">
          <div className="max-w-3xl mb-10">
            <p className="text-label text-primary mb-4">Service Scope</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
              Renovation Services Matched To The Way You Live
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Every scope starts with the same objective: reduce disruption, improve usability, and deliver a result
              that still works years after handover.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {serviceScopes.map((scope) => (
              <article key={scope.title} className="border border-foreground/15 p-6 md:p-7 bg-background">
                <h3 className="font-serif text-2xl text-primary mb-4">{scope.title}</h3>
                <p className="text-foreground/75 leading-relaxed mb-6">{scope.summary}</p>
                <Link
                  to={scope.link}
                  className="text-xs uppercase tracking-wider text-primary underline decoration-primary/40 hover:decoration-primary"
                >
                  {scope.linkLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream relative z-10 py-16 md:py-20">
        <div className="container-wide grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-label text-primary mb-4">Process</p>
            <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-5">
              How We Run A Gold Coast Renovation
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-8">
              Clear steps, decision points, and communication milestones are built into every project to avoid scope
              confusion and timeline drift.
            </p>
            <ol className="space-y-3 text-foreground/80 list-decimal pl-5">
              {processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <aside className="border border-primary/25 bg-background p-6 md:p-8">
            <p className="text-label text-primary mb-4">Trust Signals</p>
            <h3 className="font-serif text-2xl text-primary mb-4">Licensed, Accountable, Documented</h3>
            <ul className="space-y-3 text-foreground/80 list-disc pl-5 mb-8">
              <li>QBCC licensed renovation delivery</li>
              <li>Master Builders affiliation</li>
              <li>Transparent scope, inclusions, and timeline checkpoints</li>
              <li>Direct communication from planning through handover</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/get-quote"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Book Consultation
              </Link>
              <a
                href="tel:1300020232"
                className="inline-block border border-foreground/40 text-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
              >
                Call 1300 020 232
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-background relative z-10 py-16 md:py-20">
        <div className="container-wide max-w-4xl">
          <p className="text-label text-primary mb-4">FAQs</p>
          <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground leading-tight mb-8">
            Service Planning Questions We Hear Most
          </h2>
          <div className="space-y-6">
            {serviceFaqs.map((faq) => (
              <article key={faq.question} className="border-b border-foreground/10 pb-6">
                <h3 className="font-serif text-2xl text-primary mb-3">{faq.question}</h3>
                <p className="text-foreground/75 leading-relaxed">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
