"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
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
    <div className="fixed bottom-6 right-4 md:right-6 z-50 w-[340px] md:w-[380px]">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-neutral-100">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          aria-label="Close popup"
        >
          <X className="w-3.5 h-3.5 text-neutral-500" />
        </button>

        {!isFormOpen && !isSubmitted && (
          <div className="p-5 pt-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/70 mb-2">
              Free consultation
            </p>
            <h3 className="font-serif text-xl text-neutral-900 leading-snug mb-2">
              Thinking about renovating?
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-5">
              We&apos;ll visit your home, talk through your ideas, and share honest advice — no obligation.
            </p>
            <button
              onClick={handleClaimClick}
              className="w-full bg-primary text-white font-medium py-3 px-5 rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2 group"
            >
              Book a free walkthrough
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}

        {isFormOpen && !isSubmitted && (
          <form onSubmit={handleSubmit} className="p-5 pt-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/70 mb-2">
              Almost there
            </p>
            <h3 className="font-serif text-xl text-neutral-900 leading-snug mb-1">
              Leave your details
            </h3>
            <p className="text-sm text-neutral-500 mb-4">
              We&apos;ll arrange a time that suits you.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                required
              />

              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                required
              />

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-medium py-3 px-5 rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Sending..." : "Send"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-full text-xs text-neutral-400 hover:text-neutral-600 transition-colors py-1"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {isSubmitted && (
          <div className="p-5 pt-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-neutral-900 mb-1">Thank you</h3>
            <p className="text-sm text-neutral-500">
              We&apos;ll be in touch shortly to arrange your walkthrough.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoPopup;
