"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

/**
 * Fixed bottom bar shown only on mobile (<md). Two CTAs:
 *   - Tap to call 0413 468 928 (primary conversion on phone screens)
 *   - Tap to book a consultation
 *
 * Hidden on md+ because desktop already has the sticky header CTA.
 * Uses a safe-area inset so the bar clears the home indicator on iOS.
 */
const MobileStickyCTA = () => {
  return (
    <>
      {/* Spacer so the fixed bar does not obscure footer copy on mobile. */}
      <div aria-hidden="true" className="md:hidden h-14" />
      <div
        className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-primary text-primary-foreground shadow-[0_-2px_8px_rgba(0,0,0,0.1)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        role="region"
        aria-label="Quick contact"
      >
      <div className="grid grid-cols-2">
        <a
          href="tel:0413468928"
          className="flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity border-r border-primary-foreground/20"
          aria-label="Call CDC Construct on 0413 468 928"
        >
          <Phone className="w-4 h-4" />
          Call Mark
        </a>
        <Link
          href="/book-renovation-consultation"
          className="flex items-center justify-center py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Book Consultation
        </Link>
      </div>
      </div>
    </>
  );
};

export default MobileStickyCTA;
