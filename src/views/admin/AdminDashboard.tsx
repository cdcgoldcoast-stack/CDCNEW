"use client";

import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Clock3,
  FilePenLine,
  FolderOpen,
  ImagePlus,
  Images,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Phone,
  RefreshCw,
  Replace,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EnquiryRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  suburb: string | null;
  status: string | null;
  created_at: string;
}

interface ChatInquiryRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  status: string;
  created_at: string;
  conversation_summary: string | null;
}

interface PopupResponseRecord {
  id: string;
  name: string;
  phone: string;
  source: string;
  page_url: string | null;
  created_at: string;
}

interface ProjectRecord {
  id: string;
  name: string;
  is_published: boolean;
  overview: string | null;
  challenge: string | null;
  solution: string | null;
  updated_at: string;
}

interface ProjectImageRecord {
  project_id: string;
}

interface GalleryItemRecord {
  id: string;
  type: "image" | "text";
  is_active: boolean;
}

interface ImageOverrideRecord {
  id: string;
  updated_at: string;
}

interface NotificationSettingsRecord {
  notification_emails: string[] | null;
}

interface DashboardData {
  enquiries: EnquiryRecord[];
  chatInquiries: ChatInquiryRecord[];
  popupResponses: PopupResponseRecord[];
  projects: ProjectRecord[];
  projectImages: ProjectImageRecord[];
  galleryItems: GalleryItemRecord[];
  imageOverrides: ImageOverrideRecord[];
  notificationSettings: NotificationSettingsRecord | null;
  siteImagesCount: number;
}

interface SourceSummary {
  label: string;
  total: number;
  recent: number;
  previous: number;
  href: string;
}

interface ActionLeadItem {
  id: string;
  name: string;
  sourceLabel: string;
  status: string;
  created_at: string;
  href: string;
  phone?: string | null;
  email?: string | null;
  context?: string | null;
  stale?: boolean;
}

interface ProjectReadinessItem {
  id: string;
  name: string;
  updated_at: string;
  missing: string[];
  isPublished: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const countRecent = (records: Array<{ created_at: string }>, days: number) =>
  records.filter((record) => Date.now() - new Date(record.created_at).getTime() <= days * DAY_MS).length;

const countPreviousWindow = (records: Array<{ created_at: string }>, days: number) =>
  records.filter((record) => {
    const age = Date.now() - new Date(record.created_at).getTime();
    return age > days * DAY_MS && age <= days * 2 * DAY_MS;
  }).length;

const formatDeltaLabel = (current: number, previous: number) => {
  const delta = current - previous;
  if (delta === 0) return "Flat vs previous period";
  return `${delta > 0 ? "+" : ""}${delta} vs previous period`;
};

const formatPagePath = (pageUrl: string | null) => {
  if (!pageUrl) return "Landing page unavailable";

  try {
    return new URL(pageUrl).pathname || pageUrl;
  } catch {
    return pageUrl;
  }
};

const getProjectReadiness = (project: ProjectRecord, imageCount: number): ProjectReadinessItem => {
  const missing: string[] = [];

  if (!project.is_published) missing.push("Publish");
  if (!project.overview?.trim()) missing.push("Overview");
  if (!project.challenge?.trim()) missing.push("Challenge");
  if (!project.solution?.trim()) missing.push("Solution");
  if (imageCount === 0) missing.push("Images");

  return {
    id: project.id,
    name: project.name,
    updated_at: project.updated_at,
    missing,
    isPublished: project.is_published,
  };
};

const AdminDashboard = () => {
  const { isAuthorized, isCheckingAccess } = useAdminPageAccess();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    enquiries: [],
    chatInquiries: [],
    popupResponses: [],
    projects: [],
    projectImages: [],
    galleryItems: [],
    imageOverrides: [],
    notificationSettings: null,
    siteImagesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isAuthorized) return;

