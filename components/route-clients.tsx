"use client";

import dynamic from "next/dynamic";
import type { ProjectDetailProps } from "@/views/ProjectDetail";
import type { Project } from "@/data/projects";
import type { GalleryItemRow } from "@/data/gallery";

const pageLoader = () => <div className="min-h-screen bg-background animate-pulse" />;

// All pages use dynamic imports for proper code-splitting.
// Previously 16 pages were statically imported, pulling framer-motion, Header,
// Footer, Supabase client, and other heavy deps into a single shared chunk.
const AboutUsPage = dynamic(() => import("@/views/AboutUs"), {
  loading: pageLoader,
});
const AuthPage = dynamic(() => import("@/views/Auth"), {
  loading: pageLoader,
});
const BeforeAfterPage = dynamic(() => import("@/views/BeforeAfter"), {
  loading: pageLoader,
});
const DesignToolsPage = dynamic(() => import("@/views/DesignTools"), {
  loading: pageLoader,
});
const FAQPage = dynamic(() => import("@/views/FAQ"), {
  loading: pageLoader,
});
const GalleryPage = dynamic(() => import("@/views/Gallery"), {
  loading: pageLoader,
});
const GetQuotePage = dynamic(() => import("@/views/GetQuote"), {
  loading: pageLoader,
});
const HowWeWorkPage = dynamic(() => import("@/views/HowWeWork"), {
  loading: pageLoader,
});
const LifeStagesPage = dynamic(() => import("@/views/LifeStages"), {
  loading: pageLoader,
});
const NotFoundPage = dynamic(() => import("@/views/NotFound"), {
  loading: pageLoader,
});
const PrivacyPolicyPage = dynamic(() => import("@/views/PrivacyPolicy"), {
  loading: pageLoader,
});
const ReferralProgramPage = dynamic(() => import("@/views/ReferralProgram"), {
  loading: pageLoader,
});
const ServicesPage = dynamic(() => import("@/views/Services"), {
  loading: pageLoader,
});
const TermsConditionsPage = dynamic(() => import("@/views/TermsConditions"), {
  loading: pageLoader,
});
const TestimonialsPage = dynamic(() => import("@/views/Testimonials"), {
  loading: pageLoader,
});
const WhyCDCPage = dynamic(() => import("@/views/WhyCDC"), {
  loading: pageLoader,
});
const WorkPage = dynamic(() => import("@/views/Work"), {
  loading: pageLoader,
});

const RequireAdmin = dynamic(() => import("@/components/admin/RequireAdmin"), {
  loading: pageLoader,
});

// Service pages
const KitchenRenovationsPage = dynamic(() => import("@/views/KitchenRenovations"), {
  loading: pageLoader,
});
const BathroomRenovationsPage = dynamic(() => import("@/views/BathroomRenovations"), {
  loading: pageLoader,
});
const WholeHomeRenovationsPage = dynamic(() => import("@/views/WholeHomeRenovations"), {
  loading: pageLoader,
});
const LaundryRenovationsPage = dynamic(() => import("@/views/LaundryRenovations"), {
  loading: pageLoader,
});
const OutdoorRenovationsPage = dynamic(() => import("@/views/OutdoorRenovations"), {
  loading: pageLoader,
});
const ApartmentRenovationsPage = dynamic(() => import("@/views/ApartmentRenovations"), {
  loading: pageLoader,
});
const HomeExtensionsPage = dynamic(() => import("@/views/HomeExtensions"), {
  loading: pageLoader,
});

