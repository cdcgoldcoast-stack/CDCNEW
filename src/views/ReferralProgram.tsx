import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Users,
  Smartphone,
  TrendingUp,
  Eye,
  FileCheck,
  Shield,
  Send,
  PhoneCall,
  ClipboardCheck,
  DollarSign,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackAnalyticsEvent } from "@/lib/analytics";
import SEO from "@/components/SEO";

const benefits = [
  {
    icon: Users,
    title: "No experience required",
    description:
      "You don't need to know about renovations. If you know people, that's enough.",
  },
  {
    icon: Smartphone,
    title: "Work from anywhere",
    description:
      "Refer from your phone, your couch, or your office. No quotas, no deadlines.",
  },
  {
    icon: TrendingUp,
    title: "Growing company",
    description:
      "CDC is expanding across the Gold Coast. More projects means more earning opportunities.",
  },
  {
    icon: Eye,
    title: "Full transparency",
    description:
      "You'll know when your referral is contacted and when a project is confirmed.",
  },
  {
    icon: FileCheck,
    title: "Paid on contract signing",
    description:
      "Once the homeowner signs a renovation contract, your commission is locked in.",
  },
  {
    icon: Shield,
    title: "Trusted brand",
    description:
      "QBCC licensed, Master Builders member, 4.9-star Google rating. You're recommending quality.",
  },
];

const commissionTiers = [
  { range: "$20,000 – $50,000", commission: "$500" },
  { range: "$50,000 – $100,000", commission: "$1,000" },
  { range: "$100,000+", commission: "$2,000" },
];

