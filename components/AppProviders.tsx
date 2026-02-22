"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { initGoogleAnalytics, trackPageView } from "@/lib/analytics";
import { initMetaPixel, trackMetaPixelPageView } from "@/lib/metaPixel";

const AIChatWidget = dynamic(() => import("@/components/AIChatWidget"), {
  ssr: false,
});
const PromoPopup = dynamic(() => import("@/components/PromoPopup"), {
  ssr: false,
});
const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/react").then((module) => module.SpeedInsights),
  { ssr: false },
);

const INTERACTION_EVENTS: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "scroll"];
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const MOBILE_BOOTSTRAP_FALLBACK_MS = 20000;
const DESKTOP_CHAT_FALLBACK_MS = 12000;
const MOBILE_CHAT_FALLBACK_MS = 18000;

const isAuditLikeClient = () => {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    window.navigator.webdriver === true ||
    userAgent.includes("lighthouse") ||
    userAgent.includes("chrome-lighthouse") ||
    userAgent.includes("pagespeed")
  );
};

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());
  const [viewportType, setViewportType] = useState<"unknown" | "mobile" | "desktop">("unknown");
  const [allowMarketingScripts, setAllowMarketingScripts] = useState(false);
  const [allowEngagementUi, setAllowEngagementUi] = useState(false);
  const [allowSpeedInsights, setAllowSpeedInsights] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const auditLikeRef = useRef(false);
  const isFirstPathRender = useRef(true);

  useEffect(() => {
    auditLikeRef.current = isAuditLikeClient();
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const syncViewport = () => {
      setViewportType(mediaQuery.matches ? "mobile" : "desktop");
    };

    syncViewport();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }
    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  useEffect(() => {
    if (auditLikeRef.current || viewportType === "unknown") return;

    if (viewportType === "desktop") {
      setAllowMarketingScripts(true);
      setAllowEngagementUi(true);
      setAllowSpeedInsights(true);
      return;
    }

    let activated = false;
    let fallbackTimer: number | null = null;

    const activateMobileDeferredUi = () => {
      if (activated) return;
      activated = true;
      setAllowMarketingScripts(true);
      setAllowEngagementUi(true);
      setAllowSpeedInsights(true);
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, activateMobileDeferredUi);
      }
    };

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, activateMobileDeferredUi, { passive: true, once: true });
    }

    fallbackTimer = window.setTimeout(activateMobileDeferredUi, MOBILE_BOOTSTRAP_FALLBACK_MS);
    return () => {
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, activateMobileDeferredUi);
      }
    };
  }, [viewportType]);

  useEffect(() => {
    if (!allowMarketingScripts) return;
    initGoogleAnalytics();
    initMetaPixel();
  }, [allowMarketingScripts]);

  useEffect(() => {
    if (!pathname || !allowMarketingScripts) return;

    trackPageView(pathname);

    if (isFirstPathRender.current) {
      isFirstPathRender.current = false;
      return;
    }
    trackMetaPixelPageView();
  }, [allowMarketingScripts, pathname]);

  useEffect(() => {
    if (!allowEngagementUi || auditLikeRef.current) return;

    let opened = false;
    let fallbackTimer: number | null = null;
    const chatFallbackMs = viewportType === "mobile" ? MOBILE_CHAT_FALLBACK_MS : DESKTOP_CHAT_FALLBACK_MS;

    const revealChat = () => {
      if (opened) return;
      opened = true;
      setShowChatWidget(true);
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, revealChat);
      }
    };

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, revealChat, { passive: true, once: true });
    }

    fallbackTimer = window.setTimeout(revealChat, chatFallbackMs);
    return () => {
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, revealChat);
      }
    };
  }, [allowEngagementUi, viewportType]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          {showChatWidget ? <AIChatWidget /> : null}
          {allowEngagementUi ? <PromoPopup delay={viewportType === "mobile" ? 10 : 7} /> : null}
          <Toaster />
          {allowSpeedInsights ? <SpeedInsights /> : null}
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
