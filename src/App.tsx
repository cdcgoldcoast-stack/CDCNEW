import { useEffect } from "react";
import type { ReactElement } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";
import AIChatWidget from "@/components/AIChatWidget";
import PageTransition from "@/components/PageTransition";
import TestHome from "./pages/TestHome";
import Work from "./pages/Work";
import Gallery from "./pages/Gallery";
import ProjectDetail from "./pages/ProjectDetail";
import DesignTools from "./pages/DesignTools";
import AIDesignGenerator from "./pages/AIDesignGenerator";
import AIDesignIntro from "./pages/AIDesignIntro";
import MoodboardCreator from "./pages/MoodboardCreator";
import Services from "./pages/Services";
import GetQuote from "./pages/GetQuote";
import AboutUs from "./pages/AboutUs";
import LifeStagesPage from "./pages/LifeStages";
import Auth from "./pages/Auth";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminChatInquiries from "./pages/admin/AdminChatInquiries";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminSiteImages from "./pages/admin/AdminSiteImages";
import AdminImageAssets from "./pages/admin/AdminImageAssets";
import AdminSettings from "./pages/admin/AdminSettings";
import BrandGuidelines from "./pages/BrandGuidelines";
import NotFound from "./pages/NotFound";
import PrintBrochure from "./pages/PrintBrochure";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import { trackMetaPixelPageView } from "@/lib/metaPixel";

const queryClient = new QueryClient();

const MetaPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackMetaPixelPageView();
  }, [location.pathname, location.search]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const withTransition = (element: ReactElement) => <PageTransition>{element}</PageTransition>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={withTransition(<TestHome />)} />
        <Route path="/about-us" element={withTransition(<AboutUs />)} />
        <Route path="/our-story" element={<Navigate to="/about-us" replace />} />
        <Route path="/life-stages" element={withTransition(<LifeStagesPage />)} />
        <Route path="/projects" element={withTransition(<Work />)} />
        <Route path="/services" element={withTransition(<Services />)} />
        <Route path="/gallery" element={withTransition(<Gallery />)} />
        <Route path="/projects/:slug" element={withTransition(<ProjectDetail />)} />
        <Route path="/design-tools" element={withTransition(<DesignTools />)} />
        <Route path="/design-tools/ai-generator/intro" element={withTransition(<AIDesignIntro />)} />
        <Route path="/design-tools/ai-generator" element={withTransition(<AIDesignGenerator />)} />
        <Route path="/design-tools/moodboard" element={withTransition(<MoodboardCreator />)} />
        <Route path="/get-quote" element={withTransition(<GetQuote />)} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        <Route path="/admin/chat-inquiries" element={<AdminChatInquiries />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/site-images" element={<AdminSiteImages />} />
        <Route path="/admin/image-assets" element={<AdminImageAssets />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/brand-guidelines" element={withTransition(<BrandGuidelines />)} />
        <Route path="/print-brochure" element={withTransition(<PrintBrochure />)} />
        <Route path="/privacy-policy" element={withTransition(<PrivacyPolicy />)} />
        <Route path="/terms-conditions" element={withTransition(<TermsConditions />)} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={withTransition(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // Signal to prerenderer that content is ready
  useEffect(() => {
    let didDispatch = false;

    const dispatchReady = () => {
      if (didDispatch) return;
      didDispatch = true;
      document.dispatchEvent(new Event("prerender-ready"));
    };

    const interval = setInterval(() => {
      const preloader = document.querySelector('[data-preloader="true"]');
      if (!preloader) {
        dispatchReady();
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      dispatchReady();
      clearInterval(interval);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MetaPixelTracker />
            <ScrollToTop />
            <AnimatedRoutes />
            <AIChatWidget />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
