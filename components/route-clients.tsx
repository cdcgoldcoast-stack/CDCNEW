"use client";

import dynamic from "next/dynamic";
import { Navigate } from "react-router-dom";
import type { ProjectDetailProps } from "@/views/ProjectDetail";
import RequireAdmin from "@/components/admin/RequireAdmin";

// Lightweight pages - static imports
import AboutUsPage from "@/views/AboutUs";
import AuthPage from "@/views/Auth";
import DesignToolsPage from "@/views/DesignTools";
import GalleryPage from "@/views/Gallery";
import GetQuotePage from "@/views/GetQuote";
import LifeStagesPage from "@/views/LifeStages";
import NotFoundPage from "@/views/NotFound";
import PrivacyPolicyPage from "@/views/PrivacyPolicy";
import ServicesPage from "@/views/Services";
import TermsConditionsPage from "@/views/TermsConditions";
import WorkPage from "@/views/Work";

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
      <Navigate to="/admin/projects" replace />
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
