import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { generateContactPageSchema } from "@/lib/structured-data";
import { trackAnalyticsEvent } from "@/lib/analytics";

const renovationOptions = [
  { id: "bathroom", label: "Bathroom" },
  { id: "kitchen", label: "Kitchen" },
  { id: "full-house", label: "Full House Living" },
  { id: "other", label: "Other Parts of the House" },
];

const budgetOptions = [
  { id: "5-20", label: "$5k – $20k" },
  { id: "20-40", label: "$20k – $40k" },
  { id: "40-80", label: "$40k – $80k" },
  { id: "80+", label: "$80k+" },
  { id: "unsure", label: "Unsure" },
  { id: "flexible", label: "Flexible" },
];

const GetQuote = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    suburb: "",
    renovations: [] as string[],
    budget: "",
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleRenovation = (id: string) => {
    const current = formData.renovations;
    const updated = current.includes(id)
      ? current.filter((r) => r !== id)
      : [...current, id];
    updateFormData("renovations", updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.suburb.trim()) {
      newErrors.suburb = "Suburb is required";
    }
    if (formData.renovations.length === 0) {
      newErrors.renovations = "Please select at least one renovation type";
    }
    if (!formData.budget) {
      newErrors.budget = "Please select a budget";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke<{
        success?: boolean;
        error?: string;
      }>("save-enquiry", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          suburb: formData.suburb || null,
          renovations: formData.renovations,
          budget: formData.budget || null,
          source: "quote-form",
          website,
        },
      });

      if (error) {
        const context = (error as { context?: { json?: () => Promise<unknown> } }).context;
        if (context?.json) {
          const body = await context.json();
          console.error("Edge Function response:", body);
          const msg = (body as { error?: string })?.error;
          if (msg) throw new Error(msg);
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);

      const primaryRenovation = formData.renovations[0] || "general";
      trackAnalyticsEvent({
        event_name: "quote_form_submit",
        cta_location: "form",
        lead_type: primaryRenovation,
      });

      setSubmitted(true);
    } catch (error: unknown) {
      console.error("Error submitting enquiry:", error);
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again later.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const contactSchema = generateContactPageSchema();

  const inputClassName = "h-12 text-base bg-background/95 border-background/70 text-foreground placeholder:text-foreground/50 focus:border-background focus:ring-background/40";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Gold Coast Renovations Quote | Book Your Consultation"
        description="Start your Gold Coast renovations journey. Get a consultation and quote for your kitchen, bathroom, or whole-home project."
        url="/book-renovation-consultation"
        jsonLd={contactSchema}
      />
      <Header />

      <main id="main-content" className="flex-1 relative overflow-hidden pt-24 md:pt-28">
        <h1 className="sr-only">Book a Gold Coast Renovation Consultation</h1>
        {/* Full Red Background */}
        <div className="absolute inset-0 bg-primary z-0" />

        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center z-10"
          >
            <div className="w-full max-w-2xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <p className="text-white/60 text-sm tracking-widest uppercase">
                  Thank you, we have received your details
                </p>

                <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl text-white leading-tight italic">
                  This Is The Beginning Of Something Thoughtful.
                </h2>

                <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto pt-2">
                  Not plans or drawings just yet.
                </p>

                <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                  First, we listen. We want to understand how you live now<br />and how you want to live next.
                </p>

                <div className="pt-8">
                  <p className="text-white/60 text-base mb-4">
                    Until we speak, take a look around and get inspired.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/renovation-projects">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary px-8 h-14 text-sm tracking-widest uppercase font-medium"
                      >
                        View Gold Coast Renovation Projects
                      </Button>
                    </Link>
                    <Link to="/renovation-design-tools">
                      <Button
                        className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 h-14 text-sm tracking-widest uppercase font-medium"
                      >
                        Use Gold Coast Renovations Design Tools
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 z-10"
          >
            <div className="w-full max-w-xl mx-auto px-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-white/60 text-sm tracking-widest uppercase mb-3"
              >
                Gold Coast Local Builder
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center text-white text-2xl lg:text-3xl font-display mb-8"
              >
                Get Your Free Renovation Plan
              </motion.h2>

              <form onSubmit={handleSubmit}>
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="text"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="space-y-5"
                >
                  {/* Personal Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white/90">
                        Name <span className="text-white/60">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        placeholder="Your name"
                        className={cn(inputClassName, errors.fullName && "border-white/60")}
                      />
                      {errors.fullName && (
                        <p className="text-white/80 text-sm">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/90">
                        Email <span className="text-white/60">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="your@email.com"
                        className={cn(inputClassName, errors.email && "border-white/60")}
                      />
                      {errors.email && (
                        <p className="text-white/80 text-sm">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/90">
                        Phone Number <span className="text-white/60">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="Your phone number"
                        className={cn(inputClassName, errors.phone && "border-white/60")}
                      />
                      {errors.phone && (
                        <p className="text-white/80 text-sm">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suburb" className="text-white/90">
                        Suburb <span className="text-white/60">*</span>
                      </Label>
                      <Input
                        id="suburb"
                        value={formData.suburb}
                        onChange={(e) => updateFormData("suburb", e.target.value)}
                        placeholder="Your suburb"
                        className={cn(inputClassName, errors.suburb && "border-white/60")}
                      />
                      {errors.suburb && (
                        <p className="text-white/80 text-sm">{errors.suburb}</p>
                      )}
                    </div>
                  </div>

                  {/* Renovation Type */}
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-white/60">
                      What are you looking to renovate? <span className="text-white/60">*</span>
                    </p>
                    {errors.renovations && (
                      <p className="text-white/80 text-sm">{errors.renovations}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {renovationOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            toggleRenovation(option.id);
                            if (errors.renovations) {
                              setErrors((prev) => ({ ...prev, renovations: "" }));
                            }
                          }}
                          className={cn(
                            "relative border rounded-lg px-5 py-3 text-left transition-all duration-200",
                            formData.renovations.includes(option.id)
                              ? "border-white bg-white/20"
                              : "border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10"
                          )}
                        >
                          <span className="text-sm text-white">
                            {option.label}
                          </span>
                          {formData.renovations.includes(option.id) && (
                            <Check className="absolute top-2.5 right-3 w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">
                      Budget range <span className="text-white/60">*</span>
                    </p>
                    {errors.budget && (
                      <p className="text-white/80 text-sm">{errors.budget}</p>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      {budgetOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => updateFormData("budget", option.id)}
                          className={cn(
                            "relative border rounded-lg px-4 py-2.5 text-center transition-all duration-200",
                            formData.budget === option.id
                              ? "border-white bg-white/20"
                              : "border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10"
                          )}
                        >
                          <span className="text-sm text-white">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-white/70 text-sm">
                      Prefer to call?
                    </p>
                    <a
                      href="tel:0413468928"
                      className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 rounded"
                    >
                      0413 468 928
                    </a>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-white text-primary hover:bg-white/90 px-10 h-12 w-full sm:w-auto"
                  >
                    {submitting ? "Submitting..." : "Submit Enquiry"}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-white/50">
                  Free consultation • No obligation • Response within 24 hours
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GetQuote;
