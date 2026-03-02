"use client";

import dynamic from "next/dynamic";
import { Navigate } from "react-router-dom";
import type { ProjectDetailProps } from "@/views/ProjectDetail";
import RequireAdmin from "@/components/admin/RequireAdmin";

// Lightweight pages - static imports
import AboutUsPage from "@/views/AboutUs";
import AuthPage from "@/views/Auth";
import BeforeAfterPage from "@/views/BeforeAfter";
import DesignToolsPage from "@/views/DesignTools";
import FAQPage from "@/views/FAQ";
import GalleryPage from "@/views/Gallery";
import GetQuotePage from "@/views/GetQuote";
import HowWeWorkPage from "@/views/HowWeWork";
import LifeStagesPage from "@/views/LifeStages";
import NotFoundPage from "@/views/NotFound";
import PrivacyPolicyPage from "@/views/PrivacyPolicy";
import ReferralProgramPage from "@/views/ReferralProgram";
import ServicesPage from "@/views/Services";
import TermsConditionsPage from "@/views/TermsConditions";
import TestimonialsPage from "@/views/Testimonials";
import WhyCDCPage from "@/views/WhyCDC";
import WorkPage from "@/views/Work";

// Service pages - dynamic imports
const KitchenRenovationsPage = dynamic(() => import("@/views/KitchenRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

const BathroomRenovationsPage = dynamic(() => import("@/views/BathroomRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

const WholeHomeRenovationsPage = dynamic(() => import("@/views/WholeHomeRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

// Location pages
const BroadbeachRenovationsPage = dynamic(() => import("@/views/BroadbeachRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

const MermaidBeachRenovationsPage = dynamic(() => import("@/views/MermaidBeachRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

const PalmBeachRenovationsPage = dynamic(() => import("@/views/PalmBeachRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

const RobinaRenovationsPage = dynamic(() => import("@/views/RobinaRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

const SouthportRenovationsPage = dynamic(() => import("@/views/SouthportRenovations"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
});

// Heavy pages - dynamic imports with loading states
const AIDesignGeneratorPage = dynamic(() => import("@/views/AIDesignGenerator"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
  ssr: false,
});

const AIDesignIntroPage = dynamic(() => import("@/views/AIDesignIntro"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
  ssr: false,
});

const MoodboardCreatorPage = dynamic(() => import("@/views/MoodboardCreator"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
  ssr: false,
});

const ProjectDetailPage = dynamic(() => import("@/views/ProjectDetail"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
  ssr: false,
});

const BrandGuidelinesPage = dynamic(() => import("@/views/BrandGuidelines"), {
  ssr: false,
});

// Admin pages - dynamic imports
const AdminDashboardPage = dynamic(() => import("@/views/admin/AdminDashboard"), {
  ssr: false,
});
const AdminChatInquiriesPage = dynamic(() => import("@/views/admin/AdminChatInquiries"), {
  ssr: false,
});
const AdminEnquiriesPage = dynamic(() => import("@/views/admin/AdminEnquiries"), {
  ssr: false,
});
const AdminGalleryPage = dynamic(() => import("@/views/admin/AdminGallery"), {
  ssr: false,
});
const AdminImageAssetsPage = dynamic(() => import("@/views/admin/AdminImageAssets"), {
  ssr: false,
});
const AdminProjectsPage = dynamic(() => import("@/views/admin/AdminProjects"), {
  ssr: false,
});
const AdminSettingsPage = dynamic(() => import("@/views/admin/AdminSettings"), {
  ssr: false,
});

const AdminPopupResponsesPage = dynamic(() => import("@/views/admin/AdminPopupResponses"), {
  ssr: false,
});
const AdminSiteImagesPage = dynamic(() => import("@/views/admin/AdminSiteImages"), {
  ssr: false,
});

const BurleighHeadsPage = dynamic(() => import("@/views/BurleighHeads"), {
  ssr: false,
});

export function AboutUsClient() {
  return <AboutUsPage />;
}

export function ServicesClient() {
  return <ServicesPage />;
}

export function RenovationProjectsClient() {
  return <WorkPage />;
}

export function ProjectGalleryClient() {
  return <GalleryPage />;
}

export function RenovationDesignToolsClient() {
  return <DesignToolsPage />;
}

export function LifeStagesClient() {
  return <LifeStagesPage />;
}

export function GetQuoteClient() {
  return <GetQuotePage />;
}

export function PrivacyPolicyClient() {
  return <PrivacyPolicyPage />;
}

export function TermsConditionsClient() {
  return <TermsConditionsPage />;
}

export function AIDesignIntroClient() {
  return <AIDesignIntroPage />;
}

export function AIDesignGeneratorClient() {
  return <AIDesignGeneratorPage />;
}

export function MoodboardClient() {
  return <MoodboardCreatorPage />;
}

export function ProjectDetailClient(props: ProjectDetailProps) {
  return <ProjectDetailPage {...props} />;
}

export function NotFoundClient() {
  return <NotFoundPage />;
}

export function BurleighHeadsClient() {
  return <BurleighHeadsPage />;
}

export function AuthClient() {
  return <AuthPage />;
}

export function BrandGuidelinesClient() {
  return (
    <RequireAdmin>
      <BrandGuidelinesPage />
    </RequireAdmin>
  );
}

export function AdminIndexClient() {
  return (
    <RequireAdmin>
      <Navigate to="/admin/dashboard" replace />
    </RequireAdmin>
  );
}

export function AdminDashboardClient() {
  return (
    <RequireAdmin>
      <AdminDashboardPage />
    </RequireAdmin>
  );
}

export function AdminProjectsClient() {
  return (
    <RequireAdmin>
      <AdminProjectsPage />
    </RequireAdmin>
  );
}

export function AdminEnquiriesClient() {
  return (
    <RequireAdmin>
      <AdminEnquiriesPage />
    </RequireAdmin>
  );
}

export function AdminChatInquiriesClient() {
  return (
    <RequireAdmin>
      <AdminChatInquiriesPage />
    </RequireAdmin>
  );
}

export function AdminGalleryClient() {
  return (
    <RequireAdmin>
      <AdminGalleryPage />
    </RequireAdmin>
  );
}

export function AdminSiteImagesClient() {
  return (
    <RequireAdmin>
      <AdminSiteImagesPage />
    </RequireAdmin>
  );
}

export function AdminImageAssetsClient() {
  return (
    <RequireAdmin>
      <AdminImageAssetsPage />
    </RequireAdmin>
  );
}

export function AdminSettingsClient() {
  return (
    <RequireAdmin>
      <AdminSettingsPage />
    </RequireAdmin>
  );
}

export function AdminPopupResponsesClient() {
  return (
    <RequireAdmin>
      <AdminPopupResponsesPage />
    </RequireAdmin>
  );
}

export function KitchenRenovationsClient() {
  return <KitchenRenovationsPage />;
}

export function BathroomRenovationsClient() {
  return <BathroomRenovationsPage />;
}

export function WholeHomeRenovationsClient() {
  return <WholeHomeRenovationsPage />;
}

// Location pages
export function BroadbeachRenovationsClient() {
  return <BroadbeachRenovationsPage />;
}

export function MermaidBeachRenovationsClient() {
  return <MermaidBeachRenovationsPage />;
}

export function PalmBeachRenovationsClient() {
  return <PalmBeachRenovationsPage />;
}

export function RobinaRenovationsClient() {
  return <RobinaRenovationsPage />;
}

export function SouthportRenovationsClient() {
  return <SouthportRenovationsPage />;
}

export function ReferralProgramClient() {
  return <ReferralProgramPage />;
}

export function HowWeWorkClient() {
  return <HowWeWorkPage />;
}

export function FAQClient() {
  return <FAQPage />;
}

export function WhyCDCClient() {
  return <WhyCDCPage />;
}

export function TestimonialsClient() {
  return <TestimonialsPage />;
}

export function BeforeAfterClient() {
  return <BeforeAfterPage />;
}
