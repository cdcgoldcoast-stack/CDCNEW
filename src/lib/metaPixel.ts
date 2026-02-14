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

export const initMetaPixel = () => {
  if (!META_PIXEL_ID || typeof window === "undefined") return;

  const fbq = ensureFbq(window, document);
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
};

export const trackMetaPixelPageView = () => {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
};
