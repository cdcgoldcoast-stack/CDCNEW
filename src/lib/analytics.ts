declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = "G-R8P05RETF4";
const GA_SCRIPT_ID = "ga-gtag-script";
const EVENT_DEDUPE_WINDOW_MS = 1500;
const GA_IDLE_FALLBACK_MS = 12000;
const GA_INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
let gaInitScheduled = false;
let lastTrackedPagePath = "";
const eventDedupeCache = new Map<string, number>();

const ensureGtagStub = () => {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }
};

const configureGtag = () => {
  ensureGtagStub();

  window.gtag!("js", new Date());
  window.gtag!("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  if (!lastTrackedPagePath) {
    const initialPagePath = window.location.pathname || "/";
    lastTrackedPagePath = initialPagePath;
    window.gtag!("event", "page_view", {
      page_path: initialPagePath,
      page_location: `${window.location.origin}${initialPagePath}`,
    });
  }
};

const loadGoogleAnalyticsScript = () => {
  if (document.getElementById(GA_SCRIPT_ID)) {
    configureGtag();
    return;
  }

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = configureGtag;
  document.head.appendChild(script);
};

const runWhenBrowserIsIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => callback(), { timeout: 2500 });
    return;
  }
  window.setTimeout(callback, 2000);
};

export const initGoogleAnalytics = () => {
  if (typeof window === "undefined" || gaInitScheduled) return;
  gaInitScheduled = true;
  ensureGtagStub();

  let loaded = false;
  let timeoutId: number | null = null;
  let triggerLoad: (() => void) | null = null;

  const cleanupInteractionListeners = () => {
    if (triggerLoad) {
      for (const eventName of GA_INTERACTION_EVENTS) {
        window.removeEventListener(eventName, triggerLoad);
      }
    }
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const loadScriptOnce = () => {
    if (loaded) return;
    loaded = true;
    cleanupInteractionListeners();
    runWhenBrowserIsIdle(loadGoogleAnalyticsScript);
  };

  triggerLoad = () => {
    loadScriptOnce();
  };

  for (const eventName of GA_INTERACTION_EVENTS) {
    window.addEventListener(eventName, triggerLoad, { passive: true });
  }
  timeoutId = window.setTimeout(loadScriptOnce, GA_IDLE_FALLBACK_MS);
};

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
