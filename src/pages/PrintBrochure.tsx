import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Eye, EyeOff } from "lucide-react";
import html2canvas from "html2canvas";
import logoImage from "@/assets/logo.webp";
import serviceKitchen from "@/assets/service-kitchen.jpg";
import serviceBathroom from "@/assets/service-bathroom.jpg";
import serviceLiving from "@/assets/service-living.jpg";
import serviceWholeHome from "@/assets/service-whole-home.jpg";
import heroBg from "@/assets/hero-bg.jpg";

// Print dimensions in mm converted to pixels at 96 DPI for screen display
const MM_TO_PX = 3.7795275591;
const BLEED = 5;
const PANEL_WIDTH = 99;
const PANEL_HEIGHT = 210;
const CANVAS_WIDTH = 307;
const CANVAS_HEIGHT = 220;

// Services content
const services = [
  {
    title: "Bathroom",
    description: "Comfort, safety, and calm with practical choices",
    image: serviceBathroom,
  },
  {
    title: "Kitchen",
    description: "Better movement, smarter storage for real routines",
    image: serviceKitchen,
  },
  {
    title: "Connected Spaces",
    description: "Laundry, living zones improved without extra scope",
    image: serviceLiving,
  },
  {
    title: "Whole Home",
    description: "Improve layout, light, storage and flow",
    image: serviceWholeHome,
  },
];

// Steps content - structured with 2 lines per body (max 6 lines total)
const steps = [
  { 
    number: "01", 
    title: "Contact Us", 
    lines: [
      "Stop thinking about it and do it now.",
      "No pressure. No sales talk.",
      "Just a real conversation about your space."
    ]
  },
  { 
    number: "02", 
    title: "Free On-Site Consultation", 
    lines: [
      "Free design advice shaped around you.",
      "We align your budget with your life needs.",
      "We walk the space and talk it through."
    ]
  },
  { 
    number: "03", 
    title: "Quote Submission", 
    lines: [
      "Clear, transparent, and considered.",
      "Based on what we discussed together.",
      "No surprises. No vague allowances."
    ]
  },
  { 
    number: "04", 
    title: "Quote Acceptance", 
    lines: [
      "This is where it becomes real.",
      "Sign the Master Builders contract.",
      "Timelines and expectations locked in."
    ]
  },
  { 
    number: "05", 
    title: "Shopping", 
    lines: [
      "The fun part starts here.",
      "Selections, finishes, fixtures, details.",
      "Your space begins to take shape."
    ]
  },
  { 
    number: "06", 
    title: "Construction", 
    lines: [
      "The transformation happens here.",
      "Yes, it is messy at times.",
      "But this is where the magic happens."
    ]
  },
  { 
    number: "07", 
    title: "Handover", 
    lines: [
      "Into your new space.",
      "The build is complete.",
      "You start enjoying living in it."
    ]
  },
];

