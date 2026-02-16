"use client";

import { Navigate } from "react-router-dom";
import AboutUsPage from "@/pages/AboutUs";
import AuthPage from "@/pages/Auth";
import AIDesignGeneratorPage from "@/pages/AIDesignGenerator";
import AIDesignIntroPage from "@/pages/AIDesignIntro";
import BrandGuidelinesPage from "@/pages/BrandGuidelines";
import DesignToolsPage from "@/pages/DesignTools";
import GalleryPage from "@/pages/Gallery";
import GetQuotePage from "@/pages/GetQuote";
import LifeStagesPage from "@/pages/LifeStages";
import MoodboardCreatorPage from "@/pages/MoodboardCreator";
import NotFoundPage from "@/pages/NotFound";
import PrintBrochurePage from "@/pages/PrintBrochure";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import ProjectDetailPage from "@/pages/ProjectDetail";
import ServicesPage from "@/pages/Services";
import TermsConditionsPage from "@/pages/TermsConditions";
import WorkPage from "@/pages/Work";
import RequireAdmin from "@/components/admin/RequireAdmin";
import AdminChatInquiriesPage from "@/pages/admin/AdminChatInquiries";
import AdminEnquiriesPage from "@/pages/admin/AdminEnquiries";
import AdminGalleryPage from "@/pages/admin/AdminGallery";
import AdminImageAssetsPage from "@/pages/admin/AdminImageAssets";
import AdminProjectsPage from "@/pages/admin/AdminProjects";
import AdminSettingsPage from "@/pages/admin/AdminSettings";
import AdminSiteImagesPage from "@/pages/admin/AdminSiteImages";

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

export function ProjectDetailClient() {
  return <ProjectDetailPage />;
}

export function NotFoundClient() {
  return <NotFoundPage />;
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

export function PrintBrochureClient() {
  return (
    <RequireAdmin>
      <PrintBrochurePage />
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
