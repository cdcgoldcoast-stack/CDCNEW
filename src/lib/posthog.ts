import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Use same-origin reverse proxy (see next.config.mjs `rewrites`) so ad blockers
// don't eat ingest requests. UI links still point at the real PostHog app.
const POSTHOG_HOST = "/ingest";
const POSTHOG_UI_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com";

let initialized = false;

export const isAdminPath = (pathname: string | null | undefined): boolean =>
  typeof pathname === "string" && pathname.startsWith("/admin");

/**
 * Initialize PostHog once, on the client, when marketing scripts are allowed.
 * Autocapture is enabled but manual page-view tracking is used so we can suppress
 * capture entirely on /admin/* routes (where lead PII lives).
 */
export const initPostHog = () => {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (!POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    ui_host: POSTHOG_UI_HOST,
    capture_pageview: false, // we call capture('$pageview') manually
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: true, // opt-in explicitly later if needed
    person_profiles: "identified_only", // don't create anonymous profiles
    loaded: (ph) => {
      // Default to opted-out on admin pages so no autocapture fires.
      if (isAdminPath(window.location.pathname)) {
        ph.opt_out_capturing();
      }
    },
  });

  initialized = true;
};

export const trackPostHogPageView = (pathname: string) => {
  if (!initialized) return;
  if (isAdminPath(pathname)) {
    if (!posthog.has_opted_out_capturing()) {
      posthog.opt_out_capturing();
    }
    return;
  }
  if (posthog.has_opted_out_capturing()) {
    posthog.opt_in_capturing();
  }
  posthog.capture("$pageview", { $current_url: window.location.href });
};

/**
 * Fire a named event. No-ops on admin routes, when the key is missing,
 * or before init. Never pass PII (names, emails, phones) as properties —
 * only category-level metadata (budget bucket, source, timeline, etc).
 */
export const capturePostHogEvent = (
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) => {
  if (!initialized) return;
  if (typeof window === "undefined") return;
  if (isAdminPath(window.location.pathname)) return;
  posthog.capture(eventName, properties);
};

export { posthog };
