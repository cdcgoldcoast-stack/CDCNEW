"use client";

import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

interface PromoPopupProps {
  delay?: number; // in seconds
}

const PromoPopup = ({ delay = 7 }: PromoPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user has already seen/submitted popup in this session
    const hasInteracted = sessionStorage.getItem("promoPopupInteracted");
    if (hasInteracted) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      trackAnalyticsEvent({
        event_name: "promo_popup_shown",
        cta_location: "popup",
        lead_type: "promo",
      });
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setIsVisible(false);
    setIsFormOpen(false);
    sessionStorage.setItem("promoPopupInteracted", "dismissed");
    trackAnalyticsEvent({
      event_name: "promo_popup_dismissed",
      cta_location: "popup",
      lead_type: "promo",
    });
  };

  const handleClaimClick = () => {
    setIsFormOpen(true);
    trackAnalyticsEvent({
      event_name: "promo_popup_claim_clicked",
      cta_location: "popup",
      lead_type: "promo",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("Please enter both name and phone number");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\d\s+()-]{8,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke<{
        success?: boolean;
        id?: string;
        deduped?: boolean;
        error?: string;
      }>("save-popup-response", {
        body: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          source: "promo_popup",
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          website: "",
        },
      });

      if (invokeError) {
        const context = (invokeError as { context?: { json?: () => Promise<unknown> } }).context;
        if (context?.json) {
          const body = await context.json();
          const message = (body as { error?: string })?.error;
          if (message) throw new Error(message);
        }
        throw invokeError;
      }

      if (data?.error) throw new Error(data.error);
      if (!data?.success) throw new Error("Could not save popup response.");

      setIsSubmitted(true);
      sessionStorage.setItem("promoPopupInteracted", "submitted");
      trackAnalyticsEvent({
        event_name: "promo_popup_submitted",
        cta_location: "popup",
        lead_type: "promo",
        value: 1,
      });

      // Auto close after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (err) {
      console.error("Error saving popup response:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[320px] md:w-[360px]">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            <span className="font-medium text-sm">Limited Time Offer</span>
          </div>
          <button
            onClick={handleClose}
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {!isFormOpen && !isSubmitted && (
            <>
              <h3 className="font-serif text-lg leading-tight mb-2">
                Get a FREE Comprehensive Site Audit
              </h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Worth $450 - We'll assess your home's renovation potential and provide expert recommendations.
              </p>
              <button
                onClick={handleClaimClick}
                className="w-full bg-background text-foreground font-medium py-3 px-4 rounded hover:bg-background/90 transition-colors text-sm"
              >
                Claim My Free Audit
              </button>
              <p className="text-[10px] text-primary-foreground/60 mt-2 text-center">
                Limited spots available. Offer ends soon.
              </p>
            </>
          )}

          {isFormOpen && !isSubmitted && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="font-serif text-lg leading-tight">
                Claim Your Free Audit
              </h3>
              <p className="text-sm text-primary-foreground/80">
                Enter your details and we'll contact you within 24 hours.
              </p>
              
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded text-foreground bg-background border-0 text-sm placeholder:text-foreground/50 focus:ring-2 focus:ring-background"
                required
              />
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded text-foreground bg-background border-0 text-sm placeholder:text-foreground/50 focus:ring-2 focus:ring-background"
                required
              />

              {error && (
                <p className="text-xs text-red-200">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-background text-foreground font-medium py-3 px-4 rounded hover:bg-background/90 transition-colors text-sm disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-full text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                ← Back
              </button>
            </form>
          )}

          {isSubmitted && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg mb-2">Thank You!</h3>
              <p className="text-sm text-primary-foreground/80">
                We'll contact you within 24 hours to schedule your free site audit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
