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
import { Eye, Trash2, Download, Search, Phone, Mail, Save } from "lucide-react";
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

interface Referral {
  id: string;
  affiliate_name: string;
  affiliate_email: string;
  affiliate_phone: string;
  referral_name: string;
  referral_phone: string;
  referral_email: string | null;
  referral_suburb: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

// Referral pipeline: new -> contacted -> converted (job won) -> paid (affiliate rewarded) / closed (didn't convert)
const REFERRAL_STATUSES = ["new", "contacted", "converted", "paid", "closed"] as const;

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  converted: "bg-green-100 text-green-800",
  paid: "bg-emerald-200 text-emerald-900",
  closed: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  paid: "Paid",
  closed: "Closed",
};

const escapeCsv = (value: string | null | undefined): string => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes("\"")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const AdminReferrals = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Referral | null>(null);
  const [toDelete, setToDelete] = useState<Referral | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (isAuthorized && user) {
      fetchReferrals();
    }
  }, [isAuthorized, user]);

  useEffect(() => {
    if (selected) {
      setNotesDraft(selected.notes ?? "");
    }
  }, [selected]);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals((data as Referral[]) ?? []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (referral: Referral, status: string) => {
    try {
      const { error } = await supabase.from("referrals").update({ status }).eq("id", referral.id);
      if (error) throw error;

      setReferrals((prev) => prev.map((r) => (r.id === referral.id ? { ...r, status } : r)));
      if (selected?.id === referral.id) {
        setSelected({ ...selected, status });
      }
      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from("referrals")
        .update({ notes: notesDraft })
        .eq("id", selected.id);
      if (error) throw error;

      setReferrals((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...r, notes: notesDraft } : r))
      );
      setSelected({ ...selected, notes: notesDraft });
      toast.success("Notes saved");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const deleteReferral = async () => {
    if (!toDelete) return;
    try {
      const { error } = await supabase.from("referrals").delete().eq("id", toDelete.id);
      if (error) throw error;

      setReferrals((prev) => prev.filter((r) => r.id !== toDelete.id));
      toast.success("Referral deleted");
      setToDelete(null);
    } catch (error) {
      console.error("Error deleting referral:", error);
      toast.error("Failed to delete referral");
    }
  };

  const filtered = useMemo(() => {
    return referrals.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (searchTerm) {
        const haystack = [
          r.affiliate_name,
          r.affiliate_email,
          r.affiliate_phone,
          r.referral_name,
          r.referral_phone,
          r.referral_email ?? "",
          r.referral_suburb ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchTerm.toLowerCase())) return false;
      }
      return true;
    });
  }, [referrals, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const byStatus = (status: string) => referrals.filter((r) => r.status === status).length;
    return {
      total: referrals.length,
      new: byStatus("new"),
      converted: byStatus("converted"),
      paid: byStatus("paid"),
    };
  }, [referrals]);

  const exportCsv = () => {
    const headers = [
      "Status",
      "Affiliate name",
      "Affiliate email",
      "Affiliate phone",
      "Referred person",
      "Referred phone",
      "Referred email",
      "Referred suburb",
      "Notes",
      "Created",
    ];
    const rows = filtered.map((r) => [
      escapeCsv(statusLabels[r.status] ?? r.status),
      escapeCsv(r.affiliate_name),
      escapeCsv(r.affiliate_email),
      escapeCsv(r.affiliate_phone),
      escapeCsv(r.referral_name),
      escapeCsv(r.referral_phone),
      escapeCsv(r.referral_email),
      escapeCsv(r.referral_suburb),
      escapeCsv(r.notes),
      escapeCsv(format(new Date(r.created_at), "yyyy-MM-dd HH:mm")),
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `referrals-${format(new Date(), "yyyy-MM-dd")}.csv`;
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

  if (!isAuthorized) return null;

  return (
    <AdminLayout>
      <SEO title="Referrals | Admin" description="Referral program submissions" url="/admin/referrals" />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif italic text-4xl text-primary mb-2">Referrals</h1>
          <p className="text-foreground/60">
            Track referral program submissions and commission payouts.
          </p>
        </div>
        <Button onClick={exportCsv} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

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
          <p className="text-sm text-foreground/60 mb-1">Converted</p>
          <p className="text-2xl font-serif text-green-700">{stats.converted}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">Paid</p>
          <p className="text-2xl font-serif text-emerald-800">{stats.paid}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search affiliate or referred person…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {REFERRAL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-foreground/60 py-12 text-center">Loading referrals…</div>
      ) : filtered.length === 0 ? (
        <div className="text-foreground/60 py-12 text-center border border-dashed border-border rounded-lg">
          No referrals match the current filters.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Referred by</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Referred person</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Suburb</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{r.affiliate_name}</div>
                      <div className="text-xs text-foreground/60">{r.affiliate_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{r.referral_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-sm">
                        <a href={`tel:${r.referral_phone}`} className="text-foreground hover:text-primary inline-flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> {r.referral_phone}
                        </a>
                        {r.referral_email && (
                          <a href={`mailto:${r.referral_email}`} className="text-foreground/60 hover:text-primary inline-flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> {r.referral_email}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/70">
                      {r.referral_suburb ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Select value={r.status} onValueChange={(value) => updateStatus(r, value)}>
                        <SelectTrigger className="w-[130px] h-8">
                          <Badge className={`${statusColors[r.status] ?? "bg-gray-100 text-gray-800"} border-0`}>
                            {statusLabels[r.status] ?? r.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {REFERRAL_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {statusLabels[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/60 whitespace-nowrap">
                      {format(new Date(r.created_at), "d MMM, HH:mm")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setToDelete(r)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Referral from {selected.affiliate_name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Referred by (affiliate)</p>
                  <p className="font-medium text-foreground">{selected.affiliate_name}</p>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <a href={`mailto:${selected.affiliate_email}`} className="text-sm text-foreground hover:text-primary inline-flex items-center gap-2">
                      <Mail className="w-3 h-3" /> {selected.affiliate_email}
                    </a>
                    <a href={`tel:${selected.affiliate_phone}`} className="text-sm text-foreground hover:text-primary inline-flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {selected.affiliate_phone}
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Referred person</p>
                  <p className="font-medium text-foreground">{selected.referral_name}</p>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <a href={`tel:${selected.referral_phone}`} className="text-sm text-foreground hover:text-primary inline-flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {selected.referral_phone}
                    </a>
                    {selected.referral_email && (
                      <a href={`mailto:${selected.referral_email}`} className="text-sm text-foreground hover:text-primary inline-flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {selected.referral_email}
                      </a>
                    )}
                    {selected.referral_suburb && (
                      <p className="text-sm text-foreground/70">{selected.referral_suburb}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Status</p>
                    <Select value={selected.status} onValueChange={(value) => updateStatus(selected, value)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REFERRAL_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusLabels[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Internal notes</p>
                    <Textarea
                      placeholder="Track follow-ups, conversion progress, commission amounts…"
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      rows={4}
                    />
                    <Button
                      onClick={saveNotes}
                      disabled={savingNotes || notesDraft === (selected.notes ?? "")}
                      className="mt-2 gap-2"
                      size="sm"
                    >
                      <Save className="w-4 h-4" />
                      {savingNotes ? "Saving…" : "Save notes"}
                    </Button>
                  </div>
                  <p className="text-xs text-foreground/50">
                    Received {format(new Date(selected.created_at), "d MMM yyyy 'at' HH:mm")}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this referral?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the referral from {toDelete?.affiliate_name ?? ""} for {toDelete?.referral_name ?? ""}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteReferral} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminReferrals;
