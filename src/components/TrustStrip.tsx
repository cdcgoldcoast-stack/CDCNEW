"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Award, Droplets, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { REVIEW_STATS, GOOGLE_REVIEWS_URL } from "@/config/reviews";

/**
 * Above-the-fold credibility block used on service pages.
 * Five compact trust signals, all sourced from real company data:
 *   - QBCC Lic 15155156 (from Footer.tsx)
 *   - 25+ years building on the Gold Coast (Mark Mayne authorship bio)
 *   - 4.9★ Google rating, live from admin/settings when available
 *   - 10-year waterproofing warranty (documented in the AS 3740 blog post)
 *   - ABN 88 624 756 476 (from Footer.tsx)
 *
 * Mobile-first: stacks into a 2-column grid below md; becomes a horizontal
 * strip from md up. Intentionally plain typography so it reads as a credentials
 * bar, not a marketing banner.
 */
const TrustStrip = ({ className = "" }: { className?: string }) => {
  const [rating, setRating] = useState<string>(REVIEW_STATS.ratingValue);
  const [count, setCount] = useState<string>(REVIEW_STATS.reviewCount);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("notification_settings")
      .select("review_rating, review_count")
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        if (data.review_rating) setRating(data.review_rating);
        if (data.review_count) setCount(data.review_count);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    {
      icon: ShieldCheck,
      label: "QBCC Licensed",
      value: "Lic. 15155156",
      href: "https://www.qbcc.qld.gov.au",
      external: true,
      ariaLabel: "QBCC licensed builder, licence number 15155156",
    },
    {
      icon: Award,
      label: "Building Since 2000",
      value: "25+ years on the Gold Coast",
      ariaLabel: "More than 25 years building renovations on the Gold Coast",
    },
    {
      icon: Star,
      label: "Google Reviews",
      value: `${rating}★ (${count}+ reviews)`,
      href: GOOGLE_REVIEWS_URL,
      external: true,
      ariaLabel: `${rating} star Google rating from ${count} or more reviews`,
    },
    {
      icon: Droplets,
      label: "Waterproofing Warranty",
      value: "10-year coverage",
      href: "/blog/bathroom-waterproofing-standards-as3740-gold-coast",
      ariaLabel: "10-year waterproofing warranty, exceeds the statutory minimum",
    },
    {
      icon: ShieldCheck,
      label: "ABN",
      value: "88 624 756 476",
      ariaLabel: "Australian Business Number 88 624 756 476",
    },
  ] as const;

  return (
    <section
      aria-label="Trust and accreditation"
      className={[
        "bg-cream border-y border-foreground/10 py-6 md:py-7 relative z-10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="container-wide px-5 md:px-10 lg:px-12">
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-5 items-start">
          {items.map((item) => {
            const Icon = item.icon;
            const body = (
              <div className="flex items-start gap-3">
                <Icon
                  className="w-5 h-5 md:w-[22px] md:h-[22px] text-primary flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-foreground/60">
                    {item.label}
                  </span>
                  <span className="text-xs md:text-sm text-foreground/90 mt-1 break-words">
                    {item.value}
                  </span>
                </div>
              </div>
            );

            return (
              <li key={`${item.label}-${item.value}`}>
                {"href" in item && item.href ? (
                  <a
                    href={item.href}
                    aria-label={item.ariaLabel}
                    className="block hover:opacity-80 transition-opacity"
                    {...("external" in item && item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {body}
                  </a>
                ) : (
                  <div aria-label={item.ariaLabel}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default TrustStrip;
