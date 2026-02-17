type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }
}

const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.VITE_META_PIXEL_ID || "";
const META_IDLE_FALLBACK_MS = 12000;
const META_INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

let metaInitScheduled = false;
let metaInitialized = false;

function ensureFbq(windowRef: Window, documentRef: Document): FbqFunction {
  if (windowRef.fbq) return windowRef.fbq;

  const fbq = ((...args: unknown[]) => {
    if (typeof fbq.callMethod === "function") {
      fbq.callMethod(...args);
      return;
    }
    fbq.queue.push(args);
  }) as FbqFunction;

  fbq.queue = [];
  fbq.push = (...args: unknown[]) => {
    fbq.queue.push(args);
  };
  fbq.loaded = true;
  fbq.version = "2.0";

  windowRef.fbq = fbq;
  if (!windowRef._fbq) {
    windowRef._fbq = fbq;
  }

  const script = documentRef.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = documentRef.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  return fbq;
}

const runWhenBrowserIsIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => callback(), { timeout: 2500 });
    return;
  }
  window.setTimeout(callback, 2000);
};

const loadMetaPixel = () => {
  if (metaInitialized || !META_PIXEL_ID || typeof window === "undefined") return;
  metaInitialized = true;

  const fbq = ensureFbq(window, document);
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
};

export const initMetaPixel = () => {
  if (!META_PIXEL_ID || typeof window === "undefined" || metaInitScheduled) return;
  metaInitScheduled = true;

  let loaded = false;
  let timeoutId: number | null = null;

  const cleanupListeners = () => {
    for (const eventName of META_INTERACTION_EVENTS) {
      window.removeEventListener(eventName, triggerLoad);
    }
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const loadOnce = () => {
    if (loaded) return;
    loaded = true;
    cleanupListeners();
    runWhenBrowserIsIdle(loadMetaPixel);
  };

  const triggerLoad = () => {
    loadOnce();
  };

  for (const eventName of META_INTERACTION_EVENTS) {
    window.addEventListener(eventName, triggerLoad, { passive: true });
  }

  timeoutId = window.setTimeout(loadOnce, META_IDLE_FALLBACK_MS);
};

export const trackMetaPixelPageView = () => {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
};
