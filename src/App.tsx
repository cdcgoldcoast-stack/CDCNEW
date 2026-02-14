import { useEffect, lazy, Suspense } from "react";
import type { ReactElement } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import { trackMetaPixelPageView } from "@/lib/metaPixel";

// Eagerly load homepage (critical path)
import TestHome from "./pages/TestHome";

// Lazy-load all other routes
const Work = lazy(() => import("./pages/Work"));
const Gallery = lazy(() => import("./pages/Gallery"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const DesignTools = lazy(() => import("./pages/DesignTools"));
const AIDesignGenerator = lazy(() => import("./pages/AIDesignGenerator"));
const AIDesignIntro = lazy(() => import("./pages/AIDesignIntro"));
const MoodboardCreator = lazy(() => import("./pages/MoodboardCreator"));
const Services = lazy(() => import("./pages/Services"));
const GetQuote = lazy(() => import("./pages/GetQuote"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const LifeStagesPage = lazy(() => import("./pages/LifeStages"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"));
const AdminChatInquiries = lazy(() => import("./pages/admin/AdminChatInquiries"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminSiteImages = lazy(() => import("./pages/admin/AdminSiteImages"));
const AdminImageAssets = lazy(() => import("./pages/admin/AdminImageAssets"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const BrandGuidelines = lazy(() => import("./pages/BrandGuidelines"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrintBrochure = lazy(() => import("./pages/PrintBrochure"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));

// Defer chat widget - load after 3 seconds
const AIChatWidget = lazy(() =>
  new Promise<typeof import("@/components/AIChatWidget")>((resolve) =>
    setTimeout(() => resolve(import("@/components/AIChatWidget")), 3000)
  )
);

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
    <Suspense fallback={null}>
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
    </Suspense>
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
            <Suspense fallback={null}>
              <AIChatWidget />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
