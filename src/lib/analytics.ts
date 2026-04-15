declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const GTM_CONTAINER_ID = "GTM-T7838TJS";
const EVENT_DEDUPE_WINDOW_MS = 1500;
let gtmLoaded = false;

export const loadGtmScript = () => {
  if (typeof window === "undefined" || gtmLoaded) return;
  if (document.getElementById("gtm-loader-script")) {
    gtmLoaded = true;
    return;
  }
  gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "gtm-loader-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
};
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

const pushToDataLayer = (payload: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
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
  const pagePath = normalizeEventPath(path);
  if (lastTrackedPagePath === pagePath) return;
  lastTrackedPagePath = pagePath;

  pushToDataLayer({
    event: "page_view",
    event_name: "page_view",
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
  });
};

export const trackAnalyticsEvent = (event: AnalyticsEvent) => {
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
    event: event.event_name,
    event_name: event.event_name,
    page_path: pagePath,
    cta_location: event.cta_location || "unknown",
  };
  if (event.lead_type) payload.lead_type = event.lead_type;
  if (typeof event.value === "number") payload.value = event.value;

  for (const [key, value] of Object.entries(event)) {
    if (["event_name", "page_path", "cta_location", "lead_type", "value"].includes(key)) continue;
    payload[key] = value;
  }

  pushToDataLayer(payload);
};