// Location pages
const BroadbeachRenovationsPage = dynamic(() => import("@/views/BroadbeachRenovations"), {
  loading: pageLoader,
});
const MermaidBeachRenovationsPage = dynamic(() => import("@/views/MermaidBeachRenovations"), {
  loading: pageLoader,
});
const PalmBeachRenovationsPage = dynamic(() => import("@/views/PalmBeachRenovations"), {
  loading: pageLoader,
});
const RobinaRenovationsPage = dynamic(() => import("@/views/RobinaRenovations"), {
  loading: pageLoader,
});
const SouthportRenovationsPage = dynamic(() => import("@/views/SouthportRenovations"), {
  loading: pageLoader,
});
const MiamiRenovationsPage = dynamic(() => import("@/views/MiamiRenovations"), {
  loading: pageLoader,
});
const HopeIslandRenovationsPage = dynamic(() => import("@/views/HopeIslandRenovations"), {
  loading: pageLoader,
});
const SanctuaryCoveRenovationsPage = dynamic(() => import("@/views/SanctuaryCoveRenovations"), {
  loading: pageLoader,
});
const HelensvaleRenovationsPage = dynamic(() => import("@/views/HelensvaleRenovations"), {
  loading: pageLoader,
});
const NerangRenovationsPage = dynamic(() => import("@/views/NerangRenovations"), {
  loading: pageLoader,
});
const MudgeerabaRenovationsPage = dynamic(() => import("@/views/MudgeerabaRenovations"), {
  loading: pageLoader,
});
const VarsityLakesRenovationsPage = dynamic(() => import("@/views/VarsityLakesRenovations"), {
  loading: pageLoader,
});
const CoolangattaRenovationsPage = dynamic(() => import("@/views/CoolangattaRenovations"), {
  loading: pageLoader,
});
const CurrumbinRenovationsPage = dynamic(() => import("@/views/CurrumbinRenovations"), {
  loading: pageLoader,
});
const SurfersParadiseRenovationsPage = dynamic(() => import("@/views/SurfersParadiseRenovations"), {
  loading: pageLoader,
});
const BundallRenovationsPage = dynamic(() => import("@/views/BundallRenovations"), {
  loading: pageLoader,
});
const RunawayBayRenovationsPage = dynamic(() => import("@/views/RunawayBayRenovations"), {
  loading: pageLoader,
});
const CoomeraRenovationsPage = dynamic(() => import("@/views/CoomeraRenovations"), {
  loading: pageLoader,
});
const UpperCoomeraRenovationsPage = dynamic(() => import("@/views/UpperCoomeraRenovations"), {
  loading: pageLoader,
});

// Heavy/interactive pages - client-only (ssr: false)
const AIDesignGeneratorPage = dynamic(() => import("@/views/AIDesignGenerator"), {
  loading: pageLoader,
});
const AIDesignIntroPage = dynamic(() => import("@/views/AIDesignIntro"), {
  loading: pageLoader,
});
const MoodboardCreatorPage = dynamic(() => import("@/views/MoodboardCreator"), {
  loading: pageLoader,
  ssr: false,
});
const ProjectDetailPage = dynamic(() => import("@/views/ProjectDetail"), {
  loading: pageLoader,
});
const BrandGuidelinesPage = dynamic(() => import("@/views/BrandGuidelines"), {
  ssr: false,
});

// Admin pages
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
const AdminUsersPage = dynamic(() => import("@/views/admin/AdminUsers"), {
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

export function RenovationProjectsClient({ initialProjects }: { initialProjects?: Project[] } = {}) {
  return <WorkPage initialProjects={initialProjects} />;
}

export function ProjectGalleryClient({ initialItems }: { initialItems?: GalleryItemRow[] } = {}) {
  return <GalleryPage initialItems={initialItems} />;
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
  // Navigate is from the compat shim (lightweight); lazy-load it to avoid
  // pulling it into the shared chunk.
  const LazyNavigate = dynamic(
    () => import("react-router-dom").then((m) => ({ default: m.Navigate })),
    { ssr: false },
  );
  return (
    <RequireAdmin>
      <LazyNavigate to="/admin/dashboard" replace />
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

export function AdminUsersClient() {
  return (
    <RequireAdmin allowedRoles={["admin"]}>
      <AdminUsersPage />
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

export function LaundryRenovationsClient() {
  return <LaundryRenovationsPage />;
}

export function OutdoorRenovationsClient() {
  return <OutdoorRenovationsPage />;
}

export function ApartmentRenovationsClient() {
  return <ApartmentRenovationsPage />;
}

export function HomeExtensionsClient() {
  return <HomeExtensionsPage />;
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

export function MiamiRenovationsClient() {
  return <MiamiRenovationsPage />;
}

export function HopeIslandRenovationsClient() {
  return <HopeIslandRenovationsPage />;
}

export function SanctuaryCoveRenovationsClient() {
  return <SanctuaryCoveRenovationsPage />;
}

export function HelensvaleRenovationsClient() {
  return <HelensvaleRenovationsPage />;
}

export function NerangRenovationsClient() {
  return <NerangRenovationsPage />;
}

export function MudgeerabaRenovationsClient() {
  return <MudgeerabaRenovationsPage />;
}

export function VarsityLakesRenovationsClient() {
  return <VarsityLakesRenovationsPage />;
}

export function CoolangattaRenovationsClient() {
  return <CoolangattaRenovationsPage />;
}

export function CurrumbinRenovationsClient() {
  return <CurrumbinRenovationsPage />;
}

export function SurfersParadiseRenovationsClient() {
  return <SurfersParadiseRenovationsPage />;
}

export function BundallRenovationsClient() {
  return <BundallRenovationsPage />;
}

export function RunawayBayRenovationsClient() {
  return <RunawayBayRenovationsPage />;
}

export function CoomeraRenovationsClient() {
  return <CoomeraRenovationsPage />;
}

export function UpperCoomeraRenovationsClient() {
  return <UpperCoomeraRenovationsPage />;
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
