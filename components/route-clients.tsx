"use client";

import { Navigate } from "react-router-dom";
import AboutUsPage from "@/views/AboutUs";
import AuthPage from "@/views/Auth";
import AIDesignGeneratorPage from "@/views/AIDesignGenerator";
import AIDesignIntroPage from "@/views/AIDesignIntro";
import BrandGuidelinesPage from "@/views/BrandGuidelines";
import DesignToolsPage from "@/views/DesignTools";
import GalleryPage from "@/views/Gallery";
import GetQuotePage from "@/views/GetQuote";
import LifeStagesPage from "@/views/LifeStages";
import MoodboardCreatorPage from "@/views/MoodboardCreator";
import NotFoundPage from "@/views/NotFound";
import PrivacyPolicyPage from "@/views/PrivacyPolicy";
import ProjectDetailPage, { type ProjectDetailProps } from "@/views/ProjectDetail";
import ServicesPage from "@/views/Services";
import TermsConditionsPage from "@/views/TermsConditions";
import WorkPage from "@/views/Work";
import RequireAdmin from "@/components/admin/RequireAdmin";
import AdminChatInquiriesPage from "@/views/admin/AdminChatInquiries";
import AdminEnquiriesPage from "@/views/admin/AdminEnquiries";
import AdminGalleryPage from "@/views/admin/AdminGallery";
import AdminImageAssetsPage from "@/views/admin/AdminImageAssets";
import AdminProjectsPage from "@/views/admin/AdminProjects";
import AdminSettingsPage from "@/views/admin/AdminSettings";
import AdminSiteImagesPage from "@/views/admin/AdminSiteImages";

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
