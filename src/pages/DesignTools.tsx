import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Palette, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const DesignTools = () => {
  const tools = [
    {
      title: "AI Design Generator",
      subtitle: "Visualise Your Space",
      description: "Upload a photo of your room and see it transformed with AI-powered design concepts. Explore different styles, colours, and layouts before committing.",
      features: ["Upload any room photo", "Multiple style options", "Instant results"],
      href: "/design-tools/ai-generator/intro",
      comingSoon: false,
      icon: Sparkles,
    },
    {
      title: "Moodboard Creator",
      subtitle: "Collect Inspiration",
      description: "Gather and organise your design inspiration in one place. Save images, colours, and ideas to share with our team.",
      features: ["Save inspiration", "Organise by room", "Share with us"],
      href: "/design-tools/moodboard",
      comingSoon: false,
      icon: Palette,
    },
    {
      title: "Style Quiz",
      subtitle: "Find Your Style",
      description: "Not sure what style suits you? Take our quick quiz to discover your unique interior design preferences.",
      features: ["2-minute quiz", "Personalised results", "Style guide"],
      href: "/design-tools/style-quiz",
      comingSoon: true,
      icon: HelpCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      <SEO
        title="Design Tools | Visualise Your Gold Coast Renovation"
        description="Use our free design tools to visualise your Gold Coast renovation. AI Design Generator and Moodboard Creator to plan your dream home."
        url="/design-tools"
      />

      {/* Decorative elements for creative feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container-wide mb-16 md:mb-24">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="text-label text-white/60 mb-4 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to the Creative Studio
            </motion.p>
            <h1 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-white whitespace-nowrap">
              Where Your Ideas Come to Life
            </h1>
          </motion.div>
        </section>

        {/* Tools Grid */}
        <section className="container-wide">
          <h2 className="sr-only">Available renovation design tools</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                >
                  {tool.comingSoon ? (
                    <div className="h-full bg-white/10 backdrop-blur-sm border border-white/20 p-8 md:p-10 flex flex-col rounded-sm">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6">
                        <Icon className="w-7 h-7 text-white/40" />
                      </div>

                      <p className="text-label text-white/40 mb-2 tracking-wider">{tool.subtitle}</p>
                      <h3 className="font-serif italic text-2xl md:text-3xl text-white/40 mb-4">
                        {tool.title}
                      </h3>
                      <p className="text-white/30 leading-relaxed mb-6 flex-grow">
                        {tool.description}
                      </p>

                      <ul className="space-y-2 mb-8">
                        {tool.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-white/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <span className="text-label text-white/30 uppercase tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                  ) : (
                    <Link
                      to={tool.href}
                      className="h-full bg-white p-8 md:p-10 flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-sm"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                      </div>

                      <p className="text-label text-primary mb-2 tracking-wider">{tool.subtitle}</p>
                      <h3 className="font-serif italic text-2xl md:text-3xl text-foreground mb-4 group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed mb-6 flex-grow">
                        {tool.description}
                      </p>

                      <ul className="space-y-2 mb-8">
                        {tool.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-foreground/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <span className="text-label text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                        Start Creating <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="container-wide mt-12 md:mt-16">
          <div className="border border-white/20 bg-white/5 backdrop-blur-sm rounded-sm p-6 md:p-8">
            <h2 className="font-serif italic text-2xl md:text-3xl text-white mb-3">Useful Planning Links</h2>
            <p className="text-white/75 mb-4 max-w-3xl">
              Move from concept to action by comparing services, reviewing completed projects, and preparing a brief.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:text-base">
              <Link to="/services" className="text-white hover:text-white/70 underline underline-offset-4">
                Review renovation services and scope options
              </Link>
              <Link to="/projects" className="text-white hover:text-white/70 underline underline-offset-4">
                Browse completed renovation project portfolio
              </Link>
              <Link to="/design-tools/ai-generator/intro" className="text-white hover:text-white/70 underline underline-offset-4">
                Open the AI renovation generator preview
              </Link>
              <Link to="/design-tools/moodboard" className="text-white hover:text-white/70 underline underline-offset-4">
                Start a renovation moodboard collection
              </Link>
              <Link to="/get-quote" className="text-white hover:text-white/70 underline underline-offset-4">
                Book a renovation consultation call
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="container-wide mt-20 md:mt-32">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/60 text-lg mb-6">
              Ready to turn ideas into reality?
            </p>
            <Link
              to="/get-quote"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 text-label hover:bg-white/90 transition-colors"
            >
              Get Your Renovation Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DesignTools;