const PrintBrochure = () => {
  const side1Ref = useRef<HTMLDivElement>(null);
  const side2Ref = useRef<HTMLDivElement>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    setExporting(true);
    setShowGuides(false);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [CANVAS_WIDTH, CANVAS_HEIGHT]
      });

      if (side1Ref.current) {
        const canvas1 = await html2canvas(side1Ref.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });
        pdf.addImage(canvas1.toDataURL("image/jpeg", 1.0), "JPEG", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      pdf.addPage([CANVAS_WIDTH, CANVAS_HEIGHT], "landscape");

      if (side2Ref.current) {
        const canvas2 = await html2canvas(side2Ref.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });
        pdf.addImage(canvas2.toDataURL("image/jpeg", 1.0), "JPEG", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      pdf.save("concept-design-construct-brochure.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setShowGuides(true);
      setExporting(false);
    }
  };

  const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width: `${PANEL_WIDTH * MM_TO_PX}px`, height: `${PANEL_HEIGHT * MM_TO_PX}px` }}
    >
      {children}
    </div>
  );

  const SafeArea = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div 
      className={`absolute inset-0 flex flex-col ${className}`}
      style={{ padding: `${12 * MM_TO_PX}px ${10 * MM_TO_PX}px` }}
    >
      {children}
    </div>
  );

  const FoldLine = ({ position }: { position: "left" | "right" }) => {
    if (!showGuides) return null;
    return (
      <div 
        className="absolute top-0 bottom-0 w-px border-l-2 border-dashed border-primary/30 z-50 pointer-events-none"
        style={{ [position === "left" ? "left" : "right"]: `${PANEL_WIDTH * MM_TO_PX}px` }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-primary mb-2">Print Brochure</h1>
            <p className="text-muted-foreground">DL Z-fold (A4 tri-fold) • 297mm × 210mm • Two-sided</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowGuides(!showGuides)} className="gap-2">
              {showGuides ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showGuides ? "Hide Guides" : "Show Guides"}
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={exportToPDF} disabled={exporting} className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* Side 1 - Outside */}
        <div className="mb-12">
          <h2 className="text-xl font-serif text-primary mb-4">Side 1 - Outside</h2>
          <div 
            ref={side1Ref}
            className="relative bg-background shadow-xl mx-auto overflow-hidden"
            style={{ 
              width: `${CANVAS_WIDTH * MM_TO_PX}px`, 
              height: `${CANVAS_HEIGHT * MM_TO_PX}px`,
              padding: `${BLEED * MM_TO_PX}px`
            }}
          >
            {showGuides && (
              <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none z-50" style={{ margin: `${BLEED * MM_TO_PX}px` }} />
            )}
            
            <div className="flex" style={{ height: `${PANEL_HEIGHT * MM_TO_PX}px` }}>
              
              {/* Panel 1: Front Cover - Hero */}
              <Panel className="relative">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                
                <SafeArea className="justify-between relative z-10">
                  <div>
                    <img src={logoImage} alt="Concept Design Construct" className="h-8 mb-3 brightness-0 invert" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/60 mb-2">Gold Coast Renovators</p>
                    <h1 className="text-[28px] font-serif text-white leading-[1.1] mb-3">
                      Renovations<br />
                      <span className="italic">That Flow</span><br />
                      With Your Life
                    </h1>
                    <div className="w-12 h-[2px] bg-white/40 mb-3" />
                    <p className="text-[10px] text-white/80 leading-relaxed max-w-[90%]">
                      Expert design & build for bathrooms, kitchens, and whole-home renovations that improve how you live.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[8px] text-white/50 uppercase tracking-wider">
                    <span>QBCC Licensed</span>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span>Master Builders</span>
                  </div>
                </SafeArea>
                <FoldLine position="right" />
              </Panel>

              {/* Panel 2 & 3: Full Journey - All 7 Steps in horizontal layout */}
              <Panel className="bg-[hsl(56_100%_97%)]">
                <SafeArea className="justify-start">
                  <div className="mb-3">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-primary/40 mb-1">The Journey</p>
                    <h2 className="text-[18px] font-serif text-primary leading-tight">
                      One Step Away <span className="italic">From Your Dream</span>
                    </h2>
                  </div>
                  
                  {/* Steps grid - all aligned */}
                  <div className="grid grid-cols-4 gap-x-2 flex-1">
                    {steps.slice(0, 4).map((step) => (
                      <div key={step.number} className="flex flex-col">
                        {/* Number - fixed height */}
                        <span className="text-[28px] font-serif text-primary/15 leading-none h-8">{step.number}</span>
                        {/* Title - fixed height for alignment */}
                        <p className="text-[9px] font-serif text-primary font-medium h-8 leading-tight">{step.title}</p>
                        {/* Body - 3 lines each, all start at same point */}
                        <div className="space-y-0.5">
                          {step.lines.map((line, idx) => (
                            <p key={idx} className="text-[7px] text-primary/60 leading-snug">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SafeArea>
                <FoldLine position="right" />
              </Panel>

              {/* Panel 3: Steps 5-7 + CTA */}
              <Panel className="bg-[hsl(56_60%_92%)]">
                <SafeArea className="justify-start">
                  <div className="mb-3">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-primary/40 mb-1">The Journey</p>
                    <h2 className="text-[16px] font-serif text-primary leading-tight italic">The Transformation</h2>
                  </div>
                  
                  {/* Steps grid - aligned with Panel 2 */}
                  <div className="grid grid-cols-3 gap-x-2 mb-4">
                    {steps.slice(4).map((step) => (
                      <div key={step.number} className="flex flex-col">
                        {/* Number - fixed height */}
                        <span className="text-[28px] font-serif text-primary/15 leading-none h-8">{step.number}</span>
                        {/* Title - fixed height for alignment */}
                        <p className="text-[9px] font-serif text-primary font-medium h-8 leading-tight">{step.title}</p>
                        {/* Body - 3 lines each, all start at same point */}
                        <div className="space-y-0.5">
                          {step.lines.map((line, idx) => (
                            <p key={idx} className="text-[7px] text-primary/60 leading-snug">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Call to Action Block */}
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="bg-[hsl(56_100%_97%)] rounded-sm p-4 border border-primary/10">
                      <p className="font-serif text-[20px] text-primary italic mb-2">Do it now.</p>
                      <p className="text-[9px] text-primary/60 leading-relaxed mb-3">
                        Read our Google reviews, scroll our socials, play with our design tools. When it feels right, get in touch.
                      </p>
                      <div className="w-full h-[1px] bg-primary/10 mb-2" />
                      <p className="text-[8px] text-primary/40 uppercase tracking-wider">No pressure. No sales talk.</p>
                    </div>
                  </div>
                </SafeArea>
              </Panel>
            </div>
          </div>
        </div>

        {/* Side 2 - Inside */}
        <div className="mb-12">
          <h2 className="text-xl font-serif text-primary mb-4">Side 2 - Inside</h2>
          <div 
            ref={side2Ref}
            className="relative bg-background shadow-xl mx-auto overflow-hidden"
            style={{ 
              width: `${CANVAS_WIDTH * MM_TO_PX}px`, 
              height: `${CANVAS_HEIGHT * MM_TO_PX}px`,
              padding: `${BLEED * MM_TO_PX}px`
            }}
          >
            {showGuides && (
              <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none z-50" style={{ margin: `${BLEED * MM_TO_PX}px` }} />
            )}
            
            <div className="flex" style={{ height: `${PANEL_HEIGHT * MM_TO_PX}px` }}>
              
              {/* Panel 4: Services Grid */}
              <Panel className="bg-[hsl(56_100%_97%)]">
                <SafeArea className="justify-between">
                  <div className="mb-3">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-primary/40 mb-1">Our Services</p>
                    <h2 className="text-[16px] font-serif text-primary leading-tight">What We <span className="italic">Renovate</span></h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {services.map((service) => (
                      <div key={service.title} className="relative rounded-sm overflow-hidden group">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" style={{ aspectRatio: '1' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white text-[10px] font-serif font-medium mb-0.5">{service.title}</p>
                          <p className="text-white/70 text-[7px] leading-tight">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-primary/10">
                    <div className="flex flex-wrap gap-1">
                      {["Comfort", "Safety", "Storage", "Function", "Layout", "Flow"].map((tag) => (
                        <span key={tag} className="text-[7px] uppercase tracking-wider text-primary/50 border border-primary/15 px-1.5 py-0.5 rounded-sm bg-white/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </SafeArea>
                <FoldLine position="right" />
              </Panel>

              {/* Panel 5: Why Renovate + About */}
              <Panel className="bg-[hsl(56_60%_92%)]">
                <SafeArea className="justify-between">
                  {/* Why Renovate Section */}
                  <div className="mb-4">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-primary/40 mb-2">Why Renovate</p>
                    <blockquote className="font-serif text-[14px] italic leading-snug text-primary mb-2">
                      "A renovation should improve your life, not take over it"
                    </blockquote>
                    <p className="text-[8px] text-primary/60 leading-relaxed">
                      We understand the hesitation: concerns about cost surprises, unclear timelines, disruption without a plan, and too many decisions without direction. That's why we've built our process around transparency and clear communication.
                    </p>
                  </div>
                  
                  <div className="w-full h-[1px] bg-primary/15 my-2" />
                  
                  {/* About Section */}
                  <div className="flex-1">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-primary/40 mb-2">About Us</p>
                    <p className="text-[9px] text-primary/70 leading-relaxed mb-3">
                      We're Gold Coast renovators who believe your home should work for you. Expert design & build with transparent pricing and quality craftsmanship.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {[
                        "QBCC Licensed",
                        "Master Builders",
                        "Fixed Pricing",
                        "Free Consultations",
                        "Full Insurance",
                        "Warranty Backed"
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-primary/40 rounded-full" />
                          <span className="text-[8px] text-primary/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 mt-2 border-t border-primary/15">
                    <p className="text-[9px] font-serif italic text-primary/60">"Transparent pricing, no surprises"</p>
                  </div>
                </SafeArea>
                <FoldLine position="right" />
              </Panel>

              {/* Panel 6: Contact / Back Cover */}
              <Panel className="relative">
                <div className="absolute inset-0 bg-[hsl(350_85%_42%)]" />
                <div 
                  className="absolute inset-0 opacity-10 bg-cover bg-center"
                  style={{ backgroundImage: `url(${serviceWholeHome})` }}
                />
                
                <SafeArea className="justify-between relative z-10">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 mb-2">Get Started</p>
                    <h2 className="text-[18px] font-serif text-white leading-tight mb-2">
                      Let's Talk About<br />
                      <span className="italic">Your Space</span>
                    </h2>
                    <div className="w-8 h-[1px] bg-white/30 mb-3" />
                    <p className="text-[9px] text-white/70 leading-relaxed">
                      Stop thinking about it and do it now. No pressure. No sales talk. Just a real conversation about your home and what's possible.
                    </p>
                  </div>
                  
                  {/* Contact Details */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-white/40 mb-1">Call Us</p>
                        <p className="text-[14px] font-serif text-white">1300 FLOW HOME</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-white/40 mb-1">Email</p>
                        <p className="text-[10px] text-white/90">info@cdconstruct.com.au</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-white/40 mb-1">Website</p>
                        <p className="text-[10px] text-white/90">conceptdesignconstruct.com.au</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Area & Footer */}
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-white/40 mb-0.5">Service Area</p>
                        <p className="text-[10px] text-white/80 font-serif">Gold Coast & Brisbane</p>
                      </div>
                      <img src={logoImage} alt="Logo" className="h-6 brightness-0 invert opacity-60" />
                    </div>
                    <p className="text-[7px] text-white/40 text-center uppercase tracking-wider">
                      QBCC Licensed • Master Builders Member • Est. Gold Coast
                    </p>
                  </div>
                </SafeArea>
              </Panel>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-serif text-lg text-primary mb-4">Printing Instructions</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Professional Printing</h4>
              <ul className="space-y-1 list-disc list-inside text-sm">
                <li>Export PDF includes 5mm bleed</li>
                <li>Print on 170-250gsm coated stock</li>
                <li>Request CMYK colour matching</li>
                <li>Specify Z-fold finishing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Folding Guide</h4>
              <ul className="space-y-1 list-disc list-inside text-sm">
                <li>Side 1 faces outward when folded</li>
                <li>Panel 1 (Front Cover) visible first</li>
                <li>Opening reveals panels in sequence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintBrochure;
