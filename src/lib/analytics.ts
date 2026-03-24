declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-R8P05RETF4";
const EVENT_DEDUPE_WINDOW_MS = 1500;
let lastTrackedPagePath = "";
const eventDedupeCache = new Map<string, number>();

const normalizeEventPath = (path?: string) => {
  if (path && path.startsWith("/")) return path;
  if (typeof window !== "undefined") return window.location.pathname || "/";
  return "/";
};

const pruneEventDedupeCache = (now: number) => {
  for (const [key, timestamp] of eventDedupeCache.entries()) {
    if (now - timestamp > EVENT_DEDUPE_WINDOW_MS) {
      eventDedupeCache.delete(key);
    }
  }
};

export type AnalyticsEvent = {
  event_name: string;
  page_path?: string;
  cta_location?: "header" | "hero" | "footer" | "form" | "tool" | "content" | "popup" | "unknown";
  lead_type?: string;
  value?: number;
  [key: string]: unknown;
};

export const trackPageView = (path?: string) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const pagePath = normalizeEventPath(path);
  if (lastTrackedPagePath === pagePath) return;
  lastTrackedPagePath = pagePath;

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
  });
};

export const trackAnalyticsEvent = (event: AnalyticsEvent) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const pagePath = normalizeEventPath(event.page_path);
  const now = Date.now();

  pruneEventDedupeCache(now);
  const dedupeKey = [
    event.event_name,
    pagePath,
    event.cta_location || "unknown",
    event.lead_type || "",
    typeof event.value === "number" ? String(event.value) : "",
  ].join("|");

  const lastFiredAt = eventDedupeCache.get(dedupeKey);
  if (typeof lastFiredAt === "number" && now - lastFiredAt < EVENT_DEDUPE_WINDOW_MS) {
    return;
  }
  eventDedupeCache.set(dedupeKey, now);

  const payload: Record<string, unknown> = {
    page_path: pagePath,
    cta_location: event.cta_location || "unknown",
  };
  if (event.lead_type) payload.lead_type = event.lead_type;
  if (typeof event.value === "number") payload.value = event.value;

  for (const [key, value] of Object.entries(event)) {
    if (["event_name", "page_path", "cta_location", "lead_type", "value"].includes(key)) continue;
    payload[key] = value;
  }

  window.gtag("event", event.event_name, payload);
};
