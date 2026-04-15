"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { capturePostHogEvent } from "@/lib/posthog";

const serviceOptions = [
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Whole-Home Renovation",
  "Home Extension",
  "Laundry / Connected Spaces",
  "Apartment Renovation",
  "Multiple Rooms",
  "Not Sure Yet",
];

const budgetOptions = [
  "Under $30k",
  "$30k–$50k",
  "$50k–$80k",
  "$80k–$120k",
  "$120k+",
  "Not sure",
];

const timelineOptions = [
  "ASAP",
  "1–3 Months",
  "3–6 Months",
  "6+ Months",
  "Just Exploring",
];

type QuoteFormInlineProps = {
  source?: string;
  eyebrow?: string;
  heading?: string;
  className?: string;
};

export default function QuoteFormInline({
  source = "quote-form",
  eyebrow = "Get Your Free",
  heading = "Renovation Quote",
  className,
}: QuoteFormInlineProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: "",
    budget: "",
    timeline: "",
  });

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.service) newErrors.service = "Please select a service";

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
          renovations: [formData.service],
          budget: formData.budget || null,
          timeline: formData.timeline || null,
          source,
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

      trackAnalyticsEvent({
        event_name: "quote_form_submit",
        cta_location: "form",
        lead_type: formData.service,
      });
      capturePostHogEvent("quote_submitted", {
        service: formData.service,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        source,
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

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn("w-full text-center py-10", className)}
      >
        <p className="text-foreground/50 text-xs tracking-widest uppercase mb-4">
          Thank you, we have received your details
        </p>
        <h3 className="font-serif italic text-2xl lg:text-3xl text-foreground leading-tight mb-4">
          This Is The Beginning Of Something Thoughtful.
        </h3>
        <p className="text-foreground/70 text-base leading-relaxed mb-6">
          First, we listen. We want to understand how you live now and how you want to live next.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/renovation-projects">
            <Button variant="outline" className="w-full sm:w-auto px-6 h-11 text-xs tracking-widest uppercase font-medium">
              View Our Projects
            </Button>
          </Link>
          <Link to="/renovation-design-tools">
            <Button className="w-full sm:w-auto px-6 h-11 text-xs tracking-widest uppercase font-medium">
              Explore Design Tools
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <p className="text-center text-foreground/50 text-xs tracking-widest uppercase mb-3">
        {eyebrow}
      </p>
      <p className="text-center text-foreground text-xl lg:text-2xl font-serif mb-6">
        {heading}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="hidden" aria-hidden="true">
          <Label htmlFor={`website-${source}`}>Website</Label>
          <Input
            id={`website-${source}`}
            name="website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`fullName-${source}`}>
              Full Name <span className="text-foreground/40">*</span>
            </Label>
            <Input
              id={`fullName-${source}`}
              value={formData.fullName}
              onChange={(e) => updateFormData("fullName", e.target.value)}
              placeholder="Your name"
              className={cn(errors.fullName && "border-destructive")}
            />
            {errors.fullName && (
              <p className="text-destructive text-xs">{errors.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`phone-${source}`}>
                Phone <span className="text-foreground/40">*</span>
              </Label>
              <Input
                id={`phone-${source}`}
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="Your phone number"
                className={cn(errors.phone && "border-destructive")}
              />
              {errors.phone && (
                <p className="text-destructive text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`email-${source}`}>
                Email <span className="text-foreground/40">*</span>
              </Label>
              <Input
                id={`email-${source}`}
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="your@email.com"
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`service-${source}`}>
              What do you need? <span className="text-foreground/40">*</span>
            </Label>
            <Select
              value={formData.service}
              onValueChange={(value) => updateFormData("service", value)}
            >
              <SelectTrigger
                id={`service-${source}`}
                className={cn("h-11", errors.service && "border-destructive")}
              >
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-destructive text-xs">{errors.service}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`budget-${source}`}>Budget range</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => updateFormData("budget", value)}
              >
                <SelectTrigger id={`budget-${source}`} className="h-11">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`timeline-${source}`}>When to start?</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => updateFormData("timeline", value)}
              >
                <SelectTrigger id={`timeline-${source}`} className="h-11">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border flex flex-col gap-3">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12"
          >
            {submitting ? "Submitting..." : "Submit Enquiry"}
            <Check className="w-4 h-4 ml-2" />
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-foreground/60">
            <span>Prefer to call?</span>
            <a
              href="tel:0413468928"
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              0413 468 928
            </a>
          </div>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-foreground/40">
        Fast Response · No Hidden Fees · Licensed &amp; Insured
      </p>
    </div>
  );
}
