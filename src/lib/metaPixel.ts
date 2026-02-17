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
  }
}

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const META_PIXEL_SCRIPT_ID = "fb-pixel-script";
const META_PIXEL_IDLE_FALLBACK_MS = 8000;
const META_PIXEL_INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
let metaPixelInitScheduled = false;

/** Set up the fbq queue stub so calls are buffered before the script loads. */
function ensureFbqStub(): FbqFunction {
  if (window.fbq) return window.fbq;

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

  window.fbq = fbq;
  if (!window._fbq) {
    window._fbq = fbq;
  }

  return fbq;
}

/** Insert the actual fbevents.js script tag. */
function loadMetaPixelScript() {
  if (document.getElementById(META_PIXEL_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = META_PIXEL_SCRIPT_ID;
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

export const initMetaPixel = () => {
  if (!META_PIXEL_ID || typeof window === "undefined" || metaPixelInitScheduled) return;
  metaPixelInitScheduled = true;

  // Set up queue immediately so init + PageView are buffered
  const fbq = ensureFbqStub();
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");

  // Defer actual script load to first interaction or timeout
  let loaded = false;
  let timeoutId: number | null = null;
  let triggerLoad: (() => void) | null = null;

  const cleanupListeners = () => {
    if (triggerLoad) {
      for (const eventName of META_PIXEL_INTERACTION_EVENTS) {
        window.removeEventListener(eventName, triggerLoad);
      }
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
    loadMetaPixelScript();
  };

  triggerLoad = loadOnce;

  for (const eventName of META_PIXEL_INTERACTION_EVENTS) {
    window.addEventListener(eventName, triggerLoad, { passive: true });
  }
  timeoutId = window.setTimeout(loadOnce, META_PIXEL_IDLE_FALLBACK_MS);
};

export const trackMetaPixelPageView = () => {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
};