const steps = [
  {
    icon: Send,
    title: "Submit Referral",
    description: "Fill in your details and the homeowner's info below.",
  },
  {
    icon: PhoneCall,
    title: "We Reach Out",
    description: "Our team contacts the homeowner to discuss their project.",
  },
  {
    icon: ClipboardCheck,
    title: "Project Confirmed",
    description: "The homeowner signs a renovation contract with CDC.",
  },
  {
    icon: DollarSign,
    title: "You Get Paid",
    description: "Your commission is paid once the contract is signed.",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+()\-\s]{6,20}$/;

const ReferralProgram = () => {
  const formRef = useRef<HTMLElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    affiliateName: "",
    affiliateEmail: "",
    affiliatePhone: "",
    referralName: "",
    referralPhone: "",
    referralEmail: "",
    referralSuburb: "",
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.affiliateName.trim()) {
      newErrors.affiliateName = "Your name is required";
    }
    if (!formData.affiliateEmail.trim()) {
      newErrors.affiliateEmail = "Your email is required";
    } else if (!EMAIL_REGEX.test(formData.affiliateEmail.trim())) {
      newErrors.affiliateEmail = "Please enter a valid email";
    }
    if (!formData.affiliatePhone.trim()) {
      newErrors.affiliatePhone = "Your phone number is required";
    } else if (!PHONE_REGEX.test(formData.affiliatePhone.trim())) {
      newErrors.affiliatePhone = "Please enter a valid phone number";
    }
    if (!formData.referralName.trim()) {
      newErrors.referralName = "Referral name is required";
    }
    if (!formData.referralPhone.trim()) {
      newErrors.referralPhone = "Referral phone number is required";
    } else if (!PHONE_REGEX.test(formData.referralPhone.trim())) {
      newErrors.referralPhone = "Please enter a valid phone number";
    }
    if (
      formData.referralEmail.trim() &&
      !EMAIL_REGEX.test(formData.referralEmail.trim())
    ) {
      newErrors.referralEmail = "Please enter a valid email";
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
      }>("save-referral", {
        body: {
          affiliateName: formData.affiliateName.trim(),
          affiliateEmail: formData.affiliateEmail.trim(),
          affiliatePhone: formData.affiliatePhone.trim(),
          referralName: formData.referralName.trim(),
          referralPhone: formData.referralPhone.trim(),
          referralEmail: formData.referralEmail.trim() || null,
          referralSuburb: formData.referralSuburb.trim() || null,
          source: "referral-form",
          website,
        },
      });

      if (error) {
        const context = (error as { context?: { json?: () => Promise<unknown> } })
          .context;
        if (context?.json) {
          const body = (await context.json()) as { error?: string };
          if (body?.error) throw new Error(body.error);
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);

      trackAnalyticsEvent({
        event_name: "referral_form_submit",
        cta_location: "form",
        lead_type: "referral",
      });

      setSubmitted(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Referral Program | Earn Up To $2,000 Per Referral"
        description="Know a Gold Coast homeowner thinking about renovating? Refer them to CDC and earn up to $2,000 when the project goes ahead. No experience required."
        url="/referral-program"
      />
      <Header />

      {/* ── Section 1: Hero ── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-primary relative z-10">
        <div className="container-wide px-6 md:px-10 lg:px-12 text-center">
          <p className="text-label text-white/60 mb-6">Referral Program</p>
          <h1 className="font-serif text-h1-mobile md:text-h1 text-white leading-tight mb-8 max-w-4xl mx-auto">
            Earn Up To $2,000 For Every Homeowner You Refer
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Know someone on the Gold Coast thinking about renovating? Introduce
            them to us. If the project goes ahead, you get paid — simple as
            that.
          </p>
          <Button
            variant="heroOutline"
            size="xl"
            onClick={scrollToForm}
            className="gap-2"
          >
            Submit a Referral
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ── Section 2: Benefits ── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-wide px-6 md:px-10 lg:px-12">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground text-center mb-16">
            A Straightforward Way To Earn
          </h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-5">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Commission Tiers ── */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="container-wide px-6 md:px-10 lg:px-12">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-white text-center mb-16">
            Earn More On Larger Projects
          </h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {commissionTiers.map((tier) => (
              <div
                key={tier.range}
                className="bg-white/10 border border-white/20 rounded-lg p-8 text-center"
              >
                <p className="text-white/60 text-sm mb-3">Project Gross Value</p>
                <p className="text-white font-serif text-lg mb-6">
                  {tier.range}
                </p>
                <p className="text-white/60 text-sm mb-2">Commission</p>
                <p className="text-white font-serif text-3xl">{tier.commission}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-sm text-center mt-10 max-w-lg mx-auto">
            Commission is paid when the renovation contract is signed. One
            referral per household.
          </p>
        </div>
      </section>

      {/* ── Section 4: How It Works ── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-wide px-6 md:px-10 lg:px-12">
          <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground text-center mb-16">
            Four Simple Steps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-label text-primary mb-3">
                  Step {index + 1}
                </p>
                <h3 className="font-serif text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Form ── */}
      <section ref={formRef} className="py-20 md:py-28 bg-muted scroll-mt-28">
        <div className="container-wide px-6 md:px-10 lg:px-12 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground mb-4">
                  Thank You
                </h2>
                <p className="text-foreground/70 text-lg leading-relaxed max-w-md mx-auto">
                  We've received your referral. Our team will reach out to the
                  homeowner shortly, and we'll keep you updated on the progress.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground text-center mb-3">
                  Submit a Referral
                </h2>
                <p className="text-foreground/70 text-center mb-12">
                  Tell us about yourself and the homeowner you'd like to refer.
                </p>

                <form onSubmit={handleSubmit} noValidate>
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

                  {/* Your Details */}
                  <fieldset className="mb-10">
                    <legend className="text-label text-foreground/50 mb-6">
                      Your Details
                    </legend>
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="affiliateName">Name *</Label>
                        <Input
                          id="affiliateName"
                          type="text"
                          value={formData.affiliateName}
                          onChange={(e) =>
                            updateField("affiliateName", e.target.value)
                          }
                          placeholder="Your full name"
                          className={errors.affiliateName ? "border-destructive" : ""}
                        />
                        {errors.affiliateName && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.affiliateName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="affiliateEmail">Email *</Label>
                        <Input
                          id="affiliateEmail"
                          type="email"
                          value={formData.affiliateEmail}
                          onChange={(e) =>
                            updateField("affiliateEmail", e.target.value)
                          }
                          placeholder="you@example.com"
                          className={errors.affiliateEmail ? "border-destructive" : ""}
                        />
                        {errors.affiliateEmail && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.affiliateEmail}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="affiliatePhone">Phone *</Label>
                        <Input
                          id="affiliatePhone"
                          type="tel"
                          value={formData.affiliatePhone}
                          onChange={(e) =>
                            updateField("affiliatePhone", e.target.value)
                          }
                          placeholder="04XX XXX XXX"
                          className={errors.affiliatePhone ? "border-destructive" : ""}
                        />
                        {errors.affiliatePhone && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.affiliatePhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  {/* Referral Details */}
                  <fieldset className="mb-10">
                    <legend className="text-label text-foreground/50 mb-6">
                      Referral Details
                    </legend>
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="referralName">Name *</Label>
                        <Input
                          id="referralName"
                          type="text"
                          value={formData.referralName}
                          onChange={(e) =>
                            updateField("referralName", e.target.value)
                          }
                          placeholder="Homeowner's full name"
                          className={errors.referralName ? "border-destructive" : ""}
                        />
                        {errors.referralName && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.referralName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="referralPhone">Phone *</Label>
                        <Input
                          id="referralPhone"
                          type="tel"
                          value={formData.referralPhone}
                          onChange={(e) =>
                            updateField("referralPhone", e.target.value)
                          }
                          placeholder="04XX XXX XXX"
                          className={errors.referralPhone ? "border-destructive" : ""}
                        />
                        {errors.referralPhone && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.referralPhone}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="referralEmail">Email (optional)</Label>
                        <Input
                          id="referralEmail"
                          type="email"
                          value={formData.referralEmail}
                          onChange={(e) =>
                            updateField("referralEmail", e.target.value)
                          }
                          placeholder="homeowner@example.com"
                          className={errors.referralEmail ? "border-destructive" : ""}
                        />
                        {errors.referralEmail && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.referralEmail}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="referralSuburb">Suburb (optional)</Label>
                        <Input
                          id="referralSuburb"
                          type="text"
                          value={formData.referralSuburb}
                          onChange={(e) =>
                            updateField("referralSuburb", e.target.value)
                          }
                          placeholder="e.g. Broadbeach"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <Button
                    type="submit"
                    variant="default"
                    size="xl"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting…
                      </>
                    ) : (
                      "Submit Referral"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReferralProgram;
