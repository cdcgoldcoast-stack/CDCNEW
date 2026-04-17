import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Eye,
  Trash2,
  Download,
  Search,
  Phone,
  Mail,
  MessageCircle,
  MessageSquare,
  Gift,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SEO from "@/components/SEO";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type LeadSource = "enquiry" | "chat" | "popup";

type ChatMessage = {
  role?: string;
  content?: string;
  [key: string]: unknown;
};

interface UnifiedLead {
  id: string;
  source: LeadSource;
  name: string;
  email: string | null;
  phone: string;
  status: string;
  notes: string | null;
  created_at: string;
  // Source-specific details (all optional)
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  renovations?: string[] | null;
  budget?: string | null;
  timeline?: string | null;
  conversation_summary?: string | null;
  conversation_history?: ChatMessage[] | null;
  additional_notes?: string | null;
  page_url?: string | null;
  popup_source?: string | null;
}

interface EnquiryRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  renovations: string[] | null;
  budget: string | null;
  timeline: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

interface ChatRow {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  additional_notes: string | null;
  conversation_summary: string | null;
  conversation_history: ChatMessage[] | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

interface PopupRow {
  id: string;
  name: string;
  phone: string;
  source: string | null;
  page_url: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

// Unified status pipeline — we display chat's "converted" as "qualified" since
// they mean the same thing in this context. The underlying DB value is kept
// as-is so existing data doesn't need migration.
const UNIFIED_STATUSES = ["new", "contacted", "qualified", "closed"] as const;

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  converted: "bg-green-100 text-green-800", // legacy chat status
  closed: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Qualified",
  closed: "Closed",
};

const sourceLabels: Record<LeadSource, string> = {
  enquiry: "Form",
  chat: "Chat",
  popup: "Popup",
};

const sourceColors: Record<LeadSource, string> = {
  enquiry: "bg-primary/10 text-primary",
  chat: "bg-purple-100 text-purple-800",
  popup: "bg-amber-100 text-amber-800",
};

const SourceIcon = ({ source }: { source: LeadSource }) => {
  if (source === "enquiry") return <MessageSquare className="w-3 h-3" />;
  if (source === "chat") return <MessageCircle className="w-3 h-3" />;
  return <Gift className="w-3 h-3" />;
};

const budgetLabels: Record<string, string> = {
  "5-20": "$5k – $20k",
  "20-40": "$20k – $40k",
  "40-80": "$40k – $80k",
  "80+": "$80k+",
  unsure: "Unsure",
  flexible: "Flexible",
};

const timelineLabels: Record<string, string> = {
  immediately: "Ready to start",
  "30-days": "In the next 30 days",
  "90-days": "Within 90 days",
  exploring: "Just exploring",
};

const renovationLabels: Record<string, string> = {
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  "full-house": "Full House Living",
  other: "Other Parts of the House",
};

/* -------------------------------------------------------------------------- */
/*  Row mappers                                                               */
/* -------------------------------------------------------------------------- */

const mapEnquiry = (row: EnquiryRow): UnifiedLead => ({
  id: row.id,
  source: "enquiry",
  name: row.full_name,
  email: row.email,
  phone: row.phone,
  status: row.status || "new",
  notes: row.notes,
  created_at: row.created_at,
  suburb: row.suburb,
  state: row.state,
  postcode: row.postcode,
  renovations: row.renovations,
  budget: row.budget,
  timeline: row.timeline,
});

const mapChat = (row: ChatRow): UnifiedLead => ({
  id: row.id,
  source: "chat",
  name: row.name,
  email: row.email,
  phone: row.phone,
  status: row.status || "new",
  notes: row.notes,
  created_at: row.created_at,
  conversation_summary: row.conversation_summary,
  conversation_history: row.conversation_history,
  additional_notes: row.additional_notes,
});

const mapPopup = (row: PopupRow): UnifiedLead => ({
  id: row.id,
  source: "popup",
  name: row.name,
  email: null,
  phone: row.phone,
  status: row.status || "new",
  notes: row.notes,
  created_at: row.created_at,
  popup_source: row.source,
  page_url: row.page_url,
});

const tableForSource = (source: LeadSource) => {
  if (source === "enquiry") return "enquiries";
  if (source === "chat") return "chat_inquiries";
  return "popup_responses";
};

const escapeCsv = (value: string | null | undefined): string => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes("\"")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const AdminLeads = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess();

  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<UnifiedLead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<UnifiedLead | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (isAuthorized && user) {
      fetchLeads();
    }
  }, [isAuthorized, user]);

  useEffect(() => {
    if (selectedLead) {
      setNotesDraft(selectedLead.notes ?? "");
    }
  }, [selectedLead]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const [enquiriesResult, chatResult, popupResult] = await Promise.all([
        supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("chat_inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("popup_responses").select("*").order("created_at", { ascending: false }),
      ]);

      if (enquiriesResult.error) throw enquiriesResult.error;
      if (chatResult.error) throw chatResult.error;
      if (popupResult.error) throw popupResult.error;

      // Cast via unknown because the generated Supabase types don't yet include
      // the `notes` column added in migration 20260417120000.
      const unified: UnifiedLead[] = [
        ...(enquiriesResult.data ?? []).map((row) => mapEnquiry(row as unknown as EnquiryRow)),
        ...(chatResult.data ?? []).map((row) => mapChat(row as unknown as ChatRow)),
        ...(popupResult.data ?? []).map((row) => mapPopup(row as unknown as PopupRow)),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setLeads(unified);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (lead: UnifiedLead, status: string) => {
    try {
      const { error } = await supabase
        .from(tableForSource(lead.source))
        .update({ status })
        .eq("id", lead.id);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id && l.source === lead.source ? { ...l, status } : l))
      );
      if (selectedLead?.id === lead.id && selectedLead.source === lead.source) {
        setSelectedLead({ ...selectedLead, status });
      }
      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from(tableForSource(selectedLead.source))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ notes: notesDraft } as any)
        .eq("id", selectedLead.id);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLead.id && l.source === selectedLead.source ? { ...l, notes: notesDraft } : l
        )
      );
      setSelectedLead({ ...selectedLead, notes: notesDraft });
      toast.success("Notes saved");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const deleteLead = async () => {
    if (!leadToDelete) return;
    try {
      const { error } = await supabase
        .from(tableForSource(leadToDelete.source))
        .delete()
        .eq("id", leadToDelete.id);

      if (error) throw error;

      setLeads((prev) => prev.filter((l) => !(l.id === leadToDelete.id && l.source === leadToDelete.source)));
      toast.success("Lead deleted");
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;

      if (statusFilter !== "all") {
        // Normalize converted -> qualified for filtering
        const normalized = lead.status === "converted" ? "qualified" : lead.status;
        if (normalized !== statusFilter) return false;
      }

      if (searchTerm) {
        const haystack = [
          lead.name,
          lead.email ?? "",
          lead.phone,
          lead.suburb ?? "",
          lead.conversation_summary ?? "",
          lead.page_url ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchTerm.toLowerCase())) return false;
      }

      return true;
    });
  }, [leads, sourceFilter, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const byStatus = (status: string) =>
      leads.filter((l) => (l.status === "converted" ? "qualified" : l.status) === status).length;
    return {
      total: leads.length,
      new: byStatus("new"),
      contacted: byStatus("contacted"),
      qualified: byStatus("qualified"),
    };
  }, [leads]);

  const exportCsv = () => {
    const headers = [
      "Source",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Suburb",
      "Budget",
      "Timeline",
      "Page URL",
      "Summary",
      "Notes",
      "Created",
    ];
    const rows = filteredLeads.map((lead) => [
      sourceLabels[lead.source],
      escapeCsv(lead.name),
      escapeCsv(lead.email),
      escapeCsv(lead.phone),
      escapeCsv(statusLabels[lead.status] ?? lead.status),
      escapeCsv(lead.suburb),
      escapeCsv(lead.budget),
      escapeCsv(lead.timeline),
      escapeCsv(lead.page_url),
      escapeCsv(lead.conversation_summary),
      escapeCsv(lead.notes),
      escapeCsv(format(new Date(lead.created_at), "yyyy-MM-dd HH:mm")),
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <div className="text-foreground/60">Checking access…</div>
      </AdminLayout>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <AdminLayout>
      <SEO title="Leads | Admin" description="Unified lead inbox for CD Construct" url="/admin/leads" />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif italic text-4xl text-primary mb-2">Leads</h1>
          <p className="text-foreground/60">
            Every lead from forms, chat, and popups in one place.
          </p>
        </div>
        <Button onClick={exportCsv} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">Total</p>
          <p className="text-2xl font-serif text-primary">{stats.total}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">New</p>
          <p className="text-2xl font-serif text-blue-700">{stats.new}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">Contacted</p>
          <p className="text-2xl font-serif text-yellow-700">{stats.contacted}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">Qualified</p>
          <p className="text-2xl font-serif text-green-700">{stats.qualified}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search name, email, phone, suburb…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="enquiry">Form</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
            <SelectItem value="popup">Popup</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {UNIFIED_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-foreground/60 py-12 text-center">Loading leads…</div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-foreground/60 py-12 text-center border border-dashed border-border rounded-lg">
          No leads match the current filters.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Detail</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => {
                  const detail =
                    lead.source === "enquiry"
                      ? [
                          lead.renovations?.length
                            ? lead.renovations.map((r) => renovationLabels[r] ?? r).join(", ")
                            : null,
                          lead.budget ? budgetLabels[lead.budget] ?? lead.budget : null,
                          lead.suburb,
                        ]
                          .filter(Boolean)
                          .join(" · ")
                      : lead.source === "chat"
                        ? lead.conversation_summary ?? "Chat conversation"
                        : lead.page_url ?? "Popup submission";

                  const normalizedStatus = lead.status === "converted" ? "qualified" : lead.status;

                  return (
                    <tr key={`${lead.source}-${lead.id}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Badge className={`${sourceColors[lead.source]} gap-1.5 border-0`}>
                          <SourceIcon source={lead.source} />
                          {sourceLabels[lead.source]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{lead.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5 text-sm">
                          <a href={`tel:${lead.phone}`} className="text-foreground hover:text-primary inline-flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </a>
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-foreground/60 hover:text-primary inline-flex items-center gap-1.5">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm text-foreground/70 truncate">{detail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={normalizedStatus}
                          onValueChange={(value) => updateStatus(lead, value)}
                        >
                          <SelectTrigger className="w-[130px] h-8">
                            <Badge className={`${statusColors[lead.status] ?? "bg-gray-100 text-gray-800"} border-0`}>
                              {statusLabels[lead.status] ?? lead.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {UNIFIED_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {statusLabels[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground/60 whitespace-nowrap">
                        {format(new Date(lead.created_at), "d MMM, HH:mm")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setLeadToDelete(lead)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedLead.name}
                  <Badge className={`${sourceColors[selectedLead.source]} gap-1.5 border-0`}>
                    <SourceIcon source={selectedLead.source} />
                    {sourceLabels[selectedLead.source]}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Phone</p>
                    <a href={`tel:${selectedLead.phone}`} className="text-foreground hover:text-primary inline-flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {selectedLead.phone}
                    </a>
                  </div>
                  {selectedLead.email && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Email</p>
                      <a href={`mailto:${selectedLead.email}`} className="text-foreground hover:text-primary inline-flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {selectedLead.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Enquiry-specific */}
                {selectedLead.source === "enquiry" && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLead.suburb && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Location</p>
                        <p className="text-foreground">
                          {[selectedLead.suburb, selectedLead.state, selectedLead.postcode].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}
                    {selectedLead.budget && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Budget</p>
                        <p className="text-foreground">{budgetLabels[selectedLead.budget] ?? selectedLead.budget}</p>
                      </div>
                    )}
                    {selectedLead.timeline && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Timeline</p>
                        <p className="text-foreground">{timelineLabels[selectedLead.timeline] ?? selectedLead.timeline}</p>
                      </div>
                    )}
                    {selectedLead.renovations?.length ? (
                      <div className="col-span-2">
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Renovations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedLead.renovations.map((r) => (
                            <Badge key={r} variant="secondary">
                              {renovationLabels[r] ?? r}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Chat-specific */}
                {selectedLead.source === "chat" && (
                  <div className="space-y-4">
                    {selectedLead.conversation_summary && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">AI Summary</p>
                        <p className="text-foreground bg-muted p-3 rounded-md text-sm">
                          {selectedLead.conversation_summary}
                        </p>
                      </div>
                    )}
                    {selectedLead.additional_notes && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">User notes</p>
                        <p className="text-foreground text-sm">{selectedLead.additional_notes}</p>
                      </div>
                    )}
                    {selectedLead.conversation_history && selectedLead.conversation_history.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Conversation</p>
                        <div className="bg-muted rounded-md p-3 max-h-64 overflow-y-auto space-y-2 text-sm">
                          {selectedLead.conversation_history.map((msg, idx) => (
                            <div key={idx}>
                              <span className="font-semibold text-foreground/70">{msg.role ?? "user"}: </span>
                              <span className="text-foreground/80">{msg.content ?? ""}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Popup-specific */}
                {selectedLead.source === "popup" && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLead.popup_source && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Popup type</p>
                        <p className="text-foreground">{selectedLead.popup_source}</p>
                      </div>
                    )}
                    {selectedLead.page_url && (
                      <div className="col-span-2">
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Captured on page</p>
                        <a
                          href={selectedLead.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all text-sm"
                        >
                          {selectedLead.page_url}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Status + Notes */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Status</p>
                    <Select
                      value={selectedLead.status === "converted" ? "qualified" : selectedLead.status}
                      onValueChange={(value) => updateStatus(selectedLead, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIFIED_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusLabels[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">
                      Internal notes
                    </p>
                    <Textarea
                      placeholder="Log calls, follow-ups, and context for this lead…"
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      rows={4}
                    />
                    <Button
                      onClick={saveNotes}
                      disabled={savingNotes || notesDraft === (selectedLead.notes ?? "")}
                      className="mt-2 gap-2"
                      size="sm"
                    >
                      <Save className="w-4 h-4" />
                      {savingNotes ? "Saving…" : "Save notes"}
                    </Button>
                  </div>
                  <p className="text-xs text-foreground/50">
                    Received {format(new Date(selectedLead.created_at), "d MMM yyyy 'at' HH:mm")}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the {leadToDelete ? sourceLabels[leadToDelete.source].toLowerCase() : ""} lead
              from {leadToDelete?.name ?? ""}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteLead} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminLeads;
