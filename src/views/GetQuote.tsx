import { useState } from "react";
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
import { capturePostHogEvent } from "@/lib/posthog";

const renovationOptions = [
  { id: "bathroom", label: "Bathroom" },
  { id: "kitchen", label: "Kitchen" },
  { id: "full-house", label: "Full House Living" },
  { id: "other", label: "Other Parts of the House" },
];

const GetQuote = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    suburb: "",
    renovations: [] as string[],
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

    const nameTrimmed = formData.fullName.trim();
    if (!nameTrimmed) {
      newErrors.fullName = "Name is required";
    } else if (nameTrimmed.length < 2) {
      newErrors.fullName = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    const phoneTrimmed = formData.phone.trim();
    const phoneDigitCount = (phoneTrimmed.match(/\d/g) || []).length;
    if (!phoneTrimmed) {
      newErrors.phone = "Phone number is required";
    } else if (phoneDigitCount < 4) {
      newErrors.phone = "Please enter a phone number with at least 4 digits";
    }

    if (!formData.suburb.trim()) newErrors.suburb = "Suburb is required";
    if (formData.renovations.length === 0) {
      newErrors.renovations = "Please select at least one renovation type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitError(null);
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
          budget: null,
          source: "quote-form",
          website,
        },
      });

      if (error) {
        const context = (error as {
          context?: { status?: number; json?: () => Promise<unknown> };
        }).context;
        const status = context?.status;

        let serverMessage: string | null = null;
        if (context?.json) {
          try {
            const body = await context.json();
            console.error("Edge Function response:", { status, body });
            serverMessage = (body as { error?: string })?.error ?? null;
          } catch (jsonErr) {
            console.error("Failed to parse error response body:", jsonErr);
          }
        }

        if (serverMessage) {
          throw new Error(serverMessage);
        }

        if (status === 429) {
          throw new Error(
            "You've submitted several enquiries from this network in the last hour. Please call us on 0413 468 928 or try again later.",
          );
        }
        if (status === 403) {
          throw new Error(
            "Submissions from this URL are blocked by our server. Please call us on 0413 468 928 — we'll take your details directly.",
          );
        }
        if (typeof status === "number" && status >= 500) {
          throw new Error(
            "Our server is having trouble right now. Please call us on 0413 468 928 or try again in a few minutes.",
          );
        }
        if (typeof status === "number" && status >= 400) {
          throw new Error(
            "We couldn't process your enquiry. Please check the form and try again.",
          );
        }

        const fallbackMessage =
          (error as { message?: string }).message ||
          "Couldn't reach our server. Please check your connection or call us on 0413 468 928.";
        throw new Error(fallbackMessage);
      }
      if (data?.error) throw new Error(data.error);

      const primaryRenovation = formData.renovations[0] || "general";
      trackAnalyticsEvent({
        event_name: "quote_form_submit",
        cta_location: "form",
        lead_type: primaryRenovation,
      });
      capturePostHogEvent("quote_submitted", {
        primary_renovation: primaryRenovation,
        renovation_count: formData.renovations.length,
        has_suburb: Boolean(formData.suburb),
      });

      setSubmitted(true);
    } catch (error: unknown) {
      console.error("Error submitting enquiry:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Couldn't reach our server. Please check your connection and try again, or call us on 0413 468 928.";
      toast.error(message);
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const contactSchema = generateContactPageSchema();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        title="Gold Coast Renovations Quote | Book Your Consultation"
        description="Start your Gold Coast renovations journey. Get a consultation and quote for your kitchen, bathroom, or whole-home project."
        url="/book-renovation-consultation"
        jsonLd={contactSchema}
      />
      <Header />

      <main id="main-content" className="flex-1 pt-24 md:pt-28">
        <h1 className="sr-only">Book a Gold Coast Renovation Consultation</h1>

        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-16"
          >
            <div className="w-full max-w-2xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <p className="text-foreground/50 text-sm tracking-widest uppercase">
                  Thank you, we have received your details
                </p>

                <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl text-foreground leading-tight">
                  We've received your details.
                </h2>

                <p className="text-foreground/70 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto pt-2">
                  Mark or a member of our team will be in touch within 24 hours to arrange your free consultation.
                </p>

                <div className="pt-8">
                  <p className="text-foreground/50 text-base mb-4">
                    In the meantime, take a look at some of our recent work.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/renovation-projects">
                      <Button variant="outline" className="w-full sm:w-auto px-8 h-14 text-sm tracking-widest uppercase font-medium">
                        View Our Projects
                      </Button>
                    </Link>
                    <Link to="/renovation-design-tools">
                      <Button className="w-full sm:w-auto px-8 h-14 text-sm tracking-widest uppercase font-medium">
                        Explore Design Tools
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
            className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-16"
          >
            <div className="w-full max-w-xl mx-auto px-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-foreground/50 text-sm tracking-widest uppercase mb-3"
              >
                Gold Coast Local Builder
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center text-foreground text-2xl lg:text-3xl font-display mb-8"
              >
                Get Your Free Renovation Plan
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="flex items-center justify-center gap-4 sm:gap-6 mb-8 flex-wrap"
              >
                {[
                  "QBCC Licensed",
                  "4.9 Google Rating",
                  "Since 2000",
                  "Fixed-Price Quotes",
                ].map((item, i) => (
                  <span
                    key={i}
                    className="text-xs tracking-wide text-foreground/50 uppercase border border-border rounded-full px-3 py-1"
                  >
                    {item}
                  </span>
                ))}
              </motion.div>

              <form onSubmit={handleSubmit}>
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="space-y-4"
                >
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Name <span className="text-foreground/40">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        placeholder="Your name"
                        className={cn(errors.fullName && "border-destructive")}
                      />
                      {errors.fullName && (
                        <p className="text-destructive text-sm">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-foreground/40">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="your@email.com"
                        className={cn(errors.email && "border-destructive")}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Suburb */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-foreground/40">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="Your phone number"
                        className={cn(errors.phone && "border-destructive")}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suburb">
                        Suburb <span className="text-foreground/40">*</span>
                      </Label>
                      <Input
                        id="suburb"
                        value={formData.suburb}
                        onChange={(e) => updateFormData("suburb", e.target.value)}
                        placeholder="Your suburb"
                        className={cn(errors.suburb && "border-destructive")}
                      />
                      {errors.suburb && (
                        <p className="text-destructive text-sm">{errors.suburb}</p>
                      )}
                    </div>
                  </div>

                  {/* Renovation Type */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      What are you looking to renovate? <span className="text-foreground/40">*</span>
                    </p>
                    {errors.renovations && (
                      <p className="text-destructive text-sm">{errors.renovations}</p>
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
                              ? "border-primary bg-primary/8 text-primary"
                              : "border-border bg-white hover:border-primary/40 text-foreground"
                          )}
                        >
                          <span className="text-sm">{option.label}</span>
                          {formData.renovations.includes(option.id) && (
                            <Check className="absolute top-2.5 right-3 w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="mt-6 bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded"
                  >
                    <p className="font-medium mb-1">We couldn&apos;t submit your enquiry.</p>
                    <p className="text-foreground/70">
                      {submitError} Please try again, or call us directly on{" "}
                      <a
                        href="tel:0413468928"
                        className="font-semibold text-destructive underline"
                      >
                        0413 468 928
                      </a>
                      .
                    </p>
                  </motion.div>
                )}

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-foreground/60 text-sm">Prefer to call?</p>
                    <a
                      href="tel:0413468928"
                      className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-4 py-2 border border-border text-foreground hover:bg-muted transition-all duration-300 rounded"
                    >
                      0413 468 928
                    </a>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="px-10 h-12 w-full sm:w-auto"
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
                <p className="text-sm text-foreground/40">
                  Free consultation • No obligation • Response within 24 hours
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        <section className="max-w-3xl mx-auto px-6 pb-16 md:pb-24 text-foreground/70 text-sm md:text-base leading-relaxed space-y-4">
          <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-2">
            What to expect from your Gold Coast renovation consultation
          </h2>
          <p>
            Every enquiry begins with a <strong>free, no-obligation consultation</strong> where we
            take time to understand how you live, what is not working in your current home, and the
            outcomes you want from a renovation. We will ask about your priorities, your timing,
            and the constraints you are working within so that the advice we give is grounded in
            your actual brief — not a generic script.
          </p>
          <p>
            As <strong>QBCC-licensed Gold Coast renovation builders</strong>, we lead every project
            with careful planning, transparent documentation, and clear communication. Whether you
            are considering a kitchen upgrade, a bathroom renovation, a whole-home refresh, or a
            home extension, our design-led approach is built to reduce surprises during construction
            and keep the end result aligned with the vision we discussed on day one.
          </p>
          <p>
            After submitting the form above, a member of our team will be in touch within one
            business day to arrange a time to meet — either on-site at your home or at our studio.
            From that first conversation, you can decide at your own pace whether to continue into
            the design and planning stages with us.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-16 md:pb-24">
          <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-foreground font-medium text-base mb-1">
                Is the consultation really free?
              </h3>
              <p className="text-foreground/70 text-sm md:text-base leading-relaxed">
                Yes. We visit your home, discuss your goals, inspect every surface, and provide
                a detailed quote — all at no cost with zero obligation.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-medium text-base mb-1">
                How quickly will I hear back?
              </h3>
              <p className="text-foreground/70 text-sm md:text-base leading-relaxed">
                We typically respond within 24 hours on business days. For urgent enquiries,
                call us directly on{" "}
                <a href="tel:0413468928" className="underline underline-offset-2 hover:text-primary transition-colors">
                  0413 468 928
                </a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GetQuote;