    const loadDashboard = async () => {
      if (refreshKey === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        const [
          enquiriesRes,
          chatRes,
          popupRes,
          projectsRes,
          projectImagesRes,
          galleryItemsRes,
          overridesRes,
          notificationSettingsRes,
          siteImagesRes,
        ] = await Promise.all([
          supabase
            .from("enquiries")
            .select("id, full_name, email, phone, suburb, status, created_at")
            .order("created_at", { ascending: false }),
          supabase
            .from("chat_inquiries")
            .select("id, name, email, phone, status, created_at, conversation_summary")
            .order("created_at", { ascending: false }),
          supabase
            .from("popup_responses")
            .select("id, name, phone, source, page_url, created_at")
            .order("created_at", { ascending: false }),
          supabase
            .from("projects")
            .select("id, name, is_published, overview, challenge, solution, updated_at")
            .order("updated_at", { ascending: false }),
          supabase.from("project_images").select("project_id"),
          supabase.from("gallery_items").select("id, type, is_active"),
          supabase.from("image_overrides").select("id, updated_at"),
          supabase.from("notification_settings").select("notification_emails").limit(1).maybeSingle(),
          supabase.storage
            .from("gallery-images")
            .list("", {
              limit: 500,
              sortBy: { column: "created_at", order: "desc" },
            }),
        ]);

        if (enquiriesRes.error) throw enquiriesRes.error;
        if (chatRes.error) throw chatRes.error;
        if (popupRes.error) throw popupRes.error;
        if (projectsRes.error) throw projectsRes.error;
        if (projectImagesRes.error) throw projectImagesRes.error;
        if (galleryItemsRes.error) throw galleryItemsRes.error;
        if (overridesRes.error) throw overridesRes.error;
        if (notificationSettingsRes.error) throw notificationSettingsRes.error;
        if (siteImagesRes.error) throw siteImagesRes.error;

        const siteImagesCount =
          siteImagesRes.data?.filter((file) => file.name && !file.name.endsWith("/") && file.metadata).length ?? 0;

        setDashboardData({
          enquiries: (enquiriesRes.data as EnquiryRecord[] | null) ?? [],
          chatInquiries: (chatRes.data as ChatInquiryRecord[] | null) ?? [],
          popupResponses: (popupRes.data as PopupResponseRecord[] | null) ?? [],
          projects: (projectsRes.data as ProjectRecord[] | null) ?? [],
          projectImages: (projectImagesRes.data as ProjectImageRecord[] | null) ?? [],
          galleryItems: (galleryItemsRes.data as GalleryItemRecord[] | null) ?? [],
          imageOverrides: (overridesRes.data as ImageOverrideRecord[] | null) ?? [],
          notificationSettings:
            (notificationSettingsRes.data as NotificationSettingsRecord | null) ?? null,
          siteImagesCount,
        });
        setLastUpdatedAt(new Date());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard overview");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadDashboard();
  }, [isAuthorized, refreshKey]);

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <p className="text-foreground/60">Loading...</p>
      </AdminLayout>
    );
  }

  const { enquiries, chatInquiries, popupResponses, projects, projectImages, galleryItems, imageOverrides } =
    dashboardData;

  const sourceSummaries: SourceSummary[] = [
    {
      label: "Website enquiries",
      total: enquiries.length,
      recent: countRecent(enquiries, 7),
      previous: countPreviousWindow(enquiries, 7),
      href: "/admin/enquiries",
    },
    {
      label: "AI chat leads",
      total: chatInquiries.length,
      recent: countRecent(chatInquiries, 7),
      previous: countPreviousWindow(chatInquiries, 7),
      href: "/admin/chat-inquiries",
    },
    {
      label: "Pop-up captures",
      total: popupResponses.length,
      recent: countRecent(popupResponses, 7),
      previous: countPreviousWindow(popupResponses, 7),
      href: "/admin/popup-responses",
    },
  ];

  const recentLeads7Days = sourceSummaries.reduce((sum, source) => sum + source.recent, 0);
  const previousLeads7Days = sourceSummaries.reduce((sum, source) => sum + source.previous, 0);

  const freshEnquiries = enquiries.filter((record) => record.status === "new");
  const freshChatInquiries = chatInquiries.filter((record) => record.status === "new");
  const freshPopupResponses = popupResponses.filter((record) => Date.now() - new Date(record.created_at).getTime() <= 7 * DAY_MS);
  const needsAttentionCount = freshEnquiries.length + freshChatInquiries.length + freshPopupResponses.length;
  const staleLeadCount =
    freshEnquiries.filter((record) => Date.now() - new Date(record.created_at).getTime() > 3 * DAY_MS).length +
    freshChatInquiries.filter((record) => Date.now() - new Date(record.created_at).getTime() > 3 * DAY_MS).length;

  const projectImageCounts = projectImages.reduce<Record<string, number>>((accumulator, image) => {
    accumulator[image.project_id] = (accumulator[image.project_id] ?? 0) + 1;
    return accumulator;
  }, {});

  const projectReadiness = projects.map((project) => getProjectReadiness(project, projectImageCounts[project.id] ?? 0));
  const projectsNeedingWork = projectReadiness.filter((project) => project.missing.length > 0);
  const publishedProjects = projectReadiness.filter((project) => project.isPublished).length;
  const readyProjects = projectReadiness.filter((project) => project.missing.length === 0).length;

  const activeGalleryItems = galleryItems.filter((item) => item.is_active).length;
  const galleryTextBlocks = galleryItems.filter((item) => item.type === "text").length;
  const notificationRecipients = dashboardData.notificationSettings?.notification_emails?.length ?? 0;

  const actionQueue: ActionLeadItem[] = [
    ...freshEnquiries.map((record) => ({
      id: record.id,
      name: record.full_name,
      sourceLabel: "Website enquiry",
      status: record.status || "new",
      created_at: record.created_at,
      href: "/admin/enquiries",
      phone: record.phone,
      email: record.email,
      context: record.suburb ? `${record.suburb} lead` : "Website form lead",
      stale: Date.now() - new Date(record.created_at).getTime() > 3 * DAY_MS,
    })),
    ...freshChatInquiries.map((record) => ({
      id: record.id,
      name: record.name,
      sourceLabel: "AI chat",
      status: record.status,
      created_at: record.created_at,
      href: "/admin/chat-inquiries",
      phone: record.phone,
      email: record.email,
      context: record.conversation_summary || "Chat follow-up",
      stale: Date.now() - new Date(record.created_at).getTime() > 3 * DAY_MS,
    })),
    ...freshPopupResponses.map((record) => ({
      id: record.id,
      name: record.name,
      sourceLabel: "Promo pop-up",
      status: "new capture",
      created_at: record.created_at,
      href: "/admin/popup-responses",
      phone: record.phone,
      email: null,
      context: formatPagePath(record.page_url),
      stale: false,
    })),
  ]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 8);

  const topPopupPages = Array.from(
    popupResponses.reduce<Map<string, number>>((accumulator, response) => {
      const pageKey = formatPagePath(response.page_url);
      accumulator.set(pageKey, (accumulator.get(pageKey) ?? 0) + 1);
      return accumulator;
    }, new Map<string, number>()),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);

  const quickLinks = [
    { label: "Manage Projects", href: "/admin/projects", desc: "Publish projects and refine content", icon: FolderOpen },
    { label: "Enquiries", href: "/admin/enquiries", desc: "Review quote requests from the website", icon: MessageSquare },
    { label: "Chat Inquiries", href: "/admin/chat-inquiries", desc: "Follow up AI chat leads", icon: MessageCircle },
    { label: "Pop-up Responses", href: "/admin/popup-responses", desc: "Export and review capture forms", icon: Users },
    { label: "Gallery", href: "/admin/gallery", desc: "Curate the gallery layout and text blocks", icon: Images },
    { label: "Site Images", href: "/admin/site-images", desc: "Upload campaign-ready imagery", icon: ImagePlus },
    { label: "Image Assets", href: "/admin/image-assets", desc: "Swap live assets without code changes", icon: Replace },
    { label: "Settings", href: "/admin/settings", desc: "Manage notification recipients and sender details", icon: Bell },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
              <Megaphone className="h-3.5 w-3.5" />
              Marketer Overview
            </div>
            <div>
              <h1 className="font-serif italic text-3xl text-primary">Dashboard</h1>
              <p className="max-w-2xl text-foreground/60">
                Lead capture, content readiness, and media controls in one place so a marketer can see what needs attention now.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {lastUpdatedAt ? (
              <span className="text-xs text-foreground/50">
                Updated {formatDistanceToNow(lastUpdatedAt, { addSuffix: true })}
              </span>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey((current) => current + 1)}
              disabled={loading || refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-36 rounded-2xl border border-border bg-card" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="h-80 rounded-2xl border border-border bg-card" />
              <div className="h-80 rounded-2xl border border-border bg-card" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-foreground/50">Last 7 days</span>
                </div>
                <p className="text-3xl font-serif text-foreground">{recentLeads7Days}</p>
                <p className="mt-1 text-sm text-foreground/60">Leads captured</p>
                <p className="mt-3 text-xs text-foreground/50">
                  {formatDeltaLabel(recentLeads7Days, previousLeads7Days)}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  {staleLeadCount > 0 ? <Badge variant="secondary">{staleLeadCount} stale</Badge> : null}
                </div>
                <p className="text-3xl font-serif text-foreground">{needsAttentionCount}</p>
                <p className="mt-1 text-sm text-foreground/60">Items needing follow-up</p>
                <p className="mt-3 text-xs text-foreground/50">
                  New website, chat, and pop-up captures waiting for review
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <FilePenLine className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{readyProjects} ready</Badge>
                </div>
                <p className="text-3xl font-serif text-foreground">{projectsNeedingWork.length}</p>
                <p className="mt-1 text-sm text-foreground/60">Projects to polish</p>
                <p className="mt-3 text-xs text-foreground/50">
                  {publishedProjects} published across {projects.length} total projects
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <Images className="h-5 w-5" />
                  </div>
                  {notificationRecipients === 0 ? (
                    <Badge variant="destructive">No alerts</Badge>
                  ) : (
                    <Badge variant="secondary">{notificationRecipients} recipients</Badge>
                  )}
                </div>
                <p className="text-3xl font-serif text-foreground">{dashboardData.siteImagesCount}</p>
                <p className="mt-1 text-sm text-foreground/60">Site images in library</p>
                <p className="mt-3 text-xs text-foreground/50">
                  {imageOverrides.length} live overrides, {activeGalleryItems} active gallery items
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-foreground">Lead queue</h2>
                    <p className="text-sm text-foreground/60">
                      Fresh leads that a marketer or coordinator can pick up immediately.
                    </p>
                  </div>
                  <Link to="/admin/enquiries" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>

                {actionQueue.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-foreground/50">
                    No fresh leads are waiting right now.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actionQueue.map((item) => (
                      <div
                        key={`${item.sourceLabel}-${item.id}`}
                        className="rounded-xl border border-border px-4 py-4 transition-colors hover:border-primary/25"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-foreground">{item.name}</p>
                              <Badge variant="secondary">{item.sourceLabel}</Badge>
                              <Badge variant={item.stale ? "destructive" : "outline"}>{item.status}</Badge>
                            </div>
                            <p className="text-sm text-foreground/60">{item.context}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50">
                              <span>{format(new Date(item.created_at), "d MMM, h:mm a")}</span>
                              <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {item.phone ? (
                              <a
                                href={`tel:${item.phone}`}
                                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground/70 transition-colors hover:bg-muted"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                Call
                              </a>
                            ) : null}
                            {item.email ? (
                              <a
                                href={`mailto:${item.email}`}
                                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground/70 transition-colors hover:bg-muted"
                              >
                                <Mail className="h-3.5 w-3.5" />
                                Email
                              </a>
                            ) : null}
                            <Link
                              to={item.href}
                              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground transition-opacity hover:opacity-90"
                            >
                              Open
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-medium text-foreground">Source performance</h2>
                    <p className="text-sm text-foreground/60">Lead volume by channel for the last 7 days.</p>
                  </div>
                  <div className="space-y-4">
                    {sourceSummaries.map((source) => (
                      <Link
                        key={source.label}
                        to={source.href}
                        className="block rounded-xl border border-border px-4 py-4 transition-colors hover:border-primary/25"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{source.label}</p>
                            <p className="text-xs text-foreground/50">{source.total} total captured</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-foreground/30" />
                        </div>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-2xl font-serif text-foreground">{source.recent}</p>
                          <p className="text-xs text-foreground/50">{formatDeltaLabel(source.recent, source.previous)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-medium text-foreground">Operational flags</h2>
                    <p className="text-sm text-foreground/60">Quick warnings before they become missed opportunities.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                      <TriangleAlert className={`mt-0.5 h-4 w-4 ${staleLeadCount > 0 ? "text-amber-600" : "text-emerald-600"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">Stale lead follow-up</p>
                        <p className="text-xs text-foreground/60">
                          {staleLeadCount > 0
                            ? `${staleLeadCount} new lead${staleLeadCount === 1 ? "" : "s"} older than 3 days.`
                            : "No stale website or chat leads right now."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                      <Bell className={`mt-0.5 h-4 w-4 ${notificationRecipients === 0 ? "text-amber-600" : "text-emerald-600"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">Notification recipients</p>
                        <p className="text-xs text-foreground/60">
                          {notificationRecipients === 0
                            ? "No notification emails configured in settings."
                            : `${notificationRecipients} recipient${notificationRecipients === 1 ? "" : "s"} configured for alerts.`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                      <Sparkles className={`mt-0.5 h-4 w-4 ${projectsNeedingWork.length > 0 ? "text-amber-600" : "text-emerald-600"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">Project publishing readiness</p>
                        <p className="text-xs text-foreground/60">
                          {projectsNeedingWork.length > 0
                            ? `${projectsNeedingWork.length} project${projectsNeedingWork.length === 1 ? "" : "s"} still missing publish-critical content.`
                            : "All projects are publish-ready."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-foreground">Top pop-up pages</h2>
                    <p className="text-sm text-foreground/60">Which pages are capturing the most promo responses.</p>
                  </div>
                  <Link to="/admin/popup-responses" className="text-sm text-primary hover:underline">
                    Open captures
                  </Link>
                </div>

                {topPopupPages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-foreground/50">
                    No pop-up responses recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topPopupPages.map(([page, count]) => (
                      <div key={page} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{page}</p>
                          <p className="text-xs text-foreground/50">Promo pop-up source page</p>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-foreground">Projects to polish</h2>
                    <p className="text-sm text-foreground/60">Drafts or incomplete case studies that need marketer attention.</p>
                  </div>
                  <Link to="/admin/projects" className="text-sm text-primary hover:underline">
                    Manage projects
                  </Link>
                </div>

                {projectsNeedingWork.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-foreground/50">
                    Every project has publish-ready content and imagery.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projectsNeedingWork.slice(0, 6).map((project) => (
                      <div key={project.id} className="rounded-xl border border-border px-4 py-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-foreground">{project.name}</p>
                              <Badge variant={project.isPublished ? "secondary" : "outline"}>
                                {project.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.missing.map((item) => (
                                <Badge key={item} variant="outline">
                                  Missing {item}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-foreground/50">
                              Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Link
                            to="/admin/projects"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Edit
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-foreground">Media health</h2>
                  <p className="text-sm text-foreground/60">Library and override status for campaigns and case studies.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">Gallery items</p>
                    <p className="mt-2 text-2xl font-serif text-foreground">{galleryItems.length}</p>
                    <p className="mt-1 text-xs text-foreground/50">{activeGalleryItems} active</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">Text blocks</p>
                    <p className="mt-2 text-2xl font-serif text-foreground">{galleryTextBlocks}</p>
                    <p className="mt-1 text-xs text-foreground/50">Editorial overlays</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">Site images</p>
                    <p className="mt-2 text-2xl font-serif text-foreground">{dashboardData.siteImagesCount}</p>
                    <p className="mt-1 text-xs text-foreground/50">Storage library</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">Overrides</p>
                    <p className="mt-2 text-2xl font-serif text-foreground">{imageOverrides.length}</p>
                    <p className="mt-1 text-xs text-foreground/50">Live replacements</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-foreground">Control center</h2>
                  <p className="text-sm text-foreground/60">Shortcuts a marketer will actually use during day-to-day site operations.</p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-4 transition-colors hover:border-primary/25 hover:bg-muted/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/8 p-2 text-primary">
                          <link.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{link.label}</p>
                          <p className="text-xs text-foreground/50">{link.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-foreground/30 transition-colors group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
