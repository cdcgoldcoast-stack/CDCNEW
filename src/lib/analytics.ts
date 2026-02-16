declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }
}

const GA_MEASUREMENT_ID = "G-R8P05RETF4";
const GA_SCRIPT_ID = "ga-gtag-script";
let gaInitScheduled = false;

const configureGtag = () => {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
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
  runWhenBrowserIsIdle(loadGoogleAnalyticsScript);
};
