"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { initGoogleAnalytics } from "@/lib/analytics";
import { initMetaPixel, trackMetaPixelPageView } from "@/lib/metaPixel";

const AIChatWidget = dynamic(() => import("@/components/AIChatWidget"), {
  ssr: false,
});

interface AppProvidersProps {
  children: any;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());
  const [showChatWidget, setShowChatWidget] = useState(false);

  useEffect(() => {
    initGoogleAnalytics();
    initMetaPixel();
  }, []);

  useEffect(() => {
    trackMetaPixelPageView();
  }, [pathname]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowChatWidget(true), 3000);
    return () => window.clearTimeout(timer);
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
