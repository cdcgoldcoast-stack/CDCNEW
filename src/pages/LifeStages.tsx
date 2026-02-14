import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import lifestageGrowing from "@/assets/lifestage-growing.jpg";
import lifestageForever from "@/assets/lifestage-forever.jpg";
import lifestageFuture from "@/assets/lifestage-future.jpg";
import lifestageWellness from "@/assets/lifestage-wellness.jpg";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import { generateFAQSchema } from "@/lib/structured-data";
import LifestyleSection from "@/components/LifestyleSection";

const LifeStagesPage = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  const benefits = [
    { text: "Reduce daily stress by improving flow and storage", number: "01" },
    { text: "Improve comfort with better light, ventilation, and insulation", number: "02" },
    { text: "Make routines easier (kitchen, laundry, bathrooms)", number: "03" },
    { text: "Improve safety, especially in bathrooms and on stairs", number: "04" },
    { text: "Support independence with smarter access and layout", number: "05" },
    { text: "Add value through high impact upgrades", number: "06" },
  ];

  const stages = [
    {
      title: "Growing Life",
      subtitle: "First Home, Young Couples, Young Families",
      description: "Common Gold Coast renovations in this stage",
      whyItMatters: "This stage is busy. Good design reduces friction, makes smaller homes feel bigger, and creates flexible zones for work, rest, and social life.",
      image: lifestageGrowing,
      features: [
        "Kitchen renovations: improve layout, bench space, storage",
        "Bathroom renovations: modernise, improve comfort",
        "Open plan layout changes to create better flow",
        "Storage and laundry upgrades to reduce clutter",
        "Outdoor living upgrades for entertaining",
      ],
    },
    {
      title: "The Forever Home Shift",
      subtitle: "Families and Long Term Living",
      description: "Common renovations in this stage",
      whyItMatters: "A home that supports routines feels calmer. You get privacy where you need it and connection where it matters.",
      image: lifestageForever,
      features: [
        "Home renovations that rework the layout for everyday routines",
        "Home extensions (extra bedroom, living space, retreat)",
        "Durable finishes that handle family life",
        "Acoustic, insulation, and comfort upgrades",
        "Outdoor areas that fit how you actually host and relax",
      ],
    },
    {
      title: "Future Ready Living",
      subtitle: "Future Proofing Without Losing Style",
      description: "Common upgrades in this stage",
      whyItMatters: "Future ready design reduces the chance of expensive renovations later, while keeping the home feeling premium and normal.",
      image: lifestageFuture,
      features: [
        "Better lighting and safer circulation",
        "Step free entries and smoother transitions",
        "Wider pathways and more usable space",
        "Flexible rooms (guest room that can become a main bedroom later)",
        "Bathroom planning that can adapt over time",
      ],
    },
    {
      title: "Staying Well at Home",
      subtitle: "Aging in Place, Accessibility, Independence",
      description: "Common aging in place renovations on the Gold Coast",
      whyItMatters: "These changes can reduce fall risk and make daily movement easier, helping people stay independent in the home longer.",
      image: lifestageWellness,
      features: [
        "Accessible bathroom renovation (step free shower, slip resistance)",
        "Grab rails and safer stair solutions",
        "Flooring changes to reduce trip hazards",
        "Better night lighting and clear navigation",
        "Kitchen changes that reduce bending, reaching, and strain",
      ],
    },
  ];

  const planningNotes = [
    "Check your builder and trades are QBCC licensed before you sign",
    "Understand progress payments and when they are due",
    "Keep contract variations in writing to avoid budget blowouts",
  ];

  const faqs = [
    {
      question: "How much does a bathroom renovation cost on the Gold Coast?",
      answer: "Costs vary by size, finishes, and whether plumbing moves. As a rough guide, some Gold Coast renovation providers cite ranges from around $20,000 to $30,000 for basic, $30,000 to $50,000 mid range, and $50,000 plus for high end.",
    },
    {
      question: "What renovations add the most value on the Gold Coast?",
      answer: "Kitchens, bathrooms, layout improvements, and outdoor living upgrades are consistently popular because they change daily usability and buyer appeal.",
    },
    {
      question: "How do I check if a builder is QBCC licensed?",
      answer: "You can verify a builder's QBCC licence on the Queensland Building and Construction Commission website. Simply search their name or licence number to confirm they are licensed and check for any disciplinary history.",
    },
    {
      question: "What is a contract variation?",
      answer: "A contract variation is a formal change to the original building contract. This can include changes to scope, materials, or pricing. Always get variations in writing and understand how they affect your timeline and budget before agreeing.",
    },
  ];

  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(faqs);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Life Stage Renovations | Gold Coast Homes"
        description="Find the right Gold Coast renovation for each life stage, from first homes and growing families to accessibility upgrades that support long-term living."
        url="/life-stages"
        jsonLd={faqSchema}
      />
      <Header />
      
      {/* Hero Section - Editorial Style */}
      <section ref={heroRef} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${lifestageForever})` }}
          />
        </motion.div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background"
          style={{ opacity: heroOpacity }}
        />
        
        <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
          <div className="container-wide">
            <motion.span 
              className="text-label text-primary mb-4 block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Life Stages
            </motion.span>
            <motion.h1 
              className="text-primary font-serif italic text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] max-w-4xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Renovations by Life Stage on the Gold Coast
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Intro Section - Magazine Pull Quote Style */}
      <section className="py-20 md:py-32 border-b border-foreground/10">
        <div className="container-wide">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16">
            <motion.div 
              className="md:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary font-serif italic text-2xl md:text-3xl leading-tight">
                Life changes. Your home should keep up.
              </p>
            </motion.div>
            <motion.div 
              className="md:col-span-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="text-foreground text-lg md:text-xl leading-relaxed">
                We help Gold Coast homeowners choose the right renovation based on the stage of life they are in, from first homes and growing families to future ready living and aging in place. The goal is simple: a home that feels better to live in every day, and still works as needs change.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lifestyle Enhancement Section */}
      <LifestyleSection />

      {/* Benefits Section - Numbered List Style */}
      <section className="py-20 md:py-32 bg-muted/20">
        <div className="container-wide">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h4 className="text-label text-foreground/60 mb-4">Why a Better Space Helps</h4>
            <h2 className="text-foreground font-serif italic text-2xl md:text-4xl">
              Health, Comfort, Daily Living
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <span className="text-primary/40 font-serif italic text-3xl leading-none group-hover:text-primary transition-colors">
                  {benefit.number}
                </span>
                <p className="text-foreground/70 text-base leading-relaxed pt-1">
                  {benefit.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Life Stage Sections - Editorial Magazine Layout */}
      {stages.map((stage, index) => (
        <section 
          key={index}
          className="border-b border-foreground/10"
        >
          <div className={`grid md:grid-cols-2 min-h-[80vh] ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            {/* Image - Full Height */}
            <motion.div 
              className={`relative h-[50vh] md:h-auto overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.img 
                src={stage.image} 
                alt={stage.title}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:hidden" />
            </motion.div>

            {/* Content */}
            <motion.div 
              className={`flex flex-col justify-center p-8 md:p-16 lg:p-24 ${index % 2 === 1 ? 'md:order-1' : ''}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="text-label text-foreground/50 mb-3">{stage.subtitle}</span>
              <h2 className="text-foreground font-serif italic text-3xl md:text-4xl lg:text-5xl mb-6">
                {stage.title}
              </h2>
              
              <p className="text-foreground/50 text-sm uppercase tracking-wider mb-4">
                {stage.description}
              </p>
              
              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {stage.features.map((feature, featureIndex) => (
                  <motion.li 
                    key={featureIndex}
                    className="flex items-start gap-3 text-foreground/70"
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + featureIndex * 0.08 }}
                  >
                    <span className="w-1 h-1 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    <span className="text-sm md:text-base">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-6 border-t border-foreground/10">
                <p className="text-label text-foreground/50 mb-2">Why it matters</p>
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-serif italic">
                  {stage.whyItMatters}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Planning Notes Section */}
      <section className="py-20 md:py-32 bg-primary text-white relative overflow-hidden">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"
          animate={{
            background: [
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
              "linear-gradient(225deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.9) 100%)",
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating decorative elements */}
        <motion.div 
          className="absolute top-20 left-10 w-2 h-2 rounded-full bg-white/20"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-32 right-20 w-3 h-3 rounded-full bg-white/15"
          animate={{ y: [0, 15, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container-wide relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h4 className="text-label text-white/60 mb-4">Trust and Peace of Mind</h4>
              <h2 className="font-serif italic text-2xl md:text-4xl mb-6">
                Gold Coast Planning Notes
              </h2>
              <p className="text-white/70 text-lg mb-12">
                If you are renovating in Queensland, it is worth doing the boring parts properly:
              </p>
            </motion.div>
            
            <div className="space-y-6">
              {planningNotes.map((note, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <span className="text-white/40 font-serif italic text-2xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-white/90 text-base md:text-lg">{note}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 border-b border-foreground/10">
        <div className="container-wide">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16">
            <motion.div 
              className="md:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-label text-foreground/60 mb-4">Gold Coast Renovation Costs</p>
              <h2 className="text-foreground font-serif italic text-2xl md:text-3xl">
                Life Stage Renovation FAQs
              </h2>
            </motion.div>
            
            <motion.div 
              className="md:col-span-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-foreground/10">
                    <AccordionTrigger className="text-left text-foreground hover:text-primary text-base md:text-lg py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-base leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="font-serif italic text-3xl md:text-4xl lg:text-5xl mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Not sure which stage fits you?
            </motion.h2>
            <motion.p 
              className="text-foreground/60 text-lg md:text-xl max-w-xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Life does not fit neatly into categories. Let us have a conversation about where you are and what your home could become.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link 
                to="/get-quote"
                className="inline-block bg-primary text-primary-foreground px-10 py-4 text-label hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LifeStagesPage;
