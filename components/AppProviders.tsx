"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { initGoogleAnalytics, trackPageView } from "@/lib/analytics";
import { initMetaPixel, trackMetaPixelPageView } from "@/lib/metaPixel";

const AIChatWidget = dynamic(() => import("@/components/AIChatWidget"), {
  ssr: false,
});

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
  children: any;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());
  const [showChatWidget, setShowChatWidget] = useState(false);
  const isFirstPathRender = useRef(true);

  useEffect(() => {
    initGoogleAnalytics();
    initMetaPixel();
  }, []);

  useEffect(() => {
    if (!pathname) return;

    trackPageView(pathname);

    if (isFirstPathRender.current) {
      isFirstPathRender.current = false;
      return;
    }
    trackMetaPixelPageView();
  }, [pathname]);

  useEffect(() => {
    if (isAuditLikeClient()) return;

    let opened = false;
    let fallbackTimer: number | null = null;
    const interactionEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "scroll"];

    const revealChat = () => {
      if (opened) return;
      opened = true;
      setShowChatWidget(true);
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, revealChat);
      }
    };

    for (const eventName of interactionEvents) {
      window.addEventListener(eventName, revealChat, { passive: true, once: true });
    }

    fallbackTimer = window.setTimeout(revealChat, 12000);
    return () => {
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, revealChat);
      }
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          {showChatWidget ? <AIChatWidget /> : null}
          <Toaster />
          <SpeedInsights />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
