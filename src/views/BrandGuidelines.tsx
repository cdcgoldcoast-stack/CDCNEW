import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import logo from "@/assets/logo.webp";
import SEO from "@/components/SEO";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const BrandGuidelines = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Brand Guidelines"
        description="Internal Concept Design Construct brand guidelines."
        url="/brand-guidelines"
        noIndex={true}
      />
      {/* Header */}
      <header className="py-8 md:py-12 lg:py-20 border-b border-border">
        <div className="container-wide">
          <p className="text-label text-muted-foreground mb-3 md:mb-4">Internal Document</p>
          <h1 className="mb-3 md:mb-4 text-2xl md:text-4xl lg:text-5xl">Brand Guidelines</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Concept Design Construct - The single source of truth for brand representation across all touchpoints.
          </p>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="py-6 md:py-8 border-b border-border bg-secondary/30">
        <div className="container-wide">
          <p className="text-label text-muted-foreground mb-3 md:mb-4">Contents</p>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 text-sm">
            <a href="#overview" className="hover:text-primary transition-colors py-1">1. Brand Overview</a>
            <a href="#logo" className="hover:text-primary transition-colors py-1">2. Logo Usage</a>
            <a href="#colour" className="hover:text-primary transition-colors py-1">3. Colour System</a>
            <a href="#typography" className="hover:text-primary transition-colors py-1">4. Typography</a>
            <a href="#voice" className="hover:text-primary transition-colors py-1">5. Brand Voice</a>
            <a href="#application" className="hover:text-primary transition-colors py-1">6. Application Examples</a>
            <a href="#layout" className="hover:text-primary transition-colors py-1">7. Layout & Spacing</a>
            <a href="#imagery" className="hover:text-primary transition-colors py-1">8. Imagery & Visual Style</a>
            <a href="#governance" className="hover:text-primary transition-colors py-1">9. Governance</a>
          </div>
        </div>
      </nav>

      <main className="py-16 md:py-24">
        <div className="container-wide space-y-24 md:space-y-32">

          {/* 1. Brand Overview */}
          <motion.section id="overview" {...fadeIn}>
            <h2 className="mb-8">1. Brand Overview</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="mb-4 not-italic">About Concept Design Construct</h3>
                <p className="text-muted-foreground mb-6">
                  Concept Design Construct is a Gold Coast renovation company specializing in creating homes designed around flow, comfort, and everyday living. We offer whole home, kitchen, and bathroom renovations, focusing on enhancing the homeowner's lifestyle through clear systems, reliable communication, and long-term value.
                </p>
              </div>
              
              <div>
                <h3 className="mb-4 not-italic">What We Stand For</h3>
                <p className="text-muted-foreground mb-6">
                  We exist to transform how homeowners experience renovation-removing the stress and uncertainty, replacing it with clarity and confidence. Our work is for Gold Coast homeowners who value quality outcomes and want a partner they can trust.
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-secondary/50 border border-border">
              <h3 className="mb-4 not-italic">Core Positioning</h3>
              <p className="text-xl font-serif text-foreground">
                Lifestyle-focused renovation partner for Gold Coast homeowners.
              </p>
            </div>

            <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
              {["Trust", "Organisation", "Accountability", "Quality Outcomes", "Clear Communication"].map((value) => (
                <div key={value} className="p-3 md:p-4 bg-card border border-border text-center">
                  <p className="text-xs md:text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 2. Logo Usage */}
          <motion.section id="logo" {...fadeIn}>
            <h2 className="mb-8">2. Logo Usage</h2>
            
            <div className="max-w-md mb-12">
              <h3 className="mb-4 not-italic">Primary Logo</h3>
              <div className="aspect-video bg-background border border-border flex items-center justify-center p-8 mb-4">
                <img src={logo} alt="Concept Design Construct Logo" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">
                The primary logo. Always use on light backgrounds with sufficient contrast.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <div>
                <h4 className="mb-2 md:mb-3 not-italic uppercase tracking-wider text-xs md:text-sm">Clear Space</h4>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Maintain clear space around the logo equal to the height of the "C" in CONSTRUCT. No elements should enter this zone.
                </p>
              </div>
              <div>
                <h4 className="mb-2 md:mb-3 not-italic uppercase tracking-wider text-xs md:text-sm">Minimum Size</h4>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Desktop: 120px width minimum<br />
                  Mobile: 80px width minimum<br />
                  Print: 30mm width minimum
                </p>
              </div>
              <div>
                <h4 className="mb-2 md:mb-3 not-italic uppercase tracking-wider text-xs md:text-sm">Approved Backgrounds</h4>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Warm cream (#FFFEF5), white, or clean photography with sufficient contrast.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use provided logo files only</li>
                  <li>• Maintain clear space requirements</li>
                  <li>• Use on approved backgrounds</li>
                  <li>• Scale proportionally</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" /> Don't
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Stretch or distort the logo</li>
                  <li>• Change logo colours arbitrarily</li>
                  <li>• Place on busy or low-contrast backgrounds</li>
                  <li>• Add effects (shadows, outlines, gradients)</li>
                  <li>• Recreate or modify the logo</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 3. Colour System */}
          <motion.section id="colour" {...fadeIn}>
            <h2 className="mb-8">3. Colour System</h2>
            
            <div className="mb-8 md:mb-12">
              <h3 className="mb-4 md:mb-6 not-italic">Primary Colours</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
                <ColourSwatch name="Background" hex="#FFFEF5" hsl="56 100% 97%" usage="Main page background" />
                <ColourSwatch name="Charcoal" hex="#0a0a0a" hsl="0 0% 4%" usage="Primary text, dark backgrounds" />
                <ColourSwatch name="Warm Cream" hex="#FFFEF5" hsl="56 100% 97%" usage="Primary backgrounds" />
                <ColourSwatch name="Brand Red" hex="#C8102E" hsl="350 85% 42%" usage="Accents, CTAs, highlights" />
                <ColourSwatch name="Burgundy" hex="#A50034" hsl="341 100% 32%" usage="Hover states, depth" />
              </div>
            </div>

            <div className="mb-8 md:mb-12">
              <h3 className="mb-4 md:mb-6 not-italic">Secondary & Neutral Colours</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <ColourSwatch name="Sand" hex="#F5F3E6" hsl="56 60% 92%" usage="Secondary backgrounds" />
                <ColourSwatch name="Blush" hex="#F2D7D5" hsl="4 49% 89%" usage="Soft accents" />
                <ColourSwatch name="Pink" hex="#EAB8C9" hsl="338 48% 82%" usage="Decorative elements" />
                <ColourSwatch name="Grey" hex="#6b6b6b" hsl="0 0% 42%" usage="Muted text, borders" />
              </div>
            </div>

            <div className="p-8 bg-secondary/50 border border-border mb-8">
              <h4 className="mb-4 not-italic uppercase tracking-wider">Contrast & Accessibility</h4>
              <p className="text-sm text-muted-foreground mb-4">
                All text must meet WCAG 2.1 AA standards. Primary text on background colours must have a contrast ratio of at least 4.5:1. Large text (18px+) requires 3:1 minimum.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Charcoal on Warm Cream: ✓ Compliant</li>
                <li>• Brand Red on Warm Cream: ✓ Compliant for large text</li>
                <li>• White on Brand Red: ✓ Compliant</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use charcoal for primary text</li>
                  <li>• Reserve brand red for key actions and accents</li>
                  <li>• Maintain high contrast for readability</li>
                  <li>• Use warm cream as the dominant background</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" /> Don't
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Overuse brand red-it loses impact</li>
                  <li>• Use pink or blush for text</li>
                  <li>• Combine low-contrast colour pairs</li>
                  <li>• Introduce new colours without approval</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 4. Typography */}
          <motion.section id="typography" {...fadeIn}>
            <h2 className="mb-8">4. Typography</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="mb-4 not-italic">Primary Font - Georgia</h3>
                <p className="font-serif text-4xl mb-4">Aa Bb Cc Dd Ee</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Georgia is used for all headings and display text. It conveys sophistication, trustworthiness, and timeless quality.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Usage: H1, H2, H3, H4, taglines, quotes</li>
                  <li>• Weights: Regular (400) only</li>
                  <li>• Styles: Normal and Italic</li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 not-italic">Secondary Font - Helvetica Neue</h3>
                <p className="font-sans text-4xl mb-4">Aa Bb Cc Dd Ee</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Helvetica Neue (or Arial as fallback) is used for body text, UI elements, and functional copy. Clean and highly legible.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Usage: Body, buttons, labels, captions</li>
                  <li>• Weights: Regular (400), Medium (500)</li>
                  <li>• Styles: Normal only</li>
                </ul>
              </div>
            </div>

            <div className="mb-12 p-4 md:p-8 bg-secondary/50 border border-border">
              <h4 className="mb-4 md:mb-6 not-italic uppercase tracking-wider">Type Scale</h4>
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 border-b border-border pb-4">
                  <span className="text-label w-16">H1</span>
                  <span className="font-serif text-2xl md:text-5xl">Heading One</span>
                  <span className="text-xs md:text-sm text-muted-foreground md:ml-auto">3.1rem / 2.35rem mobile</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 border-b border-border pb-4">
                  <span className="text-label w-16">H2</span>
                  <span className="font-serif text-xl md:text-4xl">Heading Two</span>
                  <span className="text-xs md:text-sm text-muted-foreground md:ml-auto">2.3rem / 1.8rem mobile</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 border-b border-border pb-4">
                  <span className="text-label w-16">H3</span>
                  <span className="font-serif text-lg md:text-xl italic">Heading Three</span>
                  <span className="text-xs md:text-sm text-muted-foreground md:ml-auto">1.2rem italic</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 border-b border-border pb-4">
                  <span className="text-label w-16">H4</span>
                  <span className="font-serif text-sm italic uppercase tracking-wider">Heading Four</span>
                  <span className="text-xs md:text-sm text-muted-foreground md:ml-auto">0.85rem italic uppercase</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 border-b border-border pb-4">
                  <span className="text-label w-16">Body</span>
                  <span className="font-sans text-base md:text-lg">Body text for paragraphs.</span>
                  <span className="text-xs md:text-sm text-muted-foreground md:ml-auto">1.125rem</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                  <span className="text-label w-16">Small</span>
                  <span className="font-sans text-sm">Captions and supplementary text.</span>
                  <span className="text-xs md:text-sm text-muted-foreground md:ml-auto">0.95rem</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use Georgia for all headings</li>
                  <li>• Use Helvetica Neue for body copy</li>
                  <li>• Maintain the type scale hierarchy</li>
                  <li>• Use italic Georgia for H3/H4 as defined</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" /> Don't
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mix fonts within a single text block</li>
                  <li>• Use bold Georgia (not part of the system)</li>
                  <li>• Introduce additional typefaces</li>
                  <li>• Use all-caps except for labels</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 5. Brand Voice & Messaging */}
          <motion.section id="voice" {...fadeIn}>
            <h2 className="mb-8">5. Brand Voice & Messaging</h2>
            
            <div className="mb-12">
              <h3 className="mb-4 not-italic">Tone of Voice</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Professional", "Reassuring", "Practical", "Client-Centric"].map((tone) => (
                  <div key={tone} className="p-4 bg-primary text-primary-foreground text-center">
                    <p className="font-medium">{tone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="mb-4 not-italic">Messaging Pillars</h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li><strong className="text-foreground">Trust:</strong> We follow through on every commitment. No surprises.</li>
                  <li><strong className="text-foreground">Clarity:</strong> Simple communication. Clear timelines. Transparent pricing.</li>
                  <li><strong className="text-foreground">Quality Outcomes:</strong> The result matters. We build to last.</li>
                  <li><strong className="text-foreground">Ownership:</strong> Your project is our responsibility until completion.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 not-italic">Tagline</h3>
                <p className="font-serif text-2xl italic text-foreground mb-4">
                  Life feels better when your home works better.
                </p>
                <p className="text-sm text-muted-foreground">
                  Use the tagline sparingly for maximum impact. It appears on hero sections and key marketing materials only.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider">Example Headlines</h4>
                <ul className="space-y-3 font-serif text-lg">
                  <li>"Designed for how you actually live."</li>
                  <li>"Renovation without the renovation stress."</li>
                  <li>"Your home, reimagined."</li>
                  <li>"Built around your life."</li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider">Example Body Copy</h4>
                <p className="text-muted-foreground">
                  "We're not here to just build rooms. We're here to transform how you experience your home-every morning, every evening, every moment in between. That means listening first, planning carefully, and delivering exactly what we promised."
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Words to Use
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Flow", "Lifestyle", "Clarity", "Quality", "Trust", "Partner", "Transform", "Seamless", "Confident", "Crafted", "Thoughtful", "Reliable"].map((word) => (
                    <span key={word} className="px-3 py-1 bg-secondary border border-border text-sm">{word}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" /> Words to Avoid
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Cheap", "Budget", "Fast", "Hack", "Trendy", "Luxury", "Exclusive", "Premium", "Revolutionary", "Disrupting", "Game-changing"].map((word) => (
                    <span key={word} className="px-3 py-1 bg-muted border border-border text-sm text-muted-foreground">{word}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* 6. Application Examples */}
          <motion.section id="application" {...fadeIn}>
            <h2 className="mb-8">6. Application Examples</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="mb-4 not-italic">Website Sections</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Hero: Large imagery, tagline overlay, single CTA</li>
                  <li>• Service sections: Image + text split, generous padding</li>
                  <li>• Testimonials: Italic quotes, client name below</li>
                  <li>• Footer: Simple, structured, key links only</li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 not-italic">Call-to-Actions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Primary CTA: Brand red background, white text</li>
                  <li>• Secondary CTA: Outline or text link</li>
                  <li>• Keep CTA copy short and action-oriented</li>
                  <li>• Examples: "Get a Quote", "View Our Work", "Start Your Project"</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="mb-4 not-italic">Social Media Captions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep captions concise and conversational. Lead with the outcome or emotion. Use hashtags sparingly (3-5 max).
                </p>
                <div className="p-4 bg-secondary/50 border border-border">
                  <p className="text-sm italic">
                    "Morning coffee hits different when your kitchen finally works the way you need it to. ☕<br /><br />
                    Another Gold Coast kitchen, designed for real life.<br /><br />
                    #GoldCoastRenovation #KitchenDesign #ConceptDesignConstruct"
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 not-italic">Long-form vs Short-form</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong className="text-foreground">Short-form:</strong> Direct, punchy, one key message. Used for social, ads, CTAs.</li>
                  <li><strong className="text-foreground">Long-form:</strong> Story-driven, client-focused, educational. Used for case studies, blog posts, about pages.</li>
                  <li>Both maintain the same tone-professional, reassuring, practical.</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 7. Layout & Spacing */}
          <motion.section id="layout" {...fadeIn}>
            <h2 className="mb-8">7. Layout & Spacing Principles</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="mb-4 not-italic">Section Padding</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-secondary/50 border border-border">
                    <p className="font-medium">Desktop</p>
                    <p className="text-muted-foreground">py-32 to py-40 (128px – 160px)</p>
                  </div>
                  <div className="p-4 bg-secondary/50 border border-border">
                    <p className="font-medium">Tablet</p>
                    <p className="text-muted-foreground">py-24 to py-32 (96px – 128px)</p>
                  </div>
                  <div className="p-4 bg-secondary/50 border border-border">
                    <p className="font-medium">Mobile</p>
                    <p className="text-muted-foreground">py-16 to py-24 (64px – 96px)</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 not-italic">Container Widths</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-secondary/50 border border-border">
                    <p className="font-medium">Wide Container</p>
                    <p className="text-muted-foreground">max-width: 1280px (80rem)</p>
                  </div>
                  <div className="p-4 bg-secondary/50 border border-border">
                    <p className="font-medium">Narrow Container</p>
                    <p className="text-muted-foreground">max-width: 768px (48rem)</p>
                  </div>
                  <div className="p-4 bg-secondary/50 border border-border">
                    <p className="font-medium">Horizontal Padding</p>
                    <p className="text-muted-foreground">px-8 (32px) / px-12 (48px) on md+</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-secondary/50 border border-border mb-8">
              <h4 className="mb-4 not-italic uppercase tracking-wider">Spacing Philosophy</h4>
              <p className="text-muted-foreground">
                The brand aesthetic prioritises generous white space, creating a sense of calm and clarity. Layouts should feel open and breathable, never cramped. Content should have room to be appreciated. When in doubt, add more space.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider">Grid System</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 12-column grid on desktop</li>
                  <li>• 4-column grid on mobile</li>
                  <li>• Gap: 24px (1.5rem) to 48px (3rem)</li>
                  <li>• Align to grid edges, not centre</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider">Text & Image Balance</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Text blocks: max-width 65 characters</li>
                  <li>• Images should anchor layouts</li>
                  <li>• Asymmetric layouts preferred</li>
                  <li>• Imagery leads, text supports</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 8. Imagery & Visual Style */}
          <motion.section id="imagery" {...fadeIn}>
            <h2 className="mb-8">8. Imagery & Visual Style</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="mb-4 not-italic">Photography Style</h3>
                <p className="text-muted-foreground mb-4">
                  All imagery must be real photography. AI-generated or stock imagery that looks artificial is not permitted.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Homes in use, not staged showrooms</li>
                  <li>• Natural light, warm tones</li>
                  <li>• Lifestyle moments over product shots</li>
                  <li>• Local Gold Coast context when possible</li>
                  <li>• High resolution (min 2000px on long edge)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 not-italic">Preferred Subjects</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Kitchen and bathroom details</li>
                  <li>• People living in renovated spaces</li>
                  <li>• Morning light, calm moments</li>
                  <li>• Architectural details and craftsmanship</li>
                  <li>• Before/after comparisons</li>
                  <li>• Work in progress (behind the scenes)</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <h4 className="mb-3 not-italic uppercase tracking-wider">Cropping</h4>
                <p className="text-sm text-muted-foreground">
                  Crop to emphasise subjects. Allow breathing room. Avoid cutting off key elements awkwardly. Maintain visual balance.
                </p>
              </div>
              <div>
                <h4 className="mb-3 not-italic uppercase tracking-wider">Overlays</h4>
                <p className="text-sm text-muted-foreground">
                  Dark overlays (10-40% opacity) may be used for text legibility. Keep subtle. Never obscure key image content.
                </p>
              </div>
              <div>
                <h4 className="mb-3 not-italic uppercase tracking-wider">Gradients</h4>
                <p className="text-sm text-muted-foreground">
                  Gradient overlays from bottom only for text placement. Use charcoal to transparent. Keep elegant and minimal.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use real project photography</li>
                  <li>• Show completed renovations in natural light</li>
                  <li>• Include people when authentic</li>
                  <li>• Maintain warm, inviting colour grading</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 not-italic uppercase tracking-wider flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" /> Don't
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use AI-generated imagery</li>
                  <li>• Use overly staged or artificial photography</li>
                  <li>• Apply heavy filters or colour grading</li>
                  <li>• Use images with visible watermarks</li>
                  <li>• Use low-resolution or pixelated images</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 9. Governance */}
          <motion.section id="governance" {...fadeIn}>
            <h2 className="mb-8">9. Governance</h2>
            
            <div className="p-8 bg-primary/5 border-l-4 border-primary mb-8">
              <h3 className="mb-4 not-italic">Who This Document Is For</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Internal team members</li>
                <li>• Contractors and freelancers</li>
                <li>• Marketing and design partners</li>
                <li>• Any party creating brand-facing materials</li>
              </ul>
            </div>

            <div className="p-8 bg-secondary/50 border border-border">
              <h3 className="mb-4 not-italic">Usage Instructions</h3>
              <p className="text-muted-foreground mb-4">
                This document is the authoritative reference for all brand decisions. Before creating, publishing, or modifying any brand-facing material:
              </p>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>Review the relevant section(s) of this guide</li>
                <li>Ensure your work aligns with the guidelines</li>
                <li>When in doubt, ask before publishing</li>
                <li>Report any inconsistencies or outdated information</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-6">
                Last updated: January 2026
              </p>
            </div>
          </motion.section>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-secondary/30">
        <div className="container-wide text-center">
          <p className="text-sm text-muted-foreground">
            Concept Design Construct - Internal Brand Guidelines
          </p>
        </div>
      </footer>
    </div>
  );
};

// Colour Swatch Component
const ColourSwatch = ({ name, hex, hsl, usage }: { name: string; hex: string; hsl: string; usage: string }) => (
  <div>
    <div 
      className="aspect-square mb-2 md:mb-3 border border-border"
      style={{ backgroundColor: hex }}
    />
    <p className="font-medium text-xs md:text-sm">{name}</p>
    <p className="text-[10px] md:text-xs text-muted-foreground font-mono">{hex}</p>
    <p className="text-[10px] md:text-xs text-muted-foreground font-mono">HSL: {hsl}</p>
    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 line-clamp-2">{usage}</p>
  </div>
);

export default BrandGuidelines;
