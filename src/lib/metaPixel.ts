declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

export const initMetaPixel = () => {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  if (window.fbq) return;

  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [] as any[];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
};

export const trackMetaPixelPageView = () => {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
};
