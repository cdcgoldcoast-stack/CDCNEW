"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  MessageSquare,
  MessageCircle,
  Images,
  ImagePlus,
  Replace,
  Settings,
  Gift,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";

interface Counts {
  newEnquiries: number;
  newChatLeads: number;
  popupResponses: number;
  publishedProjects: number;
}

const sections = [
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Chat Inquiries", href: "/admin/chat-inquiries", icon: MessageCircle },
  { label: "Pop-up Responses", href: "/admin/popup-responses", icon: Gift },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Site Images", href: "/admin/site-images", icon: ImagePlus },
  { label: "Image Assets", href: "/admin/image-assets", icon: Replace },
  { label: "Users", href: "/admin/users", icon: Users, adminOnly: true },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

const AdminDashboard = () => {
  const { isAuthorized, isCheckingAccess } = useAdminPageAccess();
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState<Counts>({
    newEnquiries: 0,
    newChatLeads: 0,
    popupResponses: 0,
    publishedProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) return;

    const load = async () => {
      const [eq, ci, pr, pj] = await Promise.all([
        supabase.from("enquiries").select("id, status"),
        supabase.from("chat_inquiries").select("id, status"),
        supabase.from("popup_responses").select("id"),
        supabase.from("projects").select("id, is_published"),
      ]);

      setCounts({
        newEnquiries: eq.data?.filter((e) => e.status === "new").length ?? 0,
        newChatLeads: ci.data?.filter((c) => c.status === "new").length ?? 0,
        popupResponses: pr.data?.length ?? 0,
        publishedProjects: pj.data?.filter((p) => p.is_published).length ?? 0,
      });
      setLoading(false);
    };

    load();
  }, [isAuthorized]);

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <p className="text-foreground/60">Loading...</p>
      </AdminLayout>
    );
  }

  const stats = [
    { label: "New enquiries", value: counts.newEnquiries, href: "/admin/enquiries" },
    { label: "New chat leads", value: counts.newChatLeads, href: "/admin/chat-inquiries" },
    { label: "Pop-up responses", value: counts.popupResponses, href: "/admin/popup-responses" },
    { label: "Published projects", value: counts.publishedProjects, href: "/admin/projects" },
  ];

  const visibleSections = sections.filter((s) => !("adminOnly" in s && s.adminOnly) || isAdmin);

  return (
    <AdminLayout>
      <SEO title="Admin - Dashboard" noIndex={true} />

      <div className="mb-8">
        <h1 className="font-serif italic text-3xl text-foreground">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            to={stat.href}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <p className="text-3xl font-serif text-foreground">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-sm text-foreground/60 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Section links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleSections.map((section) => (
          <Link
            key={section.href}
            to={section.href}
            className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-4 hover:border-primary/30 transition-colors"
          >
            <section.icon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium text-foreground">{section.label}</span>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
