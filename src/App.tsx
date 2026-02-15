import { useEffect, lazy, Suspense } from "react";
import type { ReactElement } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import { trackMetaPixelPageView } from "@/lib/metaPixel";
import RequireAdmin from "@/components/admin/RequireAdmin";

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

const LegacyProjectRouteRedirect = () => {
  const { slug } = useParams<{ slug?: string }>();
  return <Navigate to={slug ? `/renovation-projects/${slug}` : "/renovation-projects"} replace />;
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
          <Route path="/renovation-projects" element={withTransition(<Work />)} />
          <Route path="/projects" element={<Navigate to="/renovation-projects" replace />} />
          <Route path="/services" element={withTransition(<Services />)} />
          <Route path="/project-gallery" element={withTransition(<Gallery />)} />
          <Route path="/gallery" element={<Navigate to="/project-gallery" replace />} />
          <Route path="/renovation-projects/:slug" element={withTransition(<ProjectDetail />)} />
          <Route path="/projects/:slug" element={<LegacyProjectRouteRedirect />} />
          <Route path="/renovation-design-tools" element={withTransition(<DesignTools />)} />
          <Route path="/design-tools" element={<Navigate to="/renovation-design-tools" replace />} />
          <Route path="/renovation-design-tools/ai-generator/intro" element={withTransition(<AIDesignIntro />)} />
          <Route path="/design-tools/ai-generator/intro" element={<Navigate to="/renovation-design-tools/ai-generator/intro" replace />} />
          <Route path="/renovation-design-tools/ai-generator" element={withTransition(<AIDesignGenerator />)} />
          <Route path="/design-tools/ai-generator" element={<Navigate to="/renovation-design-tools/ai-generator" replace />} />
          <Route path="/renovation-design-tools/moodboard" element={withTransition(<MoodboardCreator />)} />
          <Route path="/design-tools/moodboard" element={<Navigate to="/renovation-design-tools/moodboard" replace />} />
          <Route path="/get-quote" element={withTransition(<GetQuote />)} />

          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<RequireAdmin><Navigate to="/admin/projects" replace /></RequireAdmin>} />
          <Route path="/admin/projects" element={<RequireAdmin><AdminProjects /></RequireAdmin>} />
          <Route path="/admin/enquiries" element={<RequireAdmin><AdminEnquiries /></RequireAdmin>} />
          <Route path="/admin/chat-inquiries" element={<RequireAdmin><AdminChatInquiries /></RequireAdmin>} />
          <Route path="/admin/gallery" element={<RequireAdmin><AdminGallery /></RequireAdmin>} />
          <Route path="/admin/site-images" element={<RequireAdmin><AdminSiteImages /></RequireAdmin>} />
          <Route path="/admin/image-assets" element={<RequireAdmin><AdminImageAssets /></RequireAdmin>} />
          <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
          <Route path="/brand-guidelines" element={<RequireAdmin>{withTransition(<BrandGuidelines />)}</RequireAdmin>} />
          <Route path="/print-brochure" element={<RequireAdmin>{withTransition(<PrintBrochure />)}</RequireAdmin>} />
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

    const hasPrerenderableContent = () => {
      const root = document.getElementById("root");
      if (!root) return false;

      // Require both mounted route content and canonical SEO tag before snapshot.
      const hasRouteContent = !!root.querySelector("main, h1, h2, section");
      const hasCanonical = !!document.head.querySelector("link[rel='canonical']");
      return hasRouteContent && hasCanonical;
    };

    const interval = setInterval(() => {
      if (hasPrerenderableContent()) {
        dispatchReady();
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      dispatchReady();
      clearInterval(interval);
    }, 12000);

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
